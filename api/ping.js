module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      ok: true,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      storageDriver: process.env.STORAGE_DRIVER || null,
      now: new Date().toISOString()
    })
  );
};
