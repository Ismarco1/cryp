document.addEventListener('DOMContentLoaded', function() {
    // التحقق إذا كان الوضع الغامق مفعل من قبل في الذاكرة المحلية
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById("mode-icon").classList.remove("fa-sun");
        document.getElementById("mode-icon").classList.add("fa-moon");
    }

    // تفعيل الوضع الغامق
    document.getElementById("dark-mode-toggle").addEventListener("click", function() {
        toggleDarkMode();
    });

    // عند الضغط على زر التحويل للعملات
    document.getElementById("convert-btn").addEventListener("click", function() {
        const fromCurrency = document.getElementById("from-currency").value;
        const toCurrency = document.getElementById("to-currency").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (isNaN(amount) || amount <= 0) {
            alert("يرجى إدخال مبلغ صالح");
            return;
        }

        convertCurrency(fromCurrency, toCurrency, amount);
    });

    // جلب بيانات العملات من API
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            const currencies = data.rates;
            populateCurrencySelects(currencies);
        })
        .catch(error => {
            console.error('خطأ في جلب بيانات العملات:', error);
            alert('حدث خطأ في جلب بيانات العملات');
        });
});

// دالة لملء القوائم المنسدلة للعملات
function populateCurrencySelects(currencies) {
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    Object.keys(currencies).forEach(currencyCode => {
        const optionFrom = document.createElement("option");
        optionFrom.value = currencyCode;
        optionFrom.textContent = currencyCode;

        const optionTo = document.createElement("option");
        optionTo.value = currencyCode;
        optionTo.textContent = currencyCode;

        fromCurrencySelect.appendChild(optionFrom);
        toCurrencySelect.appendChild(optionTo);
    });
}

// دالة لتحويل العملة
function convertCurrency(fromCurrency, toCurrency, amount) {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            const rates = data.rates;
            const fromRate = rates[fromCurrency];
            const toRate = rates[toCurrency];

            if (fromRate && toRate) {
                const convertedAmount = (amount / fromRate) * toRate;
                document.getElementById("result").textContent = convertedAmount.toFixed(2);
            } else {
                document.getElementById("result").textContent = "خطأ في البيانات";
            }
        })
        .catch(error => {
            console.error('خطأ في عملية التحويل:', error);
            alert('حدث خطأ أثناء التحويل');
        });
}

// دالة لتبديل الوضع الغامق
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("mode-icon");

    if (document.body.classList.contains("dark-mode")) {
        // حفظ الوضع الغامق في الذاكرة المحلية
        localStorage.setItem('darkMode', 'enabled');
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    } else {
        // تعطيل الوضع الغامق وحفظ الحالة
        localStorage.setItem('darkMode', 'disabled');
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
}
