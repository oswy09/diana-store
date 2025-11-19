export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    
    console.log('Received quotation request:', body)
    
    if (!config.public.supabaseUrl || !config.public.supabaseKey) {
      console.error('Missing Supabase configuration')
      setResponseStatus(event, 400)
      return {
        success: false,
        error: 'Supabase configuration is missing'
      }
    }

    // Validar datos requeridos
    if (!body.customer_name || !body.customer_phone || body.total_amount === undefined || !body.items) {
      console.error('Missing required fields')
      setResponseStatus(event, 400)
      return {
        success: false,
        error: 'Missing required fields'
      }
    }

    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    )

    const quotationData = {
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || null,
      payment_method: body.payment_method || '1_cuota',
      total_amount: parseFloat(body.total_amount),
      items: body.items,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('quotations')
      .insert([quotationData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      setResponseStatus(event, 500)
      return {
        success: false,
        error: `Database error: ${error.message}`
      }
    }

    return {
      success: true,
      data: data,
      message: 'Quotation created successfully'
    }

  } catch (error: any) {
    console.error('Server error creating quotation:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message || 'Unknown server error'
    }
  }
})