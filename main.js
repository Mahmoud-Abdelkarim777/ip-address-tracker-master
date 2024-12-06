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
LoadingMessage.style.display = "none"; // إخفاء الرسالة بشكل افتراضي

let map; 
Arrow.onclick = function() {
    let ip = Search.value.trim(); // تأكد من أن القيمة ليست فارغة
    if (ip && !isRequesting) {  // تأكد من أنه لا يوجد طلب جاري حاليًا
        showLoading(true); // إظهار رسالة "Loading..."
        isRequesting = true; // وضع علامة على أنه تم بدء طلب
        getUser(ip);
    } else if (!ip) {
        alert("Please enter a valid IP address.");
    }
};
updateMap(43.6532,-79.3832)
async function getUser(ip_user) {
    try {
        // التأخير بين الطلبات
        await delay(2000); // تأخير 2 ثانية قبل كل طلب
        
        const response = await axios.get(`http://ip-api.com/json/${ip_user}`);
        let data = response.data;
        console.log(data);
        Ip.innerHTML = data.query;
        City.innerHTML = data.city || "Not available";
        Country.innerHTML = data.countryCode || "Not available";
        GeonameId.innerHTML = data.country || "Not available";
        Timezone.innerHTML = data.timezone || "Not available";
        Isp.innerHTML = data.isp || "Not available";

        if (data.lat && data.lon) {
            // إذا كانت الإحداثيات موجودة، قم بتحديث الخريطة
            updateMap(data.lat, data.lon);
        }

        showLoading(false); // إخفاء رسالة "Loading..."
    } catch (error) {
        console.error(error);
        showLoading(false); // إخفاء رسالة "Loading..." في حالة حدوث خطأ
        alert("Error fetching data. Please try again.");
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
