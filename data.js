const SANITY_BASE = 'https://cdn.sanity.io/images/ywe09d8y/production';

function sanityUrl(ref, width = 1200) {
  const clean = ref.replace(/^image-/, '').replace(/-jpg$/, '.jpg').replace(/-tif$/, '.tif');
  return `${SANITY_BASE}/${clean}?w=${width}&q=80&auto=format`;
}

const ALIGNMENTS = (() => {
  let value = 0;
  let increment = 1;
  const values = [];
  for (let i = 0; i < 200; i += 1) {
    values.push(value);
    value += increment;
    if (value + increment > 1 || value + increment < -1) increment = -increment;
  }
  return values;
})();

/*
 * Each MEDIA item supports an optional `gallery` array for extra outfit photos on detail pages.
 * Add image paths relative to index.html / detail.html, for example:
 *   gallery: ['./assets/outfit-0-2.png', './assets/outfit-0-3.png'],
 */
const MEDIA = [
  {
    aside: '2026',
    title: 'Zoot Suit Shoot',
    heroZoomScale: 1,
    topColor: '#591d27',
    bottomColor: '#cd2438',
    dominantColor: '#ea1515',
    url: './assets/BM_FALL COVER.2026.JPG',
    alt: 'DAWN Blaremont Fashion Show poster with gold typography, red textured background, and black silhouette',
    
    gallery: [
      {
        src: './assets/zoot-cig.JPG',
        alt: '',
        topColor: '#F5EDE0',
        bottomColor: '#B20000',
        dominantColor: '#F5EDE0',
      },
      {
        src: './assets/El.ZOOT.FINAL.ONE.JPG',
        alt: '',
        topColor: '#F5EDE0',
        bottomColor: '#B20000',
        dominantColor: '#F5EDE0',
      },
      {
        src: './assets/AARON.FINAL.JPG',
        alt: '',
        topColor: '#F5EDE0',
        bottomColor: '#121111',
        dominantColor: '#F5EDE0',
      
      },
      {
        src: './assets/ASH.brick.FINAL.JPG',
        alt: '',
        topColor: '#181818',
        bottomColor: '#dad5d5',
        dominantColor: '#F5EDE0',
      
      },
      {
        src: './assets/Ashley.final.JPG',
        alt: '',
        topColor: '#131312',
        bottomColor: '#e4dc6b',
        dominantColor: '#F5EDE0',
      
      },
      {
        src: './assets/STREETS.FINAL.JPG',
        alt: '',
        topColor: '#ffffff',
        bottomColor: '#000000',
        dominantColor: '#F5EDE0',
      
      },
      {
        src: './assets/hadji-still.jpg',
        alt: '',
        topColor: '#d4dc68',
        bottomColor: '#be1010',
        dominantColor: '#F5EDE0',
      
      },
      {
        src: './assets/aaron-hadji-still.jpg',
        alt: '',
        topColor: '#9bca59',
        bottomColor: '#000000',
        dominantColor: '#F5EDE0',
      
      },
      
    ],
    process: {
      label: 'Look into the process',
      entries: [
        { title: 'Inspiration:', text: `The motivation behind this project and photoshoot is to express a bridge between Black and Latino culture, namely through their shared connection to the zoot suit subculture. 
          The zoot suits originated in Harlem in the 1930s, and it is believed that they pulled some influence from the London Drape suits, popularized by the Duke of Windsor, Edward VIII. Zoot suit silhouettes kept 
          ballooning, just like their popularity, especially in the Harlem jazz scene. Entertainers like Cab Calloway being the most influential in its spread. The style grew and spread into jazz clubs in Los Angeles 
          and influenced the inception of Pachuco culture. The Mexican-American youth in LA rebelled from both American and Mexican cultures alike as pachucos, wearing these suits out to enjoy the nightlife and forget 
          about their worries. Once the second world war began and the US became involved in the conflict, the country began rationing its resources, one of those being fabric. Zoot suits, with their balloon-like pants 
          and extra long jackets, were looked at as wasteful by the monolithic patriotism of white individuals in the country. The rising racial tensions between white and the Mexican-American youth prior to the war and 
          the portrayal of these youth in the media converged into a 5 day conflict called the Zoot Suit Riots of 1943. During this conflict, a group of armed servicemen went around and brutally beat anyone they saw outside 
          wearing a zoot suit, and sometimes anyone who seemed to be Mexican. So then began a two sided conflict between zoot suiters from different marginalized communities (Mexican, Black, Filipino) and these white servicemen. 
          It ultimately ended with the servicemen being restricted from entering LA and zoot suits becoming illegal to wear in the streets. However Pachuco culture did not die, actually far from it. These Pachucos continued to 
          express themselves using these suits underground, actively rebelling against the government. ` },

        { title: 'Red Zoot Suit', text: `This piece acts as the centerpiece of this photoshoot and its purpose is to be as loud as possible. The message of rebellion is only as loud as its carrier. The balloon pants are inspired 
          from a traditional Zoot Suit pattern preserved and made accessible by the LACMA. The zoot style is defined by its baggy silhouette but also its precise tailoring at the waist, adding some undulation to the silhouette.` },
      ],
    },   
  },

{
    aside: '2026',
    title: 'Blaremont Mag Fullform Bag in Crimson',
    heroZoomScale: 1,
    topColor: '#0A0A0F',
    bottomColor: '#B20000',
    dominantColor: '#B20000',
    url: './assets/THE.BM.BAG.ALYSSA.JPG',
    alt: 'Female model holding large red shoulder bag. The letters BM are in red on the left.',
    gallery: [
      {
        src: './assets/JOLENE.BM_BAG.4.3.JPG',
        alt: 'Black woman holding large red shoulder bag and is looking directly at the camera',
        topColor: '#f6e5ae',
        bottomColor: '#c72e2e',
        dominantColor: '#0F1410',
      },

      {
        src: './assets/CHIM.BAG-FINAL_2.JPG',
        alt: 'Black woman holding large red shoulder bag and is looking directly at the camera',
        topColor: '#f6e5ae',
        bottomColor: '#c72e2e',
        dominantColor: '#0F1410',
      },

      {
        src: './assets/BM_backshot.final.JPG',
        alt: 'Behind shot of black woman holding large red bag with right hand; in room with curtains',
        topColor: '#dac581',
        bottomColor: '#620909',
        dominantColor: '#0F1410',
      },

      {
        src: './assets/BM_BAGS3.fin.JPG',
        alt: 'Side shot of black woman holding large red bag with left hand; leaning on wall; in room with curtains',
        topColor: '#dac581',
        bottomColor: '#620909',
        dominantColor: '#0F1410',
      },

      {
        src: './assets/BM_BAG_S2.JPG',
        alt: 'Front shot of black woman holding large red bag with left hand; sitting on ground and leaning on wall',
        topColor: '#dac581',
        bottomColor: '#620909',
        dominantColor: '#0F1410',
      },


    ],
    process: {
  entries: [
    { title: 'Piece name', text: 'What inspired it...' },
    { title: 'Another piece', text: 'What inspired it...' },
  ],
},
  },


  {
    aside: '2026',
    title: 'Learn more about DAWN Fashion Showcase',
    topColor: '#B20000',
    bottomColor: '#F04D4D',
    dominantColor: '#B20000',
    url: './assets/dawn-fashion-show.png',
    alt: 'DAWN Blaremont Fashion Show poster with gold typography, red textured background, and black silhouette',
    gallery: [
      {
        src: './assets/dawn-the-sun.png',
        alt: 'Model walking a red carpet runway in a sheer cream off-shoulder outfit with red and gold patterned sash and lace skirt at an outdoor dusk fashion show',
        topColor: '#F5EDE0',
        bottomColor: '#B20000',
        dominantColor: '#F5EDE0',
        poem: `Bright star,
casting life onto the glowing, warm bodies
of the earth.
Surrounding us in your golden energy,
you breathe us into being.
With celestial power beyond our knowing,
you cast your light deep into our souls
And we are enriched`,
      },
      {
        src: './assets/dawn-soul.png',
        alt: 'Model on a red carpet runway in Canadian tuxedo double denim at an outdoor dusk fashion show — SOUL',
        topColor: '#2A4A7A',
        bottomColor: '#B20000',
        dominantColor: '#B20000',
        poem: `Inconceivably powerful.
Your voice shines like the sun.
Though it may be tested,
Pulled through the highest mountains,
And thrown into the lowest valleys,
You persist.
Do as you do,
And let your voice ring.`,
        musicSrc: './assets/music/dawn-sunset.mp3',
        musicCover: './assets/music/covers/dawn-sunset-cover.png',
        musicTitle: 'Sunset',
        musicArtist: 'Stevie Wonder',
      },
      {
        src: './assets/dawn-wind.png',
        alt: 'Model walking a red carpet runway in open white lace shirt, high-waisted wide white trousers, and white sneakers at an outdoor night fashion show — WIND',
        topColor: '#F5EDE0',
        bottomColor: '#B20000',
        dominantColor: '#F5EDE0',
        poem: `Ringing through the trees,
Whistling currents of the sky,
Rustling, winding, soaring.
You mark our planet with life,
and make your presence known in its absence.
Leaping, flowing, twirling,
you produce the harmonies of nature,
and allow us to sing.`,
        musicSrc: './assets/music/dawn-butterflies.mp3',
        musicCover: './assets/music/covers/dawn-butterflies-cover.png',
        musicTitle: 'Butterflies',
        musicArtist: 'Michael Jackson',
      },
      {
        src: './assets/dawn-the-moon.png',
        alt: 'Model walking a red carpet runway in sheer glitter mesh top, high-waisted wide black pinstripe trousers, and black boots at an outdoor night fashion show — THE MOON',
        topColor: '#1A1A1A',
        bottomColor: '#B20000',
        dominantColor: '#B20000',
        poem: `Pulling and pushing,
Jostling us as if to tell a message
You shine and reflect a
not quite golden light,
Nevertheless, you beam
You're our lighthouse,
You grant us comfort,
And light in the darkness`,
        musicSrc: './assets/music/dawn-higher.mp3',
        musicCover: './assets/music/covers/dawn-higher-cover.png',
        musicTitle: 'Higher',
        musicArtist: "D'Angelo",
      },
    ],
    detailEmptyHero: true,
    detailHeroTitle: 'DAWN',
    dawnLayout: true,
    dawnMusicSrc: './assets/music/dawn-eternal-sunshine.mp3',
    dawnMusicCover: './assets/music/covers/dawn-eternal-sunshine-cover.png',
    dawnMusicTitle: 'Eternal Sunshine',
    dawnMusicArtist: 'Lou Val',
    process: {
  entries: [
    { title: 'Piece name', text: 'What inspired it...' },
    { title: 'Another piece', text: 'What inspired it...' },
  ],
},
  },
  {
    aside: '2026',
    title: 'Dark selvedge denim Canadian tuxedo',
    heroZoomScale: 1,
    topColor: '#0A0A0F',
    bottomColor: '#B20000',
    dominantColor: '#B20000',
    url: './assets/hero.png',
    alt: 'Model in dark denim walking down a bright red carpet at an outdoor evening fashion show',
    gallery: [
      {
        src: './assets/outfit-0-2.png',
        alt: 'Man opening a dark denim jacket to reveal a colorful southwestern striped lining in warm dramatic lighting',
      },
      {
        src: './assets/outfit-0-3.png',
        alt: 'Rear view of model in dark denim outfit showing large southwestern striped back pocket in grainy low-light outdoor setting',
      },
      {
        src: './assets/outfit-0-4.png',
        alt: 'Man with bleached curly hair in dark cropped denim jacket, sunglasses tucked in front, silver jewelry, outdoor night with fairy lights',
      },
    ],
    process: {
  entries: [
    { title: 'Piece name', text: 'What inspired it...' },
    { title: 'Another piece', text: 'What inspired it...' },
  ],
},
  },
  {
    aside: '2026',
    title: 'Flowy top made from sheer fabric & open skirt made from sequined lace fabric',
    topColor: '#F5EDE0',
    bottomColor: '#B20000',
    dominantColor: '#F5EDE0',
    url: './assets/photo-2.png',
    alt: 'Black woman in cream off-shoulder outfit with red and gold sash walking a bright red carpet at an outdoor evening fashion show',
    gallery: [
      {
        src: './assets/outfit-1-2.png',
        alt: 'Rear view of model walking red carpet runway in cream sheer top with red and gold embroidered border and lace skirt at outdoor dusk fashion show',
        topColor: '#E8D5C4',
        bottomColor: '#B20000',
        dominantColor: '#F5EDE0',
      },
      {
        src: './assets/outfit-1-balcony.png',
        alt: 'Woman on balcony with pink flowering trees in sheer cream poncho with red and gold border, white wide-leg pants, newsboy cap, and globe string lights',
        zoomOrigin: 'center bottom',
        zoomOffset: { x: '5%', y: '10%' },
        topColor: '#F5A7B2',
        bottomColor: '#8B1E1E',
        dominantColor: '#F5EDE0',
      },
      {
        src: './assets/outfit-1-3.png',
        alt: 'Woman in open doorway in sheer cream off-shoulder top with wide butterfly sleeves and red and gold border, white wide-leg pants, newsboy cap, plant stand, soft natural light',
        topColor: '#F5EDE0',
        bottomColor: '#7B1113',
        dominantColor: '#7B1113',
      },
    ],
    process: {
  entries: [
    { title: 'Piece name', text: 'What inspired it...' },
    { title: 'Another piece', text: 'What inspired it...' },
  ],
},
  },
  {
    aside: '2026',
    title: 'Open white shirt made from lightweight cotton, with lace detailing; baggy, straight silhouette pants made from lightweight cotton',
    topColor: '#F5EDE0',
    bottomColor: '#B20000',
    dominantColor: '#F5EDE0',
    url: './assets/photo-3.png',
    alt: 'Black man walking red carpet runway in open white lace shirt, wide white pants, white sneakers, and glasses at an outdoor dusk fashion show',
    heroZoomScale: 1.35,
    heroZoomOffset: { x: '0%', y: '5%' },
    gallery: [
      {
        src: './assets/outfit-2-2.png',
        alt: 'Black man outdoors at night in open white lace shirt, high-waisted white baggy pants, glasses, and chain necklace, warm ground lights and dark foliage in background',
        topColor: '#F5EDE0',
        bottomColor: '#C97A2E',
        dominantColor: '#0F1410',
      },
    ],
    process: {
  entries: [
    { title: 'Piece name', text: 'What inspired it...' },
    { title: 'Another piece', text: 'What inspired it...' },
  ],
},
  },
  {
    aside: '2026',
    title: 'Baggy black cotton pants with sewn in pinstripe design',
    topColor: '#000000',
    bottomColor: '#B20000',
    dominantColor: '#B20000',
    url: './assets/photo-4.png',
    alt: 'Black man with dreadlocks in sheer silver mesh short-sleeve shirt, high-waisted wide black pants, black boots, silver cross necklace, walking red carpet runway at outdoor night fashion show',
    heroZoomScale: 1.2,
    heroZoomOffset: { x: '-5%', y: '5%' },
    gallery: [
      {
        src: './assets/outfit-3-2.png',
        alt: 'Black man with dreadlocks in sheer black mesh top with silver glitter, baggy black pinstripe pants, silver cross necklace, walking red carpet runway at outdoor night fashion show',
        zoomScale: 1.3,
        zoomOrigin: 'center center',
        zoomOffset: { x: '0%', y: '10%' },
        topColor: '#000000',
        bottomColor: '#B20000',
        dominantColor: '#B20000',
      },
      {
        src: './assets/outfit-3-3.png',
        alt: 'Model from behind on red carpet, sheer black shimmering top, wide black pants, black boots, outdoor fashion show dusk',
        topColor: '#000000',
        bottomColor: '#B20000',
        dominantColor: '#B20000',
      },
    ],
    process: {
  entries: [
    { title: 'Piece name', text: 'What inspired it...' },
    { title: 'Another piece', text: 'What inspired it...' },
  ],
},
  },
  
  {
    aside: '2026',
    title: 'Baggy, straight pants made from lightweight brown cotton fabric',
    topColor: '#C4A0A0',
    bottomColor: '#1A1A1A',
    dominantColor: '#C4A0A0',
    url: './assets/photo-5.png',
    alt: 'Model in dusty rose quarter-zip sweater and wide dark trousers against grey tile wall, cream door with sprinkler sign, urban fashion',
    gallery: [],
    noDetail: true,
  },
];

MEDIA.forEach((item, index) => {
  if (!item.url) {
    item.url = sanityUrl(item.imageRef, index === 0 ? 1600 : 1200);
  }
  if (!item.gallery) {
    item.gallery = [];
  }
  item.alignment = ALIGNMENTS[index];
  item.isTop = Math.random() > 0.5;
});

const PATCHES = [
  {
    aside: '2026',
    title: 'New York Knicks upcycled denim patch',
    topColor: '#2A3548',
    bottomColor: '#593a2a',
    dominantColor: '#E8782E',
    url: './assets/patch-knicks.png',
    alt: 'Embroidered New York Knicks logo patch with orange KNICKS lettering and a basketball on a blue triangular background',
    youtubeId: 'hd2agiiOhhc',
    gallery: [],
  },
  {
    aside: '2026',
    title: 'Rolling Stones "Sticky Fingers" patch (5x7in)',
    topColor: '#1E5C38',
    bottomColor: '#593a2a',
    dominantColor: '#D42020',
    url: './assets/patch-4900.jpg',
    alt: 'Rolling Stones red tongue and lips logo embroidered patch on a green cutting mat',
    noDetail: true,
  },
  {
    aside: '2026',
    title: 'Upcycled three-eyed sun patch',
    topColor: '#A89880',
    bottomColor: '#593a2a',
    dominantColor: '#F5C400',
    url: './assets/patch-three-eyed-sun.jpg',
    alt: 'Yellow sunburst-shaped embroidered patch with three sleepy eyes and a dark red tongue on tan textured fabric',
    gallery: [],
    noDetail: true,
  },
];

PATCHES.forEach((item, index) => {
  if (!item.gallery) {
    item.gallery = [];
  }
  item.alignment = ALIGNMENTS[index];
  item.isTop = Math.random() > 0.5;
});

const SITE = {
  name: 'Biruk Gizaw',
  subtitle: 'Fashion Designer & Tailor',
  description:
    'Biruk Gizaw is a fashion designer, tailor, and fiber artist with a background in computer science and drawing, based in Houston, Texas. He has a passion for building extravagant silhouettes with his pieces, and building multimedia fashion showcases for them. He works on projects that mix his creative and technical knowledge to solve problems using unconventional means.',
  infoImage: './assets/info-biruk.png',
  infoImageAlt:
    'Young Black man with glasses, pearl necklace, and patterned shirt; signature above on cream background, vintage portrait style',
  phone: '+18322787667',
  email: 'birukssewingmachine@birukgizaw.com',
  instagram: 'https://www.instagram.com/birukssewingmachine?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr',
};
