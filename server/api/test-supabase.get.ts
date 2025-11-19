export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Verificar que las variables de entorno estén disponibles
    if (!config.public.supabaseUrl || !config.public.supabaseKey) {
      return {
        success: false,
        error: 'Supabase configuration missing',
        config: {
          hasUrl: !!config.public.supabaseUrl,
          hasKey: !!config.public.supabaseKey,
          url: config.public.supabaseUrl?.substring(0, 30) + '...' || 'missing'
        }
      }
    }

    // Importar Supabase dinámicamente
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    )

    // Probar conexión simple
    const { data, error } = await supabase
      .from('quotations')
      .select('count')
      .limit(1)

    if (error) {
      return {
        success: false,
        error: 'Supabase connection error',
        details: error.message,
        code: error.code
      }
    }

    return {
      success: true,
      message: 'Supabase connection successful',
      data: data
    }

  } catch (error: any) {
    return {
      success: false,
      error: 'Server error',
      details: error.message,
      stack: error.stack
    }
  }
})