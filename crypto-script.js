document.addEventListener('DOMContentLoaded', function() {
    // التحقق إذا كان الوضع الغامق مفعل من قبل في الذاكرة
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById("mode-icon").classList.remove("fa-sun");
        document.getElementById("mode-icon").classList.add("fa-moon");
    }

    // تفعيل الوضع الغامق
    document.getElementById("dark-mode-toggle").addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        const icon = document.getElementById("mode-icon");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem('darkMode', 'enabled');
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        } else {
            localStorage.setItem('darkMode', 'disabled');
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    });

    // جلب العملات الرقمية من API
    fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.json())
        .then(data => {
            console.log("بيانات العملات الرقمية تم جلبها بنجاح:", data); // نطبع البيانات في الكونسول
            const cryptoCurrencySelect = document.getElementById("crypto-currency");

            // التأكد من أن البيانات ليست فارغة
            if (data && Array.isArray(data)) {
                data.forEach(coin => {
                    const option = document.createElement("option");
                    option.value = coin.id;
                    option.textContent = coin.name;
                    cryptoCurrencySelect.appendChild(option);
                });
            } else {
                console.error("البيانات غير صحيحة أو فارغة");
            }
        })
        .catch(error => {
            console.error('حدث خطأ في جلب بيانات العملات الرقمية:', error);
        });

    // عند الضغط على زر التحويل للعملات الرقمية
    document.getElementById("convert-crypto-btn").addEventListener("click", function() {
        const selectedCrypto = document.getElementById("crypto-currency").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (isNaN(amount) || amount <= 0) {
            alert("يرجى إدخال مبلغ صالح");
            return;
        }

        convertCryptoCurrency(selectedCrypto, amount);
    });

    // دالة لتحويل العملة الرقمية
    function convertCryptoCurrency(fromCurrency, amount) {
        const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=usd`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data[fromCurrency] && data[fromCurrency].usd) {
                    const rate = data[fromCurrency].usd;
                    const convertedAmount = rate * amount;
                    document.getElementById("crypto-result").textContent = `${convertedAmount.toFixed(2)} دولار أمريكي`;
                } else {
                    document.getElementById("crypto-result").textContent = "خطأ في البيانات";
                }
            })
            .catch(error => {
                console.error('خطأ في عملية التحويل:', error);
                document.getElementById("crypto-result").textContent = "حدث خطأ أثناء التحويل";
            });
    }
});
