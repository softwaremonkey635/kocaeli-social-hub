import { ActivityEvent, ClubInfo, Testimonial, GalleryItem, FAQItem, SponsorItem } from '../types';

const BASE = import.meta.env.BASE_URL;

export const ACTIVITIES_DATA: ActivityEvent[] = [
  {
    id: 'speaking-club',
    title: 'Speaking Club',
    subtitle: 'Grammar Polisi Giremez! İngilizce Konuşma Kulübü',
    category: 'language',
    categoryName: 'Dil & İletişim',
    day: 'Her hafta Cumartesi',
    dayOfWeek: 6,
    time: '18:00 - 20:00',
    location: '',
    district: 'Kocaeli',
    pricing: 'Ücretsiz',
    capacity: '20 - 25 Kişi',
    badge: 'En Popüler',
    nextDate: '26 Eylül Cumartesi, 18:00',
    targetAudience: 'Her seviyeden İngilizce pratik yapmak isteyen gençler ve üniversiteliler',
    image: `${BASE}images/events/speaking-club.jpeg`,
    description:
      'Hata yapmaktan korkmadan, samimi bir masa etrafında çay-kahve eşliğinde İngilizce sohbet ediyoruz. Kuralımız net: "Grammar polisi giremez!" Amacımız akıcı konuşma cesareti kazanmak, yeni arkadaşlıklar kurmak ve eğlenceli buz kırıcı oyunlarla dil pratiği yapmak.',
    highlights: [
      'Seviye baskısı yok, rahat ve samimi bir ortam',
      'Haftalık belirlenen ilgi çekici münazara & sohbet temaları',
      'İnteraktif kutu ve konuşma kartı oyunları',
      'Kahve eşliğinde yeni insanlarla tanışma fırsatı'
    ],
    rules: [
      'Kimse kimsenin telaffuzunu veya gramer hatasını eleştirmez',
      'Herkesin eşit konuşma süresi vardır',
      'Pozitif ve kapsayıcı dil esastır'
    ]
  },
  {
    id: 'hiking',
    title: 'Hiking',
    subtitle: 'Kısa Mesafe Doğa Yürüyüşü',
    category: 'nature',
    categoryName: 'Doğa & Spor',
    day: 'Her Perşembe',
    dayOfWeek: 4,
    time: '18:00 - 20:00',
    location: '',
    district: 'Kocaeli',
    pricing: 'Ücretsiz',
    capacity: '30 Kişi',
    badge: 'Canlı & Dinamik',
    nextDate: '24 Eylül Perşembe, 18:00',
    targetAudience: 'Haftanın yorgunluğunu doğayla atmak ve temiz havada yürümek isteyen herkes',
    image: `${BASE}images/events/hiking.jpeg`,
    description:
      'İş ya da okul çıkışı doğanın kucağına kaçıyoruz! Kolay-orta seviye kısa mesafe parkurlarımızda hem sağlıklı bir yürüyüş yapıyor hem de harika sohbetler eşliğinde Kocaeli’nin yeşilini keşfediyoruz.',
    highlights: [
      '5-7 km hafif tempolu doğa yürüyüşü',
      'Gün batımı manzarası eşliğinde çay/atıştırmalık molası',
      'Fotoğraf çekimi ve doğa farkındalığı',
      'Farklı ilçelerden gelen doğasever gençlerle kaynaşma'
    ],
    rules: [
      'Rahat yürüyüş ayakkabısı ve mevsime uygun giysi önerilir',
      'Doğada kesinlikle çöp bırakılmaz, "İz Bırakma" ilkesi geçerlidir',
      'Grup liderinin belirlediği parkurdan ayrılınmaz'
    ]
  },
  {
    id: 'sanat-workshop',
    title: 'Biblo, Çanta & Kil Boyama Workshop',
    subtitle: 'Her Hafta Biri! Hangisinin Olacağı WhatsApp Grubumuzda Belirleniyor',
    category: 'art',
    categoryName: 'Sanat & Workshop',
    day: 'Her Pazar günü',
    dayOfWeek: 0,
    time: '18:00 - 20:00',
    location: '',
    district: 'Kocaeli',
    pricing: 'Malzeme Paylaşımlı',
    capacity: '15 - 20 Kişi',
    badge: 'Her Pazar 1 Tanesi!',
    nextDate: '27 Eylül Pazar, 18:00',
    targetAudience: 'Haftayı renklerle kapatmak, el sanatıyla üretmek ve tarzını yansıtmak isteyenler',
    image: `${BASE}images/events/biblo-boyama.jpeg`,
    subImages: [
      { title: 'Biblo Boyama Workshop', image: `${BASE}images/events/biblo-boyama.jpeg` },
      { title: 'Çanta Boyama Workshop', image: `${BASE}images/events/canta-boyama.jpeg` },
      { title: 'Kil Boyama & Şekillendirme', image: `${BASE}images/events/kil-boyama.jpeg` }
    ],
    whatsappFocus: true,
    whatsappNote: 'Önemli: Biblo, Çanta ve Kil boyama etkinliklerimiz her hafta 1 tanesi olacak şekilde dönerli yapılır. O hafta hangi atölyenin gerçekleşeceği ve mekan detayları WhatsApp topluluk grubumuzda oylama/duyuru ile belirlenmektedir. Katılım için WhatsApp grubumuza katılmanız gerekmektedir.',
    description:
      'Biblo boyama, bez çanta tasarımı ve kil şekillendirme atölyelerimiz her pazar dönüşümlü olarak düzenlenmektedir. Her hafta bu üç sanatsal atölyeden biri seçilir. Bu haftanın workshopunun hangisi olacağı WhatsApp grubumuzda toplulukla birlikte kararlaştırılır. Kendi el emeğinizi üreterek haftanın stresini geride bırakın!',
    highlights: [
      '3 Seçenek: Biblo Boyama, Bez Çanta Tasarımı veya Kil Şekillendirme',
      'Hangi atölyenin yapılacağı o hafta WhatsApp grubunda duyurulur',
      'Tüm ham malzemeler, fırçalar ve akrilik/tekstil boyaları hazır',
      'Ürettiğin özel eseri günün hatırası olarak evine götürürsün'
    ],
    rules: [
      'Önceden WhatsApp grubuna katılmış olmak',
      'Malzeme temini için kontenjan durumunu teyit etmek',
      'Pozitif, yaratıcı ve destekleyici bir atölye ruhu'
    ]
  },
  {
    id: 'camping',
    title: 'Kamp Etkinliklerimiz',
    subtitle: 'Kocaeli\'de Camping - 4 Mevsim Doğa Buluşmaları',
    category: 'nature',
    categoryName: 'Doğa & Macera',
    day: 'Tarih WhatsApp Grubunda Belirtilir',
    dayOfWeek: 5,
    time: 'Hafta Sonu (Detaylar WhatsApp\'ta)',
    location: '',
    district: 'Kocaeli',
    pricing: 'Malzeme Paylaşımlı',
    capacity: '40 Kişi',
    badge: 'Tarih WhatsApp\'ta',
    nextDate: 'Tarih WhatsApp Grubunda Belirtilir',
    targetAudience: 'Çadırını kapan, kamp ateşi başında şarkılara ve sohbetlere katılmak isteyen gençler',
    image: `${BASE}images/events/camping.jpeg`,
    whatsappFocus: true,
    whatsappNote: 'Önemli: Kamp etkinliklerimiz daha kapsamlı bir organizasyon ve lojistik/hava durumu hazırlığı gerektirdiği için kesin tarih, toplanma alanı ve katılım detayları WhatsApp topluluk grubumuzda önceden duyurulmaktadır.',
    description:
      'Yıldızların altında kamp ateşi, akustik gitar melodileri ve sıcacık dostluklar! Kocaeli’nin eşsiz sahillerinde ve yaylalarında güvenli, organize ve eğlenceli gençlik kampları düzenliyoruz. Kapsamlı bir organizasyon olduğu için kesin tarih ve toplanma noktaları WhatsApp topluluğumuzda belirlenir.',
    highlights: [
      'Ortak kamp ateşi, masal & hikaye çemberi',
      'Akustik müzik ve gece sohbetleri',
      'Sabah doğa yogası ve yürüyüş rotaları',
      'İlk defa kamp yapacaklar için çadır kurma ve ekipman desteği'
    ],
    rules: [
      'Çevreye ve yaban hayata saygı esastır',
      'Güvenlik ve nöbet kurallarına riayet edilir',
      'Katılımcılar arasında dayanışma ve ortak imece kültürü vardır'
    ]
  },
  {
    id: 'kitap-okuma',
    title: 'Kitap Okuma',
    subtitle: 'Kitap Okuma & Edebi Düşünce Söyleşisi',
    category: 'culture',
    categoryName: 'Kültür & Edebiyat',
    day: 'Her Çarşamba',
    dayOfWeek: 3,
    time: '18:00 - 20:00',
    location: '',
    district: 'Kocaeli',
    pricing: 'Ücretsiz',
    capacity: '10 Kişi',
    badge: 'Haftalık',
    nextDate: '23 Eylül Çarşamba, 18:00',
    targetAudience: 'Okuduğunu paylaşmayı, farklı bakış açılarını dinlemeyi seven kitap kurtları',
    image: `${BASE}images/events/kitap-soylesisi.jpeg`,
    description:
      'Her hafta seçilen bir eser veya belirli bir edebi/felsefi tema üzerine 10 kişilik butik ve samimi bir çemberde derinlemesine söyleşi. Düşüncelerini özgürce aktarabileceğin, yeni yazarlar keşfedeceğin ilham dolu iki saat.',
    highlights: [
      'Klasiklerden çağdaş edebiyata zengin kitap seçkisi',
      'Düşünceyi teşvik eden soru-cevap tartışmaları',
      'Kitap takası ve hediyeleşme köşesi',
      'Sakin, ilham verici ve samimi mekan seçimi'
    ]
  },
  {
    id: 'halk-oyunlari',
    title: 'Halk Oyunları',
    subtitle: 'Halk Oyunları Kursu Başlıyor! Kültür ve Ritim',
    category: 'dance',
    categoryName: 'Dans & Kültür',
    day: 'Her Salı',
    dayOfWeek: 2,
    time: '18:00 - 20:00',
    location: '',
    district: 'Kocaeli',
    pricing: 'Ücretsiz',
    capacity: '20 - 25 Kişi',
    badge: 'Yeni Başlayanlar',
    nextDate: '22 Eylül Salı, 18:00',
    targetAudience: 'Anadolu ritimleriyle tanışmak, temel figürleri öğrenmek ve enerjisini yükseltmek isteyenler',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=80',
    description:
      'Zeybek’in asaletinden Horon’un coşkusuna, Halay’ın birlikteliğine kadar zengin halk oyunları kültürümüzü profesyonel eğitmen eşliğinde adım adım öğreniyoruz. Sıfırdan başlayanlar için harika bir fırsat!',
    highlights: [
      'Temel ritim, adım ve duruş teknikleri',
      'Grup koordinasyonu ve sahne enerjisi',
      'Geleneksel kültürün modern ve dinamik yorumu',
      'Kondisyon artıran ve neşelendiren hareketli atmosfer'
    ]
  }
];

export const VISION_MISSION_DATA = {
  title: 'KOCAELİ SOSYAL',
  visionTitle: 'Vizyonumuz',
  visionParagraphs: [
    'Gençlerin kendilerini özgürce ifade edebildiği, sosyal çevrelerini geliştirdiği, yeni deneyimler kazandığı ve kendi alanlarında ilerleyebildiği güçlü, kapsayıcı ve sürdürülebilir bir gençlik topluluğu olmak.',
    'Kocaeli’de gençlerin yalnızca sosyal etkinliklere katıldığı değil, aynı zamanda kendini geliştirdiği, ürettiği, iletişim becerilerini güçlendirdiği ve topluma değer kattığı örnek bir sosyal oluşum haline gelmek.'
  ],
  missionTitle: 'Misyonumuz',
  missionIntro: 'Gençlerin kişisel, sosyal ve iletişim becerilerini geliştirmelerine katkı sağlayacak nitelikli ortamlar ve etkinlikler oluşturmak.',
  missionSubheading: 'Bu doğrultuda;',
  missionPoints: [
    'Speaking Club çalışmalarıyla gençlerin topluluk önünde konuşma ve kendini ifade etme becerilerini geliştirmek',
    'Workshoplar aracılığıyla farklı alanlarda yeni beceriler ve deneyimler kazandırmak',
    'Gezi ve kültür etkinlikleriyle farklı yerleri ve kültürel değerleri keşfetme fırsatı sunmak',
    'Kamplar ve doğa yürüyüşleriyle doğayla iç içe sosyal deneyimler oluşturmak',
    'Kitap söyleşileri ve kültürel buluşmalarla gençlerin düşünce dünyasını zenginleştirmek',
    'Sosyal etkinliklerle yeni insanlarla tanışabilecekleri ve kendilerini rahat hissedebilecekleri ortamlar oluşturmak',
    'Gençlerin kendi ilgi ve yetenekleri doğrultusunda gelişmelerine destek olmak',
    'Gençlerin aktif katılım sağlayabileceği, fikir üretebileceği ve sorumluluk alabileceği bir topluluk kültürü oluşturmak'
  ],
  closingStatement: 'Kocaeli Sosyal olarak amacımız, gençlerin kendilerini keşfetmelerine, özgüven kazanmalarına, sosyal çevrelerini geliştirmelerine ve kendi alanlarında ilerlemelerine katkı sağlamaktır.'
};

export const CLUBS_DATA: ClubInfo[] = [
  {
    id: 'speaking-club',
    name: 'Speaking Club Kocaeli',
    tagline: 'Grammar Polisi Olmadan, Özgürce Konuş!',
    icon: 'MessageSquare',
    schedule: 'Her Cumartesi 18:00 - 20:00',
    coordinator: 'Dil & İletişim Çalışma Grubu',
    color: 'from-blue-600 to-cyan-600',
    image: `${BASE}images/events/speaking-club.jpeg`,
    description:
      'Öğrenciler ve genç çalışanların yabancı dil çekingenliğini kıran, samimi masalarda gündelik ve eğlenceli konular konuştuğumuz popüler kulübümüz.',
    features: [
      'Grup içi münazaralar ve mini oyunlar',
      'Yurtdışı deneyim paylaşımları',
      'Sıfır yargı, tam destek mottosu',
      'Sürekli güncellenen konuşma kartları'
    ]
  },
  {
    id: 'art-workshop',
    name: 'Sanat & Atölye Kulübü',
    tagline: 'Üret, Tasarla, Kendini Renklerle Anlat',
    icon: 'Palette',
    schedule: 'Her Pazar 18:00 - 20:00',
    coordinator: 'Görsel Sanatlar & Tasarım Masası',
    color: 'from-orange-500 to-amber-500',
    image: `${BASE}images/events/biblo-boyama.jpeg`,
    description:
      'Biblo boyama, kil modelajı, bez çanta tasarımı ve ebru gibi birçok disiplinde el becerilerini geliştiren yaratıcı üretim alanı.',
    features: [
      'Tüm temel malzemeler temin edilir',
      'Her hafta farklı bir teknik odak noktası',
      'Kendi ürününü evine götürme imkanı',
      'Sanatsal terapi ve gevşeme seansları'
    ]
  },
  {
    id: 'nature-trekking',
    name: 'Doğa & Macera Kulübü',
    tagline: 'Kocaeli\'nin Dağları, Denizleri ve Patikaları',
    icon: 'Compass',
    schedule: 'Her Perşembe 18:00 & Hafta Sonu Kampları',
    coordinator: 'Outdoor & Çevre Ekibi',
    color: 'from-emerald-600 to-teal-600',
    image: `${BASE}images/events/hiking.jpeg`,
    description:
      'Kısa mesafe hiking yürüyüşleri, Menekşe Yaylası, Ballıkayalar, Ormanya ve Kandıra sahillerinde çadır kampları düzenleyen doğa tutkunları.',
    features: [
      'Güvenli ve işaretlenmiş parkur rehberliği',
      'Çadır ve kamp ekipman dayanışması',
      'Çevre temizliği ve doğa koruma bilinci',
      'Yıldız gözlemi ve kamp ateşi buluşmaları'
    ]
  },
  {
    id: 'literature-books',
    name: 'Kitap & Kültür Kulübü',
    tagline: 'Düşünce Dünyanı Zenginleştir, Fikirlerini Paylaş',
    icon: 'BookOpen',
    schedule: 'Her Çarşamba 18:00 - 20:00',
    coordinator: 'Fikir & Kültür Koordinasyonu',
    color: 'from-indigo-600 to-violet-600',
    image: `${BASE}images/events/kitap-soylesisi.jpeg`,
    description:
      'Her hafta farklı bir yazar veya temanın ele alındığı, kitap takaslarının yapıldığı ve kültürel gezilerin planlandığı zihinsel buluşma alanı.',
    features: [
      'Aylık kitap listeleri ve tartışma kılavuzları',
      'Kocaeli içi tarihi ve kültürel geziler',
      'Yazar ve akademisyen konuk buluşmaları',
      'Kitap bağış ve kütüphane projeleri'
    ]
  },
  {
    id: 'folk-dance',
    name: 'Halk Oyunları & Ritim Topluluğu',
    tagline: 'Gelenekten Geleceğe Coşkulu Ritim',
    icon: 'Music',
    schedule: 'Her Salı 18:00 - 20:00',
    coordinator: 'Kültürel Miras ve Gösteri Ekibi',
    color: 'from-rose-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    description:
      'Zeybek, horon, halay ve kafkas gibi yöresel dansları profesyonel eğitmen eşliğinde öğrendiğimiz, enerjisi yüksek topluluk kursumuz.',
    features: [
      'Sıfırdan başlayanlar için kademeli eğitim',
      'Farklı yörelerin figürleri ve hikayeleri',
      'Topluluk içi gösteri ve festival katılımları',
      'Birlikte hareket etme ve ritim duyarlılığı'
    ]
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Elif Sena K.',
    role: 'KOÜ Bilgisayar Müh. Öğrencisi',
    text: 'Kocaeli’ye üniversite için geldiğimde hiç çevrem yoktu. İlk katıldığım Speaking Club etkinliğinde 5 kişiyle arkadaş oldum, şimdi her perşembe hikinge birlikte gidiyoruz!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    activity: 'Speaking Club & Hiking',
    rating: 5
  },
  {
    id: '2',
    name: 'Barış Y.',
    role: 'Yazılım Geliştirici (İzmit)',
    text: 'Evden çalışan biri olarak hafta sonu Biblo ve Çanta boyama workshopları adeta bir terapi gibi geldi. Gerçekten sıcacık, hiçbir ticari kaygısı olmayan pırıl pırıl bir gençlik ortamı.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    activity: 'Sanat Workshopları',
    rating: 5
  },
  {
    id: '3',
    name: 'Zeynep D.',
    role: 'Mimar (Gebze)',
    text: 'Kerpe kampında sabah uyandığımızda deniz kokusu ve kamp ateşinde demlenen çay efsaneydi. Kocaeli Sosyal’in samimiyeti ve organizasyon disiplini gerçekten örnek seviyede.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    activity: '4 Mevsim Kamp',
    rating: 5
  }
];

export { GALLERY_DATA } from './galleryData';
export { BLOG_POSTS } from './blogData';

export const FAQ_DATA: FAQItem[] = [
  {
    category: 'Genel',
    question: 'Kocaeli Sosyal nedir ve kimler katılabilir?',
    answer:
      'Kocaeli Sosyal (Kocaeli Social Hub), gençlerin özgürce kendilerini ifade edebildiği, yeni arkadaşlar edindiği ve kişisel becerilerini geliştirdiği kar amacı gütmeyen bir gençlik topluluğudur. Üniversite öğrencileri, genç çalışanlar ve Kocaeli’de yaşayan tüm gençler etkinliklerimize katılabilir.'
  },
  {
    category: 'Etkinlikler',
    question: 'Etkinliklere katılmak ücretli mi?',
    answer:
      'Speaking Club, Hiking yürüyüşleri, Kitap söyleşileri ve genel sosyal buluşmalarımız tamamen ÜCRETSİZDİR. Biblo boyama, bez çanta veya seramik gibi el emeği atölyelerde yalnızca kullanılan boya ve ham malzeme maliyeti (katılımcı payı) ortak karşılanır.'
  },
  {
    category: 'Katılım',
    question: 'İlk defa katılacağım ve tek başımayım, çekiniyorum. Ne yapmalıyım?',
    answer:
      'Asla çekinmeyin! Katılımcılarımızın %80’i ilk etkinliğe tek başına gelir. Kapıda veya buluşma noktasında koordinatör arkadaşlarımız sizi karşılar, tanıştırır ve ilk 10 dakikada kendinizi samimi bir arkadaş grubunun içinde bulursunuz.'
  },
  {
    category: 'Speaking Club',
    question: 'İngilizcem iyi değil, Speaking Club’a gelebilir miyim?',
    answer:
      'Kesinlikle evet! Kulübümüzün altın kuralı "Grammar Polisi Giremez!" mottosudur. Seviyeniz ne olursa olsun kimse telaffuzunuzu veya gramerinizi düzeltmez; önemli olan hata yapmaktan çekinmeden konuşma cesareti kazanmanızdır.'
  },
  {
    category: 'Ulaşım & İlçeler',
    question: 'Kocaeli’nin hangi ilçelerinde etkinlik yapıyorsunuz?',
    answer:
      'Etkinliklerimiz ağırlıklı olarak İzmit merkez (Sekapark, Yahya Kaptan, Tarihi Gar) olmak üzere, doğa etkinliklerinde Kartepe, Yuvacık ve Menekşe Yaylası, kamplarda Kandıra koyları ve Ballıkayalar kanyonunda gerçekleştirilmektedir. Gebze, Gölcük, Derince ve diğer ilçelerden yoğun katılımcımız bulunmaktadır.'
  },
  {
    category: 'Gönüllülük',
    question: 'Ben de atölye vermek veya etkinlik düzenlemek istiyorum, mümkün mü?',
    answer:
      'Evet! Kocaeli Sosyal üretken gençlerle büyür. Eğer uzman olduğunuz bir konu, el sanatınız, öğretmek istediğiniz bir dil veya dans varsa iletişim sayfamızdan ya da WhatsApp üzerinden bize yazarak kendi kulüp oturumunuzu başlatabilirsiniz.'
  }
];

export const DISTRICTS = [
  'İzmit',
  'Gebze',
  'Kartepe',
  'Başiskele',
  'Gölcük',
  'Derince',
  'Körfez',
  'Kandıra',
  'Karamürsel',
  'Darıca',
  'Çayırova',
  'Dilovası'
];

export const SPONSORS_DATA: SponsorItem[] = [
  {
    id: 'slot-1',
    name: 'Sponsor Slotu 1',
    shortName: 'Slot 1',
    category: 'Sponsorluk Slotu',
    description: 'Bu slot bir sponsor için ayrılmıştır.',
    badge: 'Boş Slot',
    isPrimary: true,
    iconType: 'cafe'
  },
  {
    id: 'slot-2',
    name: 'Sponsor Slotu 2',
    shortName: 'Slot 2',
    category: 'Sponsorluk Slotu',
    description: 'Bu slot bir sponsor için ayrılmıştır.',
    badge: 'Boş Slot',
    isPrimary: true,
    iconType: 'cafe'
  },
  {
    id: 'slot-3',
    name: 'Sponsor Slotu 3',
    shortName: 'Slot 3',
    category: 'Sponsorluk Slotu',
    description: 'Bu slot bir sponsor için ayrılmıştır.',
    badge: 'Boş Slot',
    isPrimary: false,
    iconType: 'nature'
  },
  {
    id: 'slot-4',
    name: 'Sponsor Slotu 4',
    shortName: 'Slot 4',
    category: 'Sponsorluk Slotu',
    description: 'Bu slot bir sponsor için ayrılmıştır.',
    badge: 'Boş Slot',
    isPrimary: false,
    iconType: 'art'
  },
  {
    id: 'slot-5',
    name: 'Sponsor Slotu 5',
    shortName: 'Slot 5',
    category: 'Sponsorluk Slotu',
    description: 'Bu slot bir sponsor için ayrılmıştır.',
    badge: 'Boş Slot',
    isPrimary: false,
    iconType: 'culture'
  },
  {
    id: 'slot-6',
    name: 'Sponsor Slotu 6',
    shortName: 'Slot 6',
    category: 'Sponsorluk Slotu',
    description: 'Bu slot bir sponsor için ayrılmıştır.',
    badge: 'Boş Slot',
    isPrimary: false,
    iconType: 'youth'
  }
];
