<script setup lang="ts">
const supabase = useSupabaseClient()

const props = defineProps<{
  visible: boolean
  episodeNumber: number
  dramaTitle: string
}>()

const emit = defineEmits<{
  close: []
}>()

// Fetch VIP plans from database
const { data: plans } = useAsyncData('vip-plans', async () => {
  const { data } = await supabase
    .from('vip_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []).map((p: any) => ({
    id: p.plan_key,
    name: p.name,
    price: Number(p.price),
    priceStr: `$${Number(p.price).toFixed(2)}`,
    period: p.plan_key === 'monthly' ? '/mo' : p.plan_key === 'quarterly' ? '/3mo' : p.plan_key === 'yearly' ? '/yr' : '',
    badge: p.badge || '',
  }))
})

const selectedPlan = ref('quarterly')
const step = ref<'plan' | 'pay' | 'processing' | 'success'>('plan')
const payMethod = ref<'paypal' | 'stripe' | null>(null)

// Stripe card form (mock)
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardName = ref('')

const selectedPlanData = computed(() => plans.value?.find(p => p.id === selectedPlan.value))

const goToPay = () => {
  step.value = 'pay'
  payMethod.value = null
}

const selectPayMethod = (method: 'paypal' | 'stripe') => {
  payMethod.value = method
}

const handlePay = async () => {
  step.value = 'processing'
  // Simulate payment processing
  await new Promise(r => setTimeout(r, 2500))
  step.value = 'success'
  await new Promise(r => setTimeout(r, 1500))
  step.value = 'plan'
  payMethod.value = null
  emit('close')
}

const goBack = () => {
  if (step.value === 'pay') {
    step.value = 'plan'
    payMethod.value = null
  }
}

// Reset on close
watch(() => props.visible, (v) => {
  if (!v) {
    step.value = 'plan'
    payMethod.value = null
    cardNumber.value = ''
    cardExpiry.value = ''
    cardCvc.value = ''
    cardName.value = ''
  }
})

const formatCardNumber = (e: Event) => {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16)
  cardNumber.value = v.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatExpiry = (e: Event) => {
  let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
  cardExpiry.value = v
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="emit('close')">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div class="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">

          <!-- ===== Step 1: Choose Plan ===== -->
          <template v-if="step === 'plan'">
            <div class="p-6 text-center border-b border-gray-800">
              <div class="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Unlock Episode {{ episodeNumber }}</h2>
              <p class="text-gray-400 text-sm mt-1">{{ dramaTitle }}</p>
            </div>

            <div class="p-6 space-y-3">
              <p class="text-sm text-gray-400 mb-3">Choose a VIP plan to unlock all episodes:</p>
              <button
                v-for="plan in plans" :key="plan.id"
                @click="selectedPlan = plan.id"
                class="w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between"
                :class="selectedPlan === plan.id ? 'border-brand bg-brand/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="selectedPlan === plan.id ? 'border-brand' : 'border-gray-600'">
                    <div v-if="selectedPlan === plan.id" class="w-2.5 h-2.5 rounded-full bg-brand" />
                  </div>
                  <div class="text-left">
                    <span class="font-medium text-white">{{ plan.name }}</span>
                    <span class="text-gray-500 text-xs ml-1">{{ plan.period }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-white font-bold">{{ plan.priceStr }}</span>
                  <span v-if="plan.badge" class="ml-2 px-2 py-0.5 bg-brand/20 text-brand text-[10px] font-bold rounded-full">{{ plan.badge }}</span>
                </div>
              </button>
            </div>

            <div class="p-6 pt-0 space-y-3">
              <button @click="goToPay" class="w-full py-3.5 bg-gradient-to-r from-brand to-orange-500 hover:opacity-90 rounded-xl font-bold text-white transition-all">
                Continue to Payment — {{ selectedPlanData?.priceStr }}
              </button>
              <button @click="emit('close')" class="w-full py-2.5 text-gray-400 hover:text-white text-sm transition-colors">Maybe Later</button>
            </div>

            <div class="px-6 pb-6">
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 bg-gray-800/50 rounded-lg">
                  <svg class="w-5 h-5 mx-auto mb-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>
                  <p class="text-[10px] text-gray-400">All Episodes</p>
                </div>
                <div class="p-2 bg-gray-800/50 rounded-lg">
                  <svg class="w-5 h-5 mx-auto mb-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/></svg>
                  <p class="text-[10px] text-gray-400">No Lock</p>
                </div>
                <div class="p-2 bg-gray-800/50 rounded-lg">
                  <svg class="w-5 h-5 mx-auto mb-1 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  <p class="text-[10px] text-gray-400">Priority</p>
                </div>
              </div>
            </div>
          </template>

          <!-- ===== Step 2: Payment Method ===== -->
          <template v-if="step === 'pay'">
            <div class="p-5 border-b border-gray-800">
              <div class="flex items-center gap-3">
                <button @click="goBack" class="text-gray-400 hover:text-white transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                  <h2 class="text-lg font-bold text-white">Payment</h2>
                  <p class="text-gray-400 text-xs">{{ selectedPlanData?.name }} — {{ selectedPlanData?.priceStr }}</p>
                </div>
              </div>
            </div>

            <div class="p-6 space-y-3">
              <p class="text-sm text-gray-400 mb-2">Select payment method:</p>

              <!-- PayPal -->
              <button
                @click="selectPayMethod('paypal')"
                class="w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4"
                :class="payMethod === 'paypal' ? 'border-[#0070ba] bg-[#0070ba]/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'"
              >
                <div class="w-12 h-8 bg-[#0070ba] rounded flex items-center justify-center shrink-0">
                  <span class="text-white font-bold text-xs italic">Pay<span class="text-[#003087]">Pal</span></span>
                </div>
                <div class="text-left">
                  <p class="text-white font-medium text-sm">Pay with PayPal</p>
                  <p class="text-gray-500 text-xs">Fast & secure checkout</p>
                </div>
                <div class="ml-auto">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="payMethod === 'paypal' ? 'border-[#0070ba]' : 'border-gray-600'">
                    <div v-if="payMethod === 'paypal'" class="w-2.5 h-2.5 rounded-full bg-[#0070ba]" />
                  </div>
                </div>
              </button>

              <!-- Stripe -->
              <button
                @click="selectPayMethod('stripe')"
                class="w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4"
                :class="payMethod === 'stripe' ? 'border-[#635bff] bg-[#635bff]/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'"
              >
                <div class="w-12 h-8 bg-[#635bff] rounded flex items-center justify-center shrink-0">
                  <span class="text-white font-bold text-xs italic">Stripe</span>
                </div>
                <div class="text-left">
                  <p class="text-white font-medium text-sm">Pay with Card</p>
                  <p class="text-gray-500 text-xs">Visa, Mastercard, AMEX</p>
                </div>
                <div class="ml-auto">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="payMethod === 'stripe' ? 'border-[#635bff]' : 'border-gray-600'">
                    <div v-if="payMethod === 'stripe'" class="w-2.5 h-2.5 rounded-full bg-[#635bff]" />
                  </div>
                </div>
              </button>
            </div>

            <!-- PayPal checkout mock -->
            <Transition name="slide">
              <div v-if="payMethod === 'paypal'" class="px-6 pb-2">
                <div class="bg-white rounded-xl p-5">
                  <div class="flex items-center justify-center gap-2 mb-4">
                    <span class="text-[#003087] font-bold text-lg italic">Pay<span class="text-[#0070ba]">Pal</span></span>
                    <span class="text-gray-400 text-xs">Checkout</span>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3 mb-4 text-center">
                    <p class="text-gray-500 text-xs">Amount to pay</p>
                    <p class="text-2xl font-bold text-gray-900">{{ selectedPlanData?.priceStr }}</p>
                  </div>
                  <button
                    @click="handlePay"
                    class="w-full py-3 bg-[#ffc439] hover:bg-[#f0b828] rounded-full font-bold text-[#003087] text-sm transition-colors"
                  >
                    Pay with PayPal
                  </button>
                  <p class="text-center text-[10px] text-gray-400 mt-2">You'll be redirected to PayPal (demo)</p>
                </div>
              </div>
            </Transition>

            <!-- Stripe card form mock -->
            <Transition name="slide">
              <div v-if="payMethod === 'stripe'" class="px-6 pb-2">
                <div class="bg-white rounded-xl p-5">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-[#635bff] font-bold text-sm">Card Payment</span>
                    <div class="flex gap-1">
                      <div class="w-8 h-5 bg-[#1a1f71] rounded-sm flex items-center justify-center"><span class="text-white text-[7px] font-bold italic">VISA</span></div>
                      <div class="w-8 h-5 bg-[#eb001b]/80 rounded-sm flex items-center justify-center"><span class="text-white text-[7px] font-bold">MC</span></div>
                      <div class="w-8 h-5 bg-[#006fcf] rounded-sm flex items-center justify-center"><span class="text-white text-[7px] font-bold">AMEX</span></div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Email</label>
                      <input type="email" placeholder="your@email.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Cardholder name</label>
                      <input v-model="cardName" placeholder="Full name" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Card number</label>
                      <div class="relative">
                        <input :value="cardNumber" @input="formatCardNumber" placeholder="1234 5678 9012 3456" maxlength="19" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none pr-10" />
                        <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">Expiry</label>
                        <input :value="cardExpiry" @input="formatExpiry" placeholder="MM/YY" maxlength="5" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none" />
                      </div>
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">CVC</label>
                        <input v-model="cardCvc" placeholder="123" maxlength="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none" />
                      </div>
                    </div>
                  </div>
                  <button
                    @click="handlePay"
                    class="w-full mt-4 py-3 bg-[#635bff] hover:bg-[#5149e0] rounded-lg font-bold text-white text-sm transition-colors"
                  >
                    Pay {{ selectedPlanData?.priceStr }}
                  </button>
                  <p class="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/></svg>
                    Secured by Stripe (demo)
                  </p>
                </div>
              </div>
            </Transition>

            <div class="p-6 pt-3">
              <button @click="emit('close')" class="w-full py-2.5 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
            </div>
          </template>

          <!-- ===== Processing ===== -->
          <template v-if="step === 'processing'">
            <div class="p-16 text-center">
              <div class="w-16 h-16 mx-auto mb-6 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
              <p class="text-white font-bold text-lg">Processing Payment...</p>
              <p class="text-gray-400 text-sm mt-2">Please wait while we confirm your payment</p>
            </div>
          </template>

          <!-- ===== Success ===== -->
          <template v-if="step === 'success'">
            <div class="p-16 text-center">
              <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p class="text-white font-bold text-xl">Payment Successful!</p>
              <p class="text-gray-400 text-sm mt-2">You're now a VIP member</p>
              <p class="text-brand text-sm mt-1 font-medium">{{ selectedPlanData?.name }} Plan Activated</p>
            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(10px); }
</style>
