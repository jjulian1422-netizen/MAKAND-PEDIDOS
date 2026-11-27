// Login y sincronización con Supabase (esquema "pedidos"). Reemplaza al bucket público de kvdb.io.
// Si config-supabase.js no está configurado, la app sigue en modo local (como antes).
(() => {
  const cfg = window.SUPABASE_CFG || {};
  const configurado = Boolean(
    window.supabase && cfg.url && cfg.anonKey && !/^PEGAR/.test(cfg.url) && !/^PEGAR/.test(cfg.anonKey)
  );
  const sb = configurado
    ? window.supabase.createClient(cfg.url, cfg.anonKey, { db: { schema: "pedidos" } })
    : null;

  // ---------------------------------------------------------------- Login
  window.NubeAuth = {
    activo: Boolean(sb),

    // true = contraseña válida; false = incorrecta; lanza Error si no hay conexión
    async login(perfilId, clave) {
      const email = (cfg.correos || {})[perfilId];
      if (!email) return false;
      const { data, error } = await sb.auth.signInWithPassword({ email, password: clave });
      if (error) {
        if (error.name === "AuthApiError") return false;
        throw new Error("Sin conexión con el servidor. Se necesita internet para iniciar sesión.");
      }
      const { data: perf } = await sb.from("perfiles").select("perfil").eq("user_id", data.user.id).maybeSingle();
      if (!perf || perf.perfil !== perfilId) {
        await sb.auth.signOut();
        return false;
      }
      return true;
    },

    // Cambia la contraseña del perfil con sesión iniciada
    async cambiarClave(clave) {
      const { error } = await sb.auth.updateUser({ password: clave });
      if (error) throw new Error(error.message);
    },

    async logout() {
      try { await sb.auth.signOut(); } catch (e) {}
    }
  };

  if (!sb) {
    // Sin Supabase configurado: la app funciona solo en local
    window.publicarEstadoEnNubeMultidispositivo = async function () {};
    window.sincronizarDesdeNubeHaciaDispositivo = async function () {};
    window.migrarKvdbASupabase = function () { alert("Supabase no está configurado en config-supabase.js"); };
    return;
  }

  // ----------------------------------------------------------- Sincronización
  const LS_SINCE = "agri_sb_since_v1";
  const publicado = new Map();        // "tabla:id" -> JSON de la última versión subida/recibida
  const eliminadosEnviados = new Set();
  let ocupado = false;
  let pendiente = false;
  let publicoInicial = false;

  async function haySesion() {
    const { data } = await sb.auth.getSession();
    return Boolean(data && data.session);
  }

  async function subir(tabla, lista, conFecha) {
    const elim = new Set(obtenerIdsEliminadosLocales());
    const filas = [];
    for (const it of lista) {
      if (!it || !it.id || elim.has(it.id)) continue;
      const json = JSON.stringify(it);
      const k = tabla + ":" + it.id;
      if (publicado.get(k) === json) continue;
      const fila = { id: String(it.id), data: it, deleted: false };
      if (conFecha) {
        fila.fecha = it.fecha || estado.fecha;
        fila.usuario_id = it.usuarioId || estado.perfilActivo;
      }
      filas.push({ k, json, fila });
    }
    for (let i = 0; i < filas.length; i += 200) {
      const lote = filas.slice(i, i + 200);
      const { error } = await sb.from(tabla).upsert(lote.map(x => x.fila), { onConflict: "id" });
      if (error) throw error;
      lote.forEach(x => publicado.set(x.k, x.json));
    }
  }

  async function marcarEliminados() {
    const nuevos = obtenerIdsEliminadosLocales().filter(id => !eliminadosEnviados.has(id));
    if (!nuevos.length) return;
    for (const t of ["pedidos", "entregas"]) {
      const { error } = await sb.from(t).update({ deleted: true }).in("id", nuevos);
      if (error) throw error;
    }
    nuevos.forEach(id => eliminadosEnviados.add(id));
  }

  window.publicarEstadoEnNubeMultidispositivo = async function () {
    if (ocupado) { pendiente = true; return; }
    if (!estado.perfilActivo || !(await haySesion())) return;
    ocupado = true;
    actualizarIndicadorCloudUI("sincronizando");
    try {
      const esAdmin = estado.perfilActivo === "admin";
      const mios = x => esAdmin || x.usuarioId === estado.perfilActivo;
      await subir("pedidos", estado.pedidos.filter(mios), true);
      await subir("entregas", estado.entregas.filter(mios), true);
      await subir("catalogo", estado.catalogo, false);
      await marcarEliminados();
      actualizarIndicadorCloudUI("ok");
    } catch (err) {
      console.error("Sync publicar:", err);
      actualizarIndicadorCloudUI("offline", "Guardado en cola local");
    } finally {
      ocupado = false;
      if (pendiente) { pendiente = false; publicarEstadoEnNubeMultidispositivo(); }
    }
  };

  async function leerCambios(tabla, desde, acumular) {
    let maxTs = desde;
    for (let ini = 0; ; ini += 1000) {
      const { data, error } = await sb.from(tabla)
        .select("id,data,deleted,updated_at")
        .gt("updated_at", desde)
        .order("updated_at", { ascending: true }).order("id", { ascending: true })
        .range(ini, ini + 999);
      if (error) throw error;
      data.forEach(r => {
        if (r.updated_at > maxTs) maxTs = r.updated_at;
        acumular(r);
      });
      if (data.length < 1000) break;
    }
    return maxTs;
  }

  window.sincronizarDesdeNubeHaciaDispositivo = async function (silencioso = true) {
    if (ocupado || !(await haySesion())) return;
    ocupado = true;
    if (!silencioso) actualizarIndicadorCloudUI("sincronizando");
    try {
      const guardado = localStorage.getItem(LS_SINCE);
      // 60 s de margen: reprocesar es idempotente y evita perder filas de transacciones lentas
      const desde = guardado ? new Date(new Date(guardado).getTime() - 60000).toISOString() : "1970-01-01T00:00:00Z";
      const nuevos = { pedidos: [], entregas: [], catalogo: [] };
      const borrados = [];
      let maxTs = guardado || "1970-01-01T00:00:00Z";
      for (const t of ["pedidos", "entregas", "catalogo"]) {
        const ts = await leerCambios(t, desde, r => {
          if (r.deleted) borrados.push(r.id); else nuevos[t].push(r.data);
        });
        if (ts > maxTs) maxTs = ts;
      }

      const eliminados = Array.from(new Set([...obtenerIdsEliminadosLocales(), ...borrados])).slice(-500);
      localStorage.setItem("agri_ids_eliminados_v53", JSON.stringify(eliminados));
      borrados.forEach(id => eliminadosEnviados.add(id));

      const cantAntes = estado.pedidos.length;
      estado.pedidos = fusionarColeccionPorId(estado.pedidos, nuevos.pedidos, eliminados);
      estado.entregas = fusionarColeccionPorId(estado.entregas, nuevos.entregas, eliminados);

      // Lo recibido del servidor ya está en la nube: no se vuelve a subir (evita bucles de sincronización)
      const mapaPed = new Map(estado.pedidos.map(x => [x.id, x]));
      const mapaEnt = new Map(estado.entregas.map(x => [x.id, x]));
      nuevos.pedidos.forEach(r => { if (mapaPed.get(r.id) === r) publicado.set("pedidos:" + r.id, JSON.stringify(r)); });
      nuevos.entregas.forEach(r => { if (mapaEnt.get(r.id) === r) publicado.set("entregas:" + r.id, JSON.stringify(r)); });

      let huboCambioCatalogo = false;
      const mapaCat = new Map((estado.catalogo || []).map(p => [p.id, p]));
      nuevos.catalogo.forEach(rem => {
        if (!rem || !rem.id) return;
        const loc = mapaCat.get(rem.id);
        if (!loc) {
          estado.catalogo.push(rem);
          publicado.set("catalogo:" + rem.id, JSON.stringify(rem));
          huboCambioCatalogo = true;
        } else if (new Date(rem.ultimaActualizacionPrecio || 0) > new Date(loc.ultimaActualizacionPrecio || 0)) {
          Object.assign(loc, rem);
          publicado.set("catalogo:" + rem.id, JSON.stringify(loc));
          huboCambioCatalogo = true;
        }
      });
      if (huboCambioCatalogo) {
        localStorage.setItem("agri_catalogo_maestro_v4", JSON.stringify(estado.catalogo));
        renderizarSelectFiltroProductos();
        renderizarSemaforoCobertura();
        renderizarListaProveedoresSugeridos();
      }

      localStorage.setItem("agri_pedidos_v4", JSON.stringify(estado.pedidos));
      localStorage.setItem("agri_entregas_v4", JSON.stringify(estado.entregas));
      localStorage.setItem(LS_SINCE, maxTs);

      renderizarPedidosDelDia();
      renderizarSemaforoCobertura();
      renderizarBuzonEntregas();
      if (!document.getElementById("modalHistoricoSQL")?.classList.contains("hidden")) {
        renderizarTablaHistoricoSQL();
      }

      actualizarIndicadorCloudUI("ok");
      if (!silencioso || estado.pedidos.length !== cantAntes) {
        mostrarToast(`☁️ Dispositivo sincronizado: ${fmtMiles(estado.pedidos.length)} pedidos en base común.`);
      }
    } catch (err) {
      console.error("Sync leer:", err);
      actualizarIndicadorCloudUI("offline");
    } finally {
      ocupado = false;
    }
    if (!publicoInicial && estado.perfilActivo) {
      publicoInicial = true;
      publicarEstadoEnNubeMultidispositivo();
    }
  };

  // Al cambiar de perfil/sesión se vuelve a publicar el estado local una vez
  sb.auth.onAuthStateChange((evento) => {
    if (evento === "SIGNED_IN") publicoInicial = false;
    if (evento === "SIGNED_OUT") localStorage.removeItem(LS_SINCE);
  });

  // ------------------------------------------- Migración única desde kvdb.io
  // Solo Gerencia, una vez: trae los datos del bucket viejo y los sube a Supabase.
  window.migrarKvdbASupabase = async function () {
    if (estado.perfilActivo !== "admin") { alert("Solo Gerencia puede migrar."); return; }
    const c = obtenerConfiguracionNubeYOutlook();
    const clave = (c.codigoEmpresa || "AGROGESTION_CORP_2026").replace(/[^A-Z0-9_-]/gi, "_");
    const resp = await fetch(`https://kvdb.io/Agu2p6V8wX9mK3rT5nQ1sL/agrogestion_pro_v53_sync_${clave}`, { cache: "no-store" });
    if (!resp.ok) { alert("No se pudo leer el bucket anterior (" + resp.status + ")."); return; }
    const remoto = await resp.json();
    const elim = Array.isArray(remoto.idsEliminados) ? remoto.idsEliminados : [];
    estado.pedidos = fusionarColeccionPorId(estado.pedidos, remoto.pedidos || [], elim);
    estado.entregas = fusionarColeccionPorId(estado.entregas, remoto.entregas || [], elim);
    localStorage.setItem("agri_pedidos_v4", JSON.stringify(estado.pedidos));
    localStorage.setItem("agri_entregas_v4", JSON.stringify(estado.entregas));
    await publicarEstadoEnNubeMultidispositivo();
    renderizarPedidosDelDia();
    mostrarToast(`📦 Migración lista: ${fmtMiles(estado.pedidos.length)} pedidos y ${fmtMiles(estado.entregas.length)} entregas subidos a Supabase.`);
  };
})();
