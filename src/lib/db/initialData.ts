import { Book, BookChapter, Category, DailyThought, Story, Profile, ReadingProgress, Bookmark } from "@/types/database";

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Inspirational",
    slug: "inspirational",
    description: "Words and reflections to ignite the inner flame and inspire courage.",
    color: "#C8A66A",
    icon: "Sparkles",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-2",
    name: "Fiction",
    slug: "fiction",
    description: "Imaginative tales of extraordinary destinies, wonder, and human spirit.",
    color: "#536B4E",
    icon: "BookOpen",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-3",
    name: "Philosophy",
    slug: "philosophy",
    description: "Deep inquiries into existence, tranquility, ethics, and truth.",
    color: "#B86F50",
    icon: "Compass",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-4",
    name: "Mystery",
    slug: "mystery",
    description: "Shadowed labyrinths, forgotten manuscripts, and enigmatic discoveries.",
    color: "#3F4E4F",
    icon: "Key",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-5",
    name: "Fantasy",
    slug: "fantasy",
    description: "Magical realms where the impossible unfolds under ancient skies.",
    color: "#8D7B68",
    icon: "Feather",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-6",
    name: "Poetry",
    slug: "poetry",
    description: "Lyrical verses capturing the fragility and transcendence of memory.",
    color: "#A7727D",
    icon: "Heart",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-7",
    name: "Life Lessons",
    slug: "life-lessons",
    description: "Timeless perspectives gained from navigating sorrow, joy, and growth.",
    color: "#C08261",
    icon: "Sun",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "cat-8",
    name: "Short Stories",
    slug: "short-stories",
    description: "Bite-sized literary journeys for quiet reflective moments.",
    color: "#4A6B62",
    icon: "Coffee",
    created_at: "2026-01-01T00:00:00Z"
  }
];

export const initialChapters: Record<string, BookChapter[]> = {
  "book-1": [
    {
      id: "chap-1-1",
      book_id: "book-1",
      chapter_number: 1,
      title: "The Vault of Forgotten Inks",
      slug: "the-vault-of-forgotten-inks",
      content_html: `
        <p class="first-letter-dropcap">T</p><p>here was an unspoken rule among the keepers of the deep valley: no torch must ever be struck near the eastern catacombs after the moon has crested the pine ridge. The parchment there was alive, hungry for daylight or firelight, and prone to whispering when the valley mist settled upon its covers.</p>
        <p>Julian adjusted the brass collar of his lantern. A low hum resonated from the shelf on his right—a row of vellum octavos bound in dark green morocco leather. They smelled of cedarwood, dried lavender, and old rainwater. For three centuries, the Vance family had guarded this sanctuary, cataloging volumes that no modern printing press could replicate.</p>
        <blockquote>"To write is to create an echo; to read is to invite a ghost to sit by your hearth." — The Archivist’s Creed</blockquote>
        <p>He reached for the third volume. Its spine bore no stamped title, only three gold leaf crescents. When his fingertips grazed the calfskin, a tremor ran down the binding. Letters formed beneath his gaze, shimmering like phosphorus on ocean water at midnight. The text read: <em>Welcome, seeker of the seventh silence.</em></p>
        <p>Julian pulled the book free. The air in the gallery grew colder, fragrant with winter pine. He set the volume upon the walnut lectern, turned the heavy brass clasp, and let the first page fall open.</p>
      `,
      raw_text: "There was an unspoken rule among the keepers of the deep valley: no torch must ever be struck near the eastern catacombs after the moon has crested the pine ridge...",
      word_count: 245,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    },
    {
      id: "chap-1-2",
      book_id: "book-1",
      chapter_number: 2,
      title: "The Cartographer of Shadows",
      slug: "the-cartographer-of-shadows",
      content_html: `
        <p class="first-letter-dropcap">M</p><p>aps drawn upon ordinary linen chart rivers, roads, and cities of stone. But the map Julian found folded within the vellum folio charted neither coordinates nor topography. It charted hours of human grief, moments of sudden laughter, and the exact contours of an unremembered dream.</p>
        <p>Every contour line had been etched with iron-gall ink so dark it swallowed the lantern flame. Near the center of the fold, a solitary spire was marked: <em>The Tower of Unspoken Words.</em></p>
        <p>"A map that moves," whispered a voice behind him. Julian turned sharply. Standing in the gallery archway was Mary, her wool cloak pinned with the silver seal of the Old College.</p>
        <p>"You shouldn't be down here," Julian warned, his hand reflexively guarding the spread pages. "The council specifically sealed this vault until the solstice."</p>
        <p>"The council watches the gate," she smiled gently, stepping forward until the warm amber radiance touched her collar. "They forgot that the walls themselves are built of paper."</p>
      `,
      raw_text: "Maps drawn upon ordinary linen chart rivers, roads, and cities of stone. But the map Julian found folded within the vellum folio charted neither coordinates nor topography...",
      word_count: 210,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    },
    {
      id: "chap-1-3",
      book_id: "book-1",
      chapter_number: 3,
      title: "The Solstice Gate",
      slug: "the-solstice-gate",
      content_html: `
        <p class="first-letter-dropcap">A</p><p>s midnight struck on the great bronze clock atop the library tower, the iron lattice doors began to hum with an unearthly vibration. Twelve notes, pure as crystal, rolled across the silent shelves.</p>
        <p>Mary touched the gilded latch. "Look at the floor, Julian."</p>
        <p>Where the moonlight poured through the high clerestory windows, geometric glyphs ignited upon the flagstones. Lines of starlight traced an ancient labyrinth leading directly to the center pedestal.</p>
        <p>The manuscript lay waiting, its pages turning on their own, pushed by an invisible wind that carried the fragrance of blooming jasmine and ancient moss. The adventure had only just begun.</p>
      `,
      raw_text: "As midnight struck on the great bronze clock atop the library tower, the iron lattice doors began to hum with an unearthly vibration...",
      word_count: 165,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ],
  "book-2": [
    {
      id: "chap-2-1",
      book_id: "book-2",
      chapter_number: 1,
      title: "The Garden of Quiet Hours",
      slug: "the-garden-of-quiet-hours",
      content_html: `
        <p class="first-letter-dropcap">S</p><p>ilence is not an empty vessel. It is an ocean rich with unseen currents, waiting for a listener patient enough to submerge without demanding answers.</p>
        <p>We flee from solitude because we mistake it for loneliness. Yet solitude is the forge of self-possession. In the company of others, we are actors reading from borrowed scripts; in the sanctuary of solitude, we remember who wrote the lines.</p>
        <blockquote>"He who learns to sit quietly in an unfurnished room has conquered the greatest emperor of the modern world."</blockquote>
        <p>Consider the tree in midwinter. Stripped of foliage, exposed to the cold wind, it does not weep for the lost summer. It sends its roots deeper into the dark loam, anchoring itself in stillness. So must the mind do when stripped of noise.</p>
      `,
      raw_text: "Silence is not an empty vessel. It is an ocean rich with unseen currents...",
      word_count: 170,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    },
    {
      id: "chap-2-2",
      book_id: "book-2",
      chapter_number: 2,
      title: "Transmuting the Lead of Sorrow",
      slug: "transmuting-the-lead-of-sorrow",
      content_html: `
        <p class="first-letter-dropcap">T</p><p>he ancient alchemists spoke of turning base metals into pure gold. The vulgar misunderstood: they sought coins for their purses. The masters knew the true art was spiritual alchemy—taking grief, regret, and mortal longing, and turning them into wisdom.</p>
        <p>Every sorrow you have carried is raw material. Do not bury it in shame; do not allow it to poison the well. Lay it upon the hearth of quiet contemplation. Let the fire of understanding burn away the dross until only gratitude remains.</p>
      `,
      raw_text: "The ancient alchemists spoke of turning base metals into pure gold...",
      word_count: 120,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ],
  "book-3": [
    {
      id: "chap-3-1",
      book_id: "book-3",
      chapter_number: 1,
      title: "The Old Oak’s Lullaby",
      slug: "the-old-oaks-lullaby",
      content_html: `
        <p class="first-letter-dropcap">B</p><p>efore the kingdom had kings, before the stones of the citadel were hewn from the cliffs, the Mosswood stood under the watch of three great elder pines. Their boughs reached so high that clouds caught in their needles like fleeces on a thorn hedge.</p>
        <p>Bramble was nine winters old when he first heard the trees converse. It sounded like the creak of wooden ships in a calm bay, or the slow grinding of millstones under a waterfall.</p>
        <p>"Stay on the path of white stones," his grandmother had always whispered. But when the green wren flew between the weeping ferns, Bramble forgot every warning.</p>
      `,
      raw_text: "Before the kingdom had kings, before the stones of the citadel were hewn from the cliffs...",
      word_count: 140,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ],
  "book-4": [
    {
      id: "chap-4-1",
      book_id: "book-4",
      chapter_number: 1,
      title: "Letter I: To the Lighthouse Keeper",
      slug: "letter-i-to-the-lighthouse-keeper",
      content_html: `
        <p class="first-letter-dropcap">M</p><p>y dearest friend,</p>
        <p>The tide has gone out three miles tonight, leaving the black pebbles shining like wet onyx. From my terrace, your revolving beacon sweeps across the bay every fourteen seconds. In that interval of dark, I count the years we spent gathering sea glass along these cliffs.</p>
        <p>Do you remember what you told me about the stars? That their light left its source before our ancestors built their first hearth? If light can travel across millions of miles of void just to touch our eyelids, surely an honest prayer can cross this narrow strait.</p>
        <p>Send me word with the morning fisherman. The sky is clear, and the wind smells of wild thyme.</p>
      `,
      raw_text: "My dearest friend, The tide has gone out three miles tonight, leaving the black pebbles shining like wet onyx...",
      word_count: 135,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ],
  "book-5": [
    {
      id: "chap-5-1",
      book_id: "book-5",
      chapter_number: 1,
      title: "Gears and Heartstrings",
      slug: "gears-and-heartstrings",
      content_html: `
        <p class="first-letter-dropcap">A</p><p>t five minutes to midnight, Master Thaddeus set down his eyeglass with trembling fingers. Inside the brass ribcage on his workbench, a miniature escapement was ticking. Not the sharp metallic chatter of a common mantle clock, but a deep, resonant thump that echoed the rhythm of human blood.</p>
        <p>The ruby balance wheel spun thirty times every minute. With each rotation, a tiny droplet of cedar oil circulated through the silver capillaries.</p>
        <p>"It beats," Thaddeus murmured into the lamplight. "By the heavens, it beats."</p>
      `,
      raw_text: "At five minutes to midnight, Master Thaddeus set down his eyeglass with trembling fingers...",
      word_count: 110,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ],
  "book-6": [
    {
      id: "chap-6-1",
      book_id: "book-6",
      chapter_number: 1,
      title: "The Fortress Within",
      slug: "the-fortress-within",
      content_html: `
        <p class="first-letter-dropcap">E</p><p>very morning before the sun clears the Athenian hills, remind yourself: the people you meet today will be meddlesome, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.</p>
        <p>But you have seen the beauty of good, and the ugliness of evil, and you have recognized that the wrongdoer has a nature related to your own—not of the same blood, but of the same mind, sharing in a portion of the divine.</p>
        <blockquote>"You have power over your mind—not outside events. Realize this, and you will find strength." — Marcus Aurelius</blockquote>
        <p>No one can injure you unless you consent to the injury. Build the inner citadel with stone unyielding to fear and vanity.</p>
      `,
      raw_text: "Every morning before the sun clears the Athenian hills, remind yourself: the people you meet today...",
      word_count: 145,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ]
};

export const initialBooks: Book[] = [
  {
    id: "book-1",
    title: "The Whispering Archive",
    slug: "the-whispering-archive",
    author: "Evelyn Vance",
    description: "A secret library buried beneath mountain mists where forgotten manuscripts write their own destinies in glowing phosphorus.",
    cover_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    spine_color: "#1A3C34",
    accent_color: "#C8A66A",
    category_id: "cat-4",
    total_pages: 312,
    estimated_reading_time: "5 hours",
    status: "published",
    published_at: "2026-01-10T00:00:00Z",
    featured: true,
    view_count: 1420,
    read_count: 489,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z"
  },
  {
    id: "book-2",
    title: "The Alchemist of Solitude",
    slug: "the-alchemist-of-solitude",
    author: "Marcus Sterling",
    description: "Meditations on silence, creative awakening, and turning the lead of daily sorrow into the pure gold of inner peace.",
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    spine_color: "#4B2E1E",
    accent_color: "#DFCA9B",
    category_id: "cat-3",
    total_pages: 240,
    estimated_reading_time: "4 hours",
    status: "published",
    published_at: "2026-01-15T00:00:00Z",
    featured: true,
    view_count: 1890,
    read_count: 612,
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z"
  },
  {
    id: "book-3",
    title: "Chronicles of the Mosswood",
    slug: "chronicles-of-the-mosswood",
    author: "Rowan Thorne",
    description: "An ancient woodland fable where thousand-year-old trees hold memories of lost wanderers and singing stars.",
    cover_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
    spine_color: "#203A2B",
    accent_color: "#536B4E",
    category_id: "cat-2",
    total_pages: 380,
    estimated_reading_time: "6.5 hours",
    status: "published",
    published_at: "2026-01-20T00:00:00Z",
    featured: true,
    view_count: 980,
    read_count: 310,
    created_at: "2026-01-03T00:00:00Z",
    updated_at: "2026-01-20T00:00:00Z"
  },
  {
    id: "book-4",
    title: "Letters from the Celestial Shore",
    slug: "letters-from-the-celestial-shore",
    author: "Clara Fontaine",
    description: "Lyrical epistolary reflections on love, distance, starlight, and the quiet dignity of waiting across open waters.",
    cover_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    spine_color: "#182C3F",
    accent_color: "#C8A66A",
    category_id: "cat-6",
    total_pages: 198,
    estimated_reading_time: "3 hours",
    status: "published",
    published_at: "2026-02-01T00:00:00Z",
    featured: false,
    view_count: 730,
    read_count: 245,
    created_at: "2026-01-04T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z"
  },
  {
    id: "book-5",
    title: "The Clockwork Heart",
    slug: "the-clockwork-heart",
    author: "Julian Sterling",
    description: "A Victorian artisan crafts a mechanical heart that accidentally resonates with the deepest chambers of human vulnerability.",
    cover_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
    spine_color: "#3B2820",
    accent_color: "#B86F50",
    category_id: "cat-2",
    total_pages: 340,
    estimated_reading_time: "5.5 hours",
    status: "published",
    published_at: "2026-02-10T00:00:00Z",
    featured: true,
    view_count: 1150,
    read_count: 395,
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-02-10T00:00:00Z"
  },
  {
    id: "book-6",
    title: "The Secret Garden of Philosophy",
    slug: "the-secret-garden-of-philosophy",
    author: "Dr. Aris Thorne",
    description: "Timeless lessons from the Stoics, transcendentalists, and ancient sages, cultivated like perennials for modern resilience.",
    cover_url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800",
    spine_color: "#2C3E35",
    accent_color: "#C8A66A",
    category_id: "cat-3",
    total_pages: 288,
    estimated_reading_time: "4.5 hours",
    status: "published",
    published_at: "2026-02-15T00:00:00Z",
    featured: true,
    view_count: 1640,
    read_count: 530,
    created_at: "2026-01-06T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z"
  }
];

export const initialThoughts: DailyThought[] = [
  {
    id: "th-1",
    quote: "Words are the only jewels that never lose their brilliance when passed from one soul to another.",
    author: "Marcus Aurelius",
    date: "2026-10-12",
    category: "Wisdom",
    handwritten_note: "Hold this truth close on restless days.",
    is_featured: true,
    is_published: true,
    share_count: 342,
    copy_count: 819,
    created_at: "2026-10-12T00:00:00Z",
    updated_at: "2026-10-12T00:00:00Z"
  },
  {
    id: "th-2",
    quote: "In the quietest hour of the forest, the oldest tree speaks not in sounds, but in shadows of remembrance.",
    author: "Evelyn Vance",
    date: "2026-10-11",
    category: "Nature",
    handwritten_note: "Listen before you speak.",
    is_featured: false,
    is_published: true,
    share_count: 215,
    copy_count: 512,
    created_at: "2026-10-11T00:00:00Z",
    updated_at: "2026-10-11T00:00:00Z"
  },
  {
    id: "th-3",
    quote: "A book is a portal of folded paper; carry it in your pocket, and you carry an entire horizon.",
    author: "Clara Fontaine",
    date: "2026-10-10",
    category: "Inspiration",
    handwritten_note: "Never leave home without a horizon.",
    is_featured: false,
    is_published: true,
    share_count: 420,
    copy_count: 940,
    created_at: "2026-10-10T00:00:00Z",
    updated_at: "2026-10-10T00:00:00Z"
  },
  {
    id: "th-4",
    quote: "Solitude is not absence, but the presence of one's truest self in a world crowded with masks.",
    author: "Ralph Waldo Emerson",
    date: "2026-10-09",
    category: "Philosophy",
    handwritten_note: "Cherish the quiet hearth.",
    is_featured: false,
    is_published: true,
    share_count: 310,
    copy_count: 730,
    created_at: "2026-10-09T00:00:00Z",
    updated_at: "2026-10-09T00:00:00Z"
  },
  {
    id: "th-5",
    quote: "The mind that opens to a great story never returns to its original boundaries.",
    author: "Oliver Wendell Holmes",
    date: "2026-10-08",
    category: "Storytelling",
    handwritten_note: "Expand without fear.",
    is_featured: false,
    is_published: true,
    share_count: 189,
    copy_count: 440,
    created_at: "2026-10-08T00:00:00Z",
    updated_at: "2026-10-08T00:00:00Z"
  },
  {
    id: "th-6",
    quote: "Between the turning of a page and the breath of silence lies all of human wonder.",
    author: "Julian Sterling",
    date: "2026-10-07",
    category: "Wonder",
    handwritten_note: "Pause between pages.",
    is_featured: false,
    is_published: true,
    share_count: 260,
    copy_count: 620,
    created_at: "2026-10-07T00:00:00Z",
    updated_at: "2026-10-07T00:00:00Z"
  },
  {
    id: "th-7",
    quote: "Do not seek to conquer the storm; build a lantern of patience and let the wind carry your light.",
    author: "Seneca",
    date: "2026-10-06",
    category: "Stoicism",
    handwritten_note: "Patience is our sacred shield.",
    is_featured: false,
    is_published: true,
    share_count: 512,
    copy_count: 1205,
    created_at: "2026-10-06T00:00:00Z",
    updated_at: "2026-10-06T00:00:00Z"
  },
  {
    id: "th-8",
    quote: "Every memory is an ink mark on the soul; cherish the lines that were drawn in love.",
    author: "Kahlil Gibran",
    date: "2026-10-05",
    category: "Love",
    handwritten_note: "Ink never truly fades.",
    is_featured: false,
    is_published: true,
    share_count: 395,
    copy_count: 880,
    created_at: "2026-10-05T00:00:00Z",
    updated_at: "2026-10-05T00:00:00Z"
  }
];

export const initialStories: Story[] = [
  {
    id: "story-1",
    title: "The Watchmaker of Winterfold",
    slug: "the-watchmaker-of-winterfold",
    author: "Rowan Thorne",
    category_id: "cat-8",
    cover_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
    excerpt: "In a town where the snow never melted, an old clockmaker discovered an escapement that could rewind thirty seconds of regret.",
    content_html: `
      <p class="first-letter-dropcap">O</p><p>n the steepest cobbled street of Winterfold, behind a bowed bay window frosted with silver ferns, Master Gideon worked by the flame of a beeswax taper. The bells of the town cathedral struck nine, each chime dulled by the thick blanket of perennial snow.</p>
      <p>Before him lay a movement unlike any other: gear-teeth carved not from brass or steel, but from compressed starlight caught in cold mountain quartz. When he wound the tiny key, the second hand hesitated—then leaped three seconds into the past.</p>
      <p>"Gideon," whispered his late wife's voice from the shadows of the parlor, clear as crystal on a winter morning. For three seconds, she was there. For three seconds, the teacup was unbroken on the hearth.</p>
      <p>He sat in silence as the pendulum steadied. He could spend the rest of his life looping those three seconds, or let the clock strike ten and greet the dawn. With a gentle sigh, Gideon released the key.</p>
    `,
    reading_time_minutes: 6,
    is_featured: true,
    status: "published",
    published_at: "2026-10-10T00:00:00Z",
    view_count: 840,
    created_at: "2026-10-01T00:00:00Z",
    updated_at: "2026-10-10T00:00:00Z"
  },
  {
    id: "story-2",
    title: "The Girl Who Listened to Falling Stars",
    slug: "the-girl-who-listened-to-falling-stars",
    author: "Clara Fontaine",
    category_id: "cat-5",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    excerpt: "She held a hollow seashell to her ear each night, not to hear the sea, but the silent sighs of dying comets.",
    content_html: `
      <p class="first-letter-dropcap">M</p><p>irabel lived on the eastern headland where the wind tasted of salt spray and heather. While the village slept, she climbed the basalt rocks with a polished nautilus shell tucked into her wool pocket.</p>
      <p>Astronomers recorded celestial coordinates; Mirabel recorded songs. Every shooting star that burned across the sapphire atmosphere sang a single chord before vanishing into silence.</p>
      <p>"Tonight was a minor seventh," she wrote in her parchment diary. "A star from Orion's belt, singing of the desert it watched over ten thousand years ago."</p>
    `,
    reading_time_minutes: 5,
    is_featured: false,
    status: "published",
    published_at: "2026-10-08T00:00:00Z",
    view_count: 530,
    created_at: "2026-10-02T00:00:00Z",
    updated_at: "2026-10-08T00:00:00Z"
  },
  {
    id: "story-3",
    title: "The Lantern Keeper's Last Journey",
    slug: "the-lantern-keepers-last-journey",
    author: "Julian Sterling",
    category_id: "cat-2",
    cover_url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800",
    excerpt: "Every evening for fifty winters, he walked the winding stairs. Tonight, he carried the final light to the edge of the sky.",
    content_html: `
      <p class="first-letter-dropcap">T</p><p>he iron circular stairs numbered one hundred and eighty-four. Each step had been hollowed slightly in the center by fifty years of oilcloth boots. Old Barnaby knew every squeak and groan of the spiral tower.</p>
      <p>Outside, the gale whipped the Atlantic into frothing mountain ranges of black water. But inside the glass lantern room, the heavy brass lens rotated smoothly in its mercury trough, casting its golden beam fifty miles into the tempest.</p>
      <p>"Keep the flame true," he spoke to the empty tower, remembering the promise made when the world was young. As the clouds parted, the north star aligned with his lamp, crowning his life's vigil.</p>
    `,
    reading_time_minutes: 7,
    is_featured: false,
    status: "published",
    published_at: "2026-10-04T00:00:00Z",
    view_count: 670,
    created_at: "2026-10-03T00:00:00Z",
    updated_at: "2026-10-04T00:00:00Z"
  },
  {
    id: "story-4",
    title: "Echoes in the Ink",
    slug: "echoes-in-the-ink",
    author: "Evelyn Vance",
    category_id: "cat-4",
    cover_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    excerpt: "An antique bottle of walnut ink reveals hidden messages written between the lines of historical treaties.",
    content_html: `
      <p class="first-letter-dropcap">T</p><p>he glass inkwell was octagonal, clouded with amethyst veins, bought for two shillings at a damp market stall in York. When Philip dipped his steel nib into the dark fluid, the words he intended to write refused to appear.</p>
      <p>Instead, the pen guided his fingers in sharp, urgent strokes. <em>Do not sign the pact at Saint-Cloud. The seal has been copied.</em></p>
      <p>The date formed automatically below the warning: October 14, 1792. The ink had remembered what its previous owner never had the courage to send.</p>
    `,
    reading_time_minutes: 5,
    is_featured: false,
    status: "published",
    published_at: "2026-10-01T00:00:00Z",
    view_count: 490,
    created_at: "2026-10-04T00:00:00Z",
    updated_at: "2026-10-01T00:00:00Z"
  }
];

export const initialProfiles: Profile[] = [
  {
    id: "admin-1",
    email: "admin@thelivingbook.com",
    display_name: "The Grand Archivist",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    role: "admin",
    bio: "Curator and keeper of the living sanctuary.",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "reader-1",
    email: "reader@thelivingbook.com",
    display_name: "Rowan the Seeker",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    role: "reader",
    bio: "Avid explorer of fantasy, poetry, and midnight philosophy.",
    favorite_genre: "Mystery",
    created_at: "2026-01-15T00:00:00Z"
  }
];

export const initialReadingProgress: ReadingProgress[] = [
  {
    id: "prog-1",
    user_id: "reader-1",
    book_id: "book-1",
    current_chapter_id: "chap-1-2",
    current_page: 42,
    total_pages: 312,
    percentage: 14,
    last_read_at: "2026-10-11T18:45:00Z"
  },
  {
    id: "prog-2",
    user_id: "reader-1",
    book_id: "book-2",
    current_chapter_id: "chap-2-1",
    current_page: 86,
    total_pages: 240,
    percentage: 36,
    last_read_at: "2026-10-10T21:15:00Z"
  }
];

export const initialBookmarks: Bookmark[] = [
  {
    id: "bm-1",
    user_id: "reader-1",
    book_id: "book-1",
    chapter_id: "chap-1-1",
    page_number: 12,
    chapter_title: "The Vault of Forgotten Inks",
    quote: "To write is to create an echo; to read is to invite a ghost to sit by your hearth.",
    note: "Favorite definition of reading.",
    created_at: "2026-10-11T18:30:00Z"
  }
];
