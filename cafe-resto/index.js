const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');

var admin = require("firebase-admin");
var serviceAccount = require("C:/Users/ACER/Desktop/node_modules/stbot-44a42-firebase-adminsdk-za28g-947251b078.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Connected to DB");
} catch (error) {
  console.log("Error here" + error);
}

var db = admin.firestore();

app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send("We are live")
});

app.post('/', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });
    function demo(agent){
        agent.add("Sending response from Webhook server");
    }
    function customPayloadDemo(agent){
        var payloadData = {
            "richContent": [
              [
                {
                  "type": "accordion",
                  "title": "Accordion title",
                  "subtitle": "Accordion subtitle",
                  "image": {
                    "src": {
                      "rawUrl": "https://example.com/images/logo.png",
                    },
                  },
                  "text": "Accordion text"
                },
              ],
            ],
          };

          agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}));
    }
    function finalConfirmation(agent){
        var name = agent.context.get("awaiting_name").parameters["given-name"];
        var email = agent.context.get("awaiting_email").parameters.email;

        console.log(name);
        console.log(email);
        agent.add(`Hello ${name}, your email: ${email}. We confirmed your meeting.`);
        return db.collection("meeting").add({
          name : name,
          email : email,
          time : Date.now()
        }).then(ref=>
          // fetching free slots from G-cal
          console.log("Meeting details added to DB"))
    }
    function openHours(agent){
      agent.add("Kami buka dari [Jam Buka] hingga [Jam Tutup] setiap hari. Apakah ada yang lain yang dapat kami bantu?");
    }
    function location(agent){
      agent.add("[Nama Kafe/Restoran] terletak di [lokasi]. Kami berharap dapat menyambut Anda segera!");
    }
    function wifi(agent){
      agent.add("Ya, kami menyediakan layanan Wi-Fi gratis untuk para pelanggan kami. Anda dapat mendapatkan kata sandi di kasir.");
    }
    function promo(agent){
      agent.add("Kami memiliki beberapa promo dan diskon spesial. Untuk informasi terbaru, silakan kunjungi halaman promo di situs web kami.");
    }
    function smokingArea(agent){
      agent.add("Tentu, kami menyediakan ruangan untuk merokok beserta dengan asbaknya.");
    }
    function halal(agent){
      agent.add("Kami menggunakan bahan-bahan berkualitas yang diolah secara halal. Kami juga sudah memperoleh sertifikat Halal dari MUI dengan nomor [ID]");
    }
    function liveMusic(agent){
      agent.add("Kami sering mengadakan pertunjukan musik langsung. Untuk jadwal acara terbaru, silakan cek situs web kami atau tanyakan kepada staf kami.");
    }
    function deliveryService(agent){
      var deliveryData = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Delivery Service",
              "subtitle": "Ya, kami menyediakan layanan pengantaran. Untuk memesan, Anda dapat memesan langsung dari bot ini atau melalui aplikasi pengiriman makanan sebagai berikut:",
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "Pesan melalui bot"
                },
                {
                  "text": "Pesan melalui aplikasi pengantaran makanan"
                }
              ]
            },
          ],
        ],
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, deliveryData, {sendAsMessage: true, rawPayload: true}));
    }
    function appDelivery(agent){
      var appData = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "App Delivery",
              "subtitle": "Silahkan pesan dari aplikasi preferensi anda!",
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "GoFood",
                  "image": {
                    "src": {
                      "rawUrl": "https://i.pinimg.com/originals/b1/e8/2a/b1e82a8eab25d73af3ec90e1e2c35e21.png",
                    }
                  },
                  "link": "https://gofood.co.id/",
                },
                {
                  "text": "ShopeeFood",
                  "image": {
                    "src": {
                      "rawUrl": "https://png.pngtree.com/png-clipart/20221224/original/pngtree-shopefood-logo-png-image_8801636.png",
                    }
                  },
                  "link": "https://shopee.co.id/m/shopeefood",
                },
                {
                  "text": "GrabFood",
                  "image": {
                    "src": {
                      "rawUrl": "https://www.liblogo.com/img-logo/gr11g6ed-grab-food-logo-grabfood-colour-sticker-by-grabfoodmy-for-ios-amp-android-.png",
                    }
                  },
                  "link": "https://food.grab.com/id/id/",
                },
              ],
            },
          ],
        ],
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, appData, { sendAsMessage: true, rawPayload: true }));
      }
// Declare variable nama, telepon and alamat
    var nama, telepon, alamat, pesanan, jumlah;
    function askPhoneNumber(agent){
      nama = agent.context.get("nama_costumer").parameters.person.name;
      console.log(nama);
      agent.add(`Oke kak ${nama}, boleh dituliskan nomor handphonenya? Supaya driver kami bisa dengan mudah menghubungi kakak :)`); 
      } 
    function askAddress(agent){
      telepon = agent.context.get("no_telepon").parameters["phone-number"];
      console.log(telepon);
      agent.add(`Nomor teleponnya ini ya kak ${telepon}, boleh dituliskan alamat rumahnya kak?`);
      }
    function orderMenu(agent){
      alamat = agent.context.get("alamat_rumah").parameters.location["street-address"];
      var displayMenu = {
        "richContent": [
          [
            {
              "subtitle": `Kakak beralamat di ${alamat}, mau pesan menu yang mana nih kak?`,
              "title": "Order Menu",
              "type": "info"
            },
            {
              "type": "chips",
              "options": [
                {
                  "text": "Cemilan"
                },
                {
                  "text": "Makanan Utama"
                },
                {
                  "text": "Minuman"
                }
              ]
            }
          ]
        ]
      } 
      console.log(alamat);
      agent.add(new dfff.Payload(agent.UNSPECIFIED, displayMenu, {sendAsMessage: true, rawPayload: true}));
      } 
    function fixOrder(agent) {
      var pesanan = agent.context.get("choose_menu").parameters.menu;
      var jumlah = agent.context.get("choose_menu").parameters.quantity;
      
      // Check if any of the required variables is undefined
      if (typeof nama === 'undefined' || typeof telepon === 'undefined' || typeof alamat === 'undefined' || typeof pesanan === 'undefined' || typeof jumlah === 'undefined') {
          console.error('One or more required variables are undefined. Cannot add data to Firestore.');
          agent.add('Maaf, terjadi kesalahan dalam memesan. Silakan coba lagi.');
          return;
        }
      
        console.log(pesanan + ' ' + jumlah);
        agent.add("Oke kak, silahkan tunggu ya dalam waktu 15-30 menit akan sampai ke rumah kakak! Terima kasih sudah mempercayai kami >_< Selamat makan!");
      
        return db.collection("order-db").add({
          name: nama,
          phone_number: telepon,
          address: alamat,
          order: pesanan,
          qty: jumlah,
          time: Date.now()
        }).then(ref =>
          console.log("Order details added to DB")
        ).catch(error => {
          console.error('Error adding order details to Firestore:', error);
          agent.add('Maaf, terjadi kesalahan dalam memesan. Silakan coba lagi.');
        });
      }
      
    var intentMap = new Map();
    intentMap.set('webhookDemo',demo);
    intentMap.set('customPayloadDemo',customPayloadDemo);
    intentMap.set('finalConfirmation',finalConfirmation);
    intentMap.set('Open Hours',openHours);
    intentMap.set('Location',location);
    intentMap.set('Wi-Fi',wifi);
    intentMap.set('Promo',promo);
    intentMap.set('Smoking Area',smokingArea);
    intentMap.set('Halal',halal);
    intentMap.set('Live Music',liveMusic);
    intentMap.set('Delivery Service',deliveryService);
    intentMap.set('App Delivery',appDelivery);
    intentMap.set('askPhoneNumber',askPhoneNumber);
    intentMap.set('askAddress',askAddress);
    intentMap.set('orderMenu',orderMenu);
    intentMap.set('fixOrder',fixOrder);
    agent.handleRequest(intentMap);
});
app.listen(3333, ()=>console.log("Server is live at port 3333"));
