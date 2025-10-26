// Function to get client token from your server
async function getClientToken() {
  try {
    const response = await fetch('https://api.chomba.tech/client_token', {  // Your public endpoint
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Token fetch failed');
    return await response.text();  // Token is plain text
  } catch (error) {
    console.error('Error fetching token:', error);
    alert('Payment setup failed. Please try again.');
  }
}

// Initialize Braintree Drop-in UI (simple hosted form)
async function initializeBraintree() {
  const clientToken = await getClientToken();
  if (!clientToken) return;

  braintree.dropin.create({
    authorization: clientToken,  // The token from your server
    container: '#dropin-container',  // ID of a <div> on your page
    locale: 'en_US',  // Optional
    card: {
      cardholderName: true  // Show name field
    }
  }, (createErr, instance) => {
    if (createErr) {
      console.error('Drop-in error:', createErr);
      return;
    }
    // Now handle payment submission
    document.querySelector('#submit-button').addEventListener('click', async () => {
      try {
        const { nonce, details } = await instance.requestPaymentMethod();
        // Send nonce to your server for processing (add a /checkout endpoint later)
        console.log('Payment method nonce:', nonce);  // Use this to create transaction
        alert(`Payment authorized for ${details.cardType} ending in ${details.lastFour}`);
      } catch (error) {
        console.error('Payment error:', error);
      }
    });
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', initializeBraintree);
