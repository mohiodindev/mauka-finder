const stripe = Stripe('pk_test_51ISJHfIuBE9sjcWheE9Wo69HaCNmZYgT9ENRV2gB4No191YMKeSoYaGsBMVw0qZe2gv9euGho8fWpVpfsIBVfhMB00dcT2kNW4')

const checkoutBtn = document.getElementById('checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
        axios.post(`/offers/${offerId}/paid`)
            .then((response) => {
                stripe.redirectToCheckout({
                    sessionId: response.data.sessionId,
                })
                .then( function(result) {
                    if (result.error) {
                        console.error(result.error.message);
                    };
                });
            });
    });
}