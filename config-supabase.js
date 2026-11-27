// Configuración de Supabase. La clave "anon" es pública por diseño (la seguridad la dan las reglas RLS).
// NUNCA pegues aquí la clave "service_role".
window.SUPABASE_CFG = {
  url: "https://dakvhdubmluvjywwddtq.supabase.co",
  anonKey: "sb_publishable_SmvirM0M_y0g6QJQg3PaDg_a9Pj4s0v",
  // Correo interno de cada perfil (el usuario solo escribe su contraseña)
  correos: {
    admin: "admin.pedidos@makand.com.co",
    claudia: "claudia.pedidos@makand.com.co",
    camilo: "camilo.pedidos@makand.com.co"
  }
};
