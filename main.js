let Ip = document.getElementById("ip");
let City = document.getElementById("city");
let Country = document.getElementById("country");
let GeonameId = document.getElementById("geonameId");
let Timezone = document.getElementById("timezone");
let Isp = document.getElementById("isp");

let Search = document.getElementById("search");
let Arrow = document.getElementById("arrow");

let isRequesting = false; // متغير للتحقق من إذا كان هناك طلب جارٍ تنفيذه أم لا

// إضافة رسالة "Loading..." للمستخدم
let LoadingMessage = document.getElementById("loading");
LoadingMessage.style.display = "none";

let map; 
Arrow.onclick = function () {
    let ip = Search.value.trim(); // تأكد من أن القيمة ليست فارغة
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if ((ipRegex.test(ip) || domainRegex.test(ip)) && !isRequesting) {
        showLoading(true); // إظهار رسالة "Loading..."
        isRequesting = true; // وضع علامة على أنه تم بدء طلب
        getUser(ip);
    } else if (!ip) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Please enter a valid IP address or domain name 🤨",
            customClass: {
                popup: "z-[99999]",
            },
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Invalid Input 😔",
            text: "The input must be a valid IP address or domain name!",
            customClass: {
                popup: "z-[99999]",
            },
        });
    }
};

updateMap(43,-79)
async function getUser(ip_user) {
    try {
        // التأخير بين الطلبات
        await delay(2000); // تأخير 2 ثانية قبل كل طلب

        const apiKey = "6de35c640782e8e3ec996bef39b0823b";
        const response = await axios.get(`https://api.ipstack.com/${ip_user}?access_key=${apiKey}`);
        let data = response.data;
        console.log(data);
        Ip.innerHTML = data.ip || "Not available";
        City.innerHTML = data.city || "Not available";
        Country.innerHTML = data.country_code || "😔";
        GeonameId.innerHTML = data.country_name || "😔";
        Timezone.innerHTML = data.region_name|| "Not available";

        if (data.latitude && data.longitude) {
            updateMap(data.latitude, data.longitude);
        }

        showLoading(false); // إخفاء رسالة "Loading..."
    } catch (error) {
        console.error(error);
        showLoading(false); // إخفاء رسالة "Loading..." في حالة حدوث خطأ
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error fetching data. Please try again 😔",
            customClass: {
                popup: "z-[99999]",
            },
        });
    } finally {
        isRequesting = false; // عند الانتهاء من الطلب، إعادة تعيين متغير الطلب
    }
}

// دالة تأخير
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// دالة لعرض أو إخفاء رسالة "Loading..."
function showLoading(isLoading) {
    if (isLoading) {
        LoadingMessage.style.display = "block"; // إظهار الرسالة
    } else {
        LoadingMessage.style.display = "none"; // إخفاء الرسالة
    }
}

// التهيئة وإنشاء الخريطة
function updateMap(lat, lon) {
    // إذا كانت الخريطة موجودة بالفعل، قم بإزالة الخريطة السابقة
    if (map) {
        map.remove();
    }

    // تهيئة الخريطة مع الإحداثيات الجديدة
    map = L.map('map').setView([lat, lon], 13);

    // إضافة خريطة OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var customIcon = L.icon({
        iconUrl: './images/icon-location.svg', // قم بتحديد المسار الصحيح للصورة
        iconSize: [50, 50],  // حجم الأيقونة
        iconAnchor: [25, 50],  // النقطة التي سيتم تثبيت الأيقونة عليها
        popupAnchor: [0, -50]  // تعديل مكان الفقاعة الخاصة بـ popup
    });

    // إضافة علامة للموقع
    L.marker([lat, lon], { icon: customIcon }).addTo(map)
                .bindPopup("<b>Your Location</b>")
                .openPopup();
}
