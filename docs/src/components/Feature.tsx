import Slider from 'react-slick';
import parse from 'html-react-parser';
import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RC = '/ResearchContent/';
const RI = '/researchImages/';

interface Section {
  heading?: string;
  stage?: string;        // pipeline-stage label shown before the heading (e.g. "Ingest")
  stageColor?: string;   // colour of the stage label, matching the pipeline diagram
  text: string;
  img?: string;
  imgCaption?: string;
  imgRight?: boolean;
}

interface Slide {
  title: string;
  slug?: string;        // stable URL slug for deep-linking, e.g. /#/Featured/meaning-machine
  year: number;
  venue: string;
  citations: number;
  img: string;
  text: string;
  citation: string;
  pdf?: string;
  video?: string;
  videos?: { label: string; url: string }[];
  sections?: Section[];
  refsHtml?: string;    // optional collapsible "References" block (HTML, parsed)
}

// Set to true to include the PhotoDance slide in the carousel
const SHOW_PHOTODANCE = true;

const photodanceSlide: Slide = {
    title: 'PhotoDance: A 30-Year Itch, Finally Scratched',
    slug: 'photodance',
    year: 2026,
    venue: 'Personal Research Project',
    citations: 0,
    img: RI + 'photodance_00.jpg',
    citation: '<div class="csl-entry">Drucker, S. M. (2026). <i>PhotoDance: When a Microsoft Researcher Retires and Finally Scratches a 30-Year Itch</i>. Personal research project.</div>',
    text: '',
    videos: [
      { label: 'Video', url: 'https://youtu.be/Af9nWLuhhR8' },
      { label: 'The Meaning Machine', url: 'https://youtu.be/oyRprPP6dA8' },
    ],
    sections: [
      {
        heading: 'A Photographer and a Tool-Builder',
        text: 'My wife, Lourdes, is the photographer. Over three decades she has assembled 225,000 photographs — a serious, intentional visual record of a life: our child growing up, decades of travel, family gatherings, and quiet moments in between. I am the HCI and visualization researcher. For thirty years at Microsoft Research, my job was to figure out how people make sense of large collections of things. When I retired, I finally had Lourdes\'s archive and the open-ended time to build the tool I had always promised.',
        img: RI + 'photodance_00.jpg',
        imgCaption: 'The Mosaic View: each image is composed of tiles drawn from the archive, matched by visual similarity. The entire collection becomes a single image you can zoom into infinitely.',
        imgRight: false,
      },
      {
        heading: 'The Galaxy View — 30 Years Rearranged in Real Time',
        text: 'The Galaxy view displays the entire collection as a field of interactive points — at sufficient zoom, actual thumbnails appear. Switching axes reorganizes all 189,000 photos instantly: set the horizontal axis to Year for a massive timeline, switch to Location and points reorganize by geography, or switch to Camera Model to see how Lourdes\'s equipment evolved over the decades. Filter to a specific person via face recognition to isolate their entire life story.',
        img: RI + 'photodance_01.jpg',
        imgCaption: 'Strip View: each cell is a photo arranged by a chosen axis. Switching axes reorganizes the entire layout in real time.',
        imgRight: true,
      },
      {
        heading: 'Four Projects That Got Here First',
        text: 'PhotoDance is the culmination of four ancestral projects: MediaFrame (2000s) — demonstrated at CES with Bill Gates and used as the browser for Gordon Bell\'s MyLifeBits project; TimeQuilt (2005) — published at SIGCHI, letting users browse archives by diving into representative cluster photos; LiveLabs Pivot (2009) — shipped at Microsoft LiveLabs, generalizing the ideas to any visual collection; and SandDance (2015) — shipped in Power BI and shown on stage with Satya Nadella at the 2017 CEO Summit. PhotoDance combines elements of all of them for a personal photo library.',
        img: RI + 'photodance_02.jpg',
        imgCaption: 'Galaxy view: 6,873 photos from 2014 arranged by month. Each column of thumbnails is a month\'s worth of photographs.',
        imgRight: false,
      },
      {
        heading: 'Multiple Layouts, Multiple Answers',
        text: 'The same set of photographs arranged three different ways — by month, by month × camera model, and by geographic map — each answers a fundamentally different question about the collection\'s structure. This is the core SandDance insight applied to personal photography: the arrangement is the analysis.',
        img: RI + 'photodance_03.jpg',
        imgCaption: 'The same 6,873 photos arranged by camera model × year. Each row is a camera; each column a year, revealing how shooting habits evolved.',
        imgRight: true,
      },
      {
        heading: 'The AI Pipeline: Curating the "Incidental Life"',
        text: 'Before either view can work, the photos need enrichment. A four-stage offline pipeline handles this: (1) Semantic Classification via CLIP — identifies non-memories like lens-cap fires, restaurant menus, and grocery items, either discarding or flagging them for private layers; (2) Quality Scoring — sharpness, brightness, and aesthetic scores for first-pass filtering; (3) Event Clustering — groups shots into distinct events using temporal gaps; (4) Identity Indexing — links faces across the entire 30-year archive. The pipeline also interpolates GPS from iPhone frames to adjacent DSLR frames, and identified 19,725 burst groups to collapse near-identical rapid-fire shots into single representative moments.',
        img: RI + 'photodance_04.jpg',
        imgCaption: 'Geographic map layout: 778 of 6,873 photos from 2014 carry GPS data, plotted on an interactive map.',
        imgRight: false,
      },
      {
        heading: 'Burst Comparison and the Rendering Challenge',
        text: 'The burst comparison view shows a candidate frame alongside the current representative with synchronized zoom/pan and an optional red-highlight diff overlay that marks differing pixels. On the rendering side, the initial Canvas 2D implementation ran at ~20ms per frame. Moving to WebGL2 dropped that to 11ms — points became GPU primitives drawn in parallel. A sprite atlas loads actual thumbnails into GPU memory at zoom threshold, with an LRU cache managing memory dynamically.',
        img: RI + 'photodance_05.jpg',
        imgCaption: 'Burst comparison view: synchronized zoom/pan with optional pixel-diff overlay helps pick the sharpest frame from a burst.',
        imgRight: true,
      },
      {
        heading: 'Building This with an AI Collaborator',
        text: 'I used Claude Code throughout the entire development of PhotoDance — not as an autocomplete tool, but as a genuine architectural collaborator. AI completely altered the cost of trying things. Complex tasks I would have deferred indefinitely — a WebGL2 GPU renderer, an LRU-evicting sprite atlas, iPad touch-gesture integration, a perceptual-hashing pipeline — became low-risk, fast-paced experiments. I held the design, UX judgment, and architectural guardrails. Claude held the execution: React state management, WebGL shader authorship, CSS layouts, and SQLite query optimization. The boundary between design and implementation became the interesting thing to negotiate, not a source of friction.',
        img: RI + 'photodance_06.jpg',
        imgCaption: 'At zoom threshold (18px screen diameter), each point loads and displays its actual photograph from the GPU sprite atlas.',
        imgRight: false,
      },
    ],
};

const meaningMachineSlide: Slide = {
    title: 'PhotoDance · The Meaning Machine',
    slug: 'meaning-machine',
    year: 2026,
    venue: 'Personal Research Project',
    citations: 0,
    img: RI + 'meaning_cover.jpg',
    citation: '<div class="csl-entry">Drucker, S. M. (2026). <i>PhotoDance: The Meaning Machine — How a Photo Becomes Meaning</i>. Personal research project.</div>',
    text: '',
    videos: [
      { label: 'Watch the film', url: 'https://youtu.be/oyRprPP6dA8' },
    ],
    sections: [
      {
        heading: 'A Photo Is Just a Grid of Numbers',
        text: 'Open any photo on a computer and, underneath, it is nothing but three grids of numbers — a brightness for red, green, and blue at every pixel. Who is in the frame, where it was taken, whether it was worth keeping: none of that is written in those numbers. My last PhotoDance post showed what the finished tool does — thirty years of family photos turned into a space you can fly through. This one is about the harder half: how a pile of pixel grids becomes something you can actually understand and search. The trick is never a single clever model. It is a dozen small steps, each adding one layer of meaning, and a viewer built to use all of them at once.',
        img: RI + 'meaning_01.jpg',
        imgCaption: 'To a computer a photo is only three grids of numbers — one each for red, green, and blue. Everything that makes it a memory has to be worked out.',
        imgRight: false,
      },
      {
        heading: 'Laid Out by Time and Color',
        text: 'Some structure comes for free. Every file carries an EXIF tag its camera wrote — the moment of capture, the make and model, sometimes GPS — and PhotoDance reads it before running anything expensive. Lay each photo along a timeline by its EXIF date, tint it by the dominant color of its own pixels, and thirty years sort themselves into the view here: every vertical band a slice of time, its color the mood of what happened then. No model has run yet, and yet meaning is already within reach — select a run of years, filter to just those photos, and browse them. The whole reveal comes from the tag alone.',
        img: RI + 'meaning_02.jpg',
        imgCaption: 'The strip chart: every photo placed on a timeline by its EXIF date and tinted by its own dominant color. Even here you can select, filter, and browse to read meaning from the tag alone.',
        imgRight: true,
      },
      {
        heading: 'The Whole Pipeline',
        text: 'From there the real work is a sequence. Each photo passes through roughly a dozen stages, and the order matters — every stage leaves behind something the next one leans on. Duplicates go first, so nothing downstream is computed twice; quality scores come before faces, so a sharp frame can stand in for a blurry moment; captions build on the faces and places already found. What follows walks that chain, stage by stage. Each section is named and colored to match the map here.',
        img: RI + 'meaning_03.jpg',
        imgCaption: 'The enrichment pipeline — roughly a dozen stages, each leaving behind something the next one builds on.',
        imgRight: false,
      },
      {
        stage: 'Ingest',
        stageColor: '#e06b52',
        heading: 'A Very Big Shoebox',
        text: 'Everything lands in one pile first — more than 227,000 files pulled from Amazon, Google, and Apple Photos and from the higher-end cameras cataloged in Lightroom. Crucially, they arrive already annotated: the cloud services had clustered faces and detected objects, and over the years we had starred favorites, named a handful of people, and built albums by hand. A naive importer would throw all of that away. PhotoDance treats it as evidence instead — a free first guess that every later stage can confirm, correct, or extend.',
        img: RI + 'meaning_04.jpg',
        imgCaption: 'One pile, filled from every source — each photo carrying whatever work had already been done to it.',
        imgRight: true,
      },
      {
        stage: 'Dedup',
        stageColor: '#e0954e',
        heading: 'Many of Those Files Are Copies',
        text: 'A shoebox that size is mostly redundancy. Byte-identical copies are the easy case — hash them, keep one. The subtle case is the re-save: a JPEG exported from a HEIC has different bytes but the same picture, so PhotoDance compares perceptual fingerprints rather than raw data, folding the twins together while keeping genuine crops and edits. Rapid-fire bursts collapse to their sharpest frame. What began as a quarter-million files settles to about 160,000 distinct photographs.',
        img: RI + 'meaning_05.jpg',
        imgCaption: 'Exact duplicates, re-saves caught by a perceptual fingerprint, and bursts folded to their sharpest frame — the pile thins to what is actually distinct.',
        imgRight: false,
      },
      {
        stage: 'Quality',
        stageColor: '#d9b64a',
        heading: 'The Models It Computes',
        text: 'Now the models start, and they disagree in useful ways. MUSIQ, NIMA, and MANIQA judge technical quality — focus, exposure, noise — while a LAION aesthetic predictor and ArtiMuse, an aesthetics-tuned vision model, judge taste. PhotoDance blends them, with a full-resolution sharpness measure, into one keeper score, tuned so its ranking matches the stars Lourdes actually gave photos over the years. Sort the library by that score and the taste is unmistakable: out of 160,000 photos, murals, cathedrals, crashing surf, and a lone tree in the snow rise to the top. These are the scores that later let one frame stand in for a whole moment.',
        img: RI + 'meaning_06.jpg',
        imgCaption: 'The library re-sorted by the NIMA aesthetic model, best first — the top of 166,075 photos, chosen by the model rather than by hand.',
        imgRight: true,
      },
      {
        stage: 'Faces',
        stageColor: '#a9c24f',
        heading: 'Who\'s in the Picture',
        text: 'So much of a life is the people in it. A detector (RetinaFace) finds every face; an ArcFace model turns each one into a 512-number signature, and those signatures cluster into people — the same person recognized across thirty years and a change of haircut. Amazon\'s tags give some clusters names; PhotoDance fills in the rest with a deliberately cautious rule. When a photo holds exactly one face and exactly one known name, that pairing must be right, so the name is safe to attach — and from those certain anchors it spreads outward to the crowded group shots. Every propagated name is marked and reversible, so a good guess never hardens into a wrong fact.',
        img: RI + 'meaning_07.jpg',
        imgCaption: 'Faces clustered across the whole archive by their ArcFace signatures. A name that is certain in one photo anchors the rest.',
        imgRight: false,
      },
      {
        stage: 'Meaning',
        stageColor: '#6cb95c',
        heading: 'A Space of Meaning',
        text: 'The richest layer is meaning itself. PhotoDance runs every photo through OpenCLIP — a ViT-H-14 model trained on two billion image-text pairs — which places it as a point in a 1,024-dimension space where nearby means visually and conceptually similar, with nobody having labeled a thing. Flatten that space to a map and its structure is striking: seascapes drift to one shore and landscapes to another, while cities, wildlife, flowers, art, and food each settle into a region of their own — content the model was never told to look for, sorting itself out. And because the same model can embed words into this same space, a typed phrase lands wherever its meaning already lives — which is what turns the map into something you can search.',
        img: RI + 'meaning_08.jpg',
        imgCaption: 'The meaning space flattened to a map: 92,315 photos arranged by their OpenCLIP embeddings, with content regions — seascapes, landscapes, wildlife, cities — emerging on their own.',
        imgRight: true,
      },
      {
        stage: 'Ground',
        stageColor: '#46b0b8',
        heading: 'Grounded in Real Places',
        text: 'A caption is only useful if it is true. A vision-language model (InternVL2) writes a first description from the pixels alone — "two people smiling in front of a mosaic." A second, text-only pass then grounds it, swapping in the names the face stage resolved and the place the location stage found, so the generic line becomes "Lourdes and Steven at Park Güell in Barcelona." The names come from faces, the place from the EXIF tag, the scene from the caption model — one true sentence that exists only because every earlier stage ran first.',
        img: RI + 'meaning_09.jpg',
        imgCaption: 'The enriched caption: names, place, and location resolved and tied back to the photo they describe.',
        imgRight: false,
      },
      {
        stage: 'Events',
        stageColor: '#6f7fd8',
        heading: 'Folded Into Events',
        text: 'Photos are not really remembered one at a time; they are remembered as occasions. PhotoDance reads the gaps between timestamps to fold a stream of shots into events, groups nearby events into outings and trips, and gives each a generated name from what is inside it — "Snowy Forest Fun," a birthday, a road trip. The result is a browsable journal laid over a true-time strip, far closer to how the collection lives in memory than any folder ever was.',
        img: RI + 'meaning_10.jpg',
        imgCaption: 'The events view: automatically named outings and trips, each with its dates, people, and count, over a true-time strip.',
        imgRight: true,
      },
      {
        stage: 'Propagate',
        stageColor: '#5a8fd6',
        heading: 'Borrowed Locations',
        text: 'Grouping does more than tidy the timeline — it lets facts travel between photos. Half the collection never recorded where it was: a Nikon has no GPS, a phone does. But a Nikon frame shot minutes from a located phone photo was almost certainly in the same place, so PhotoDance lets the located photo lend its coordinates to its neighbors in time — never across owners, and always reversibly, keeping the original untouched. On this collection that inference put nearly nine thousand more photos on the map, and the same kind of borrowing carries names and scenes between neighbors too.',
        img: RI + 'meaning_11.jpg',
        imgCaption: 'GPS flows between neighbors in time: each dashed line carries an iPhone anchor\'s location up to the Nikon whale shots taken minutes away — 690 of 786 placed here from a handful of anchors, and 8,905 across the whole collection.',
        imgRight: false,
      },
      {
        heading: 'The Machine and the Map',
        text: 'None of these stages is impressive on its own — a quality score, a face cluster, one caption. What makes them add up is that they all write into the same place, and the viewer is built to use them together. Ask one plain question — "sunsets over the water" — and the answer appears in every view at once: lit up across the timeline, gathered into a single glowing cluster on the meaning map, pinned to the coastlines where each was taken, and laid out as the photographs themselves. The same 373 pictures, selected once and seen four ways. That is the point of the whole machine — not to file a lifetime of photos away, but to turn the pile into a space you can understand at a glance and move through by asking. The pipeline builds that space; the interface is how you live in it.',
        img: RI + 'meaning_12.jpg',
        imgCaption: 'One question — "sunsets over the water" — answered in every view at once: as a timeline, as a region on the meaning map, as points on the world map, and as the photos themselves. Selected once, shown four ways.',
        imgRight: true,
      },
    ],
    refsHtml:
      '<p class="refs-intro">Every model and method in the pipeline, in order. The composite &ldquo;our taste&rdquo; score is a PhotoDance construct fit to our own ratings, not a published model.</p>' +
      '<h4>De-duplication</h4><ul>' +
      '<li><b>Perceptual hashing (pHash)</b> &mdash; Zauner (2010), <i>Implementation and Benchmarking of Perceptual Image Hash Functions.</i> <a href="https://www.phash.org/" target="_blank" rel="noreferrer">phash.org</a></li></ul>' +
      '<h4>Quality &amp; aesthetics</h4><ul>' +
      '<li><b>MUSIQ</b> &mdash; Ke et al. (2021), ICCV. <a href="https://arxiv.org/abs/2108.05997" target="_blank" rel="noreferrer">arXiv:2108.05997</a></li>' +
      '<li><b>NIMA</b> &mdash; Talebi &amp; Milanfar (2018), IEEE TIP. <a href="https://arxiv.org/abs/1709.05424" target="_blank" rel="noreferrer">arXiv:1709.05424</a></li>' +
      '<li><b>MANIQA</b> &mdash; Yang et al. (2022), CVPR Workshops. <a href="https://arxiv.org/abs/2204.08958" target="_blank" rel="noreferrer">arXiv:2204.08958</a></li>' +
      '<li><b>LAION aesthetic predictor</b> &mdash; Schuhmann (2022). <a href="https://github.com/christophschuhmann/improved-aesthetic-predictor" target="_blank" rel="noreferrer">github</a> &middot; data <a href="https://arxiv.org/abs/2210.08402" target="_blank" rel="noreferrer">arXiv:2210.08402</a></li>' +
      '<li><b>ArtiMuse</b> &mdash; Cao et al. (2025), CVPR 2026. <a href="https://arxiv.org/abs/2507.14533" target="_blank" rel="noreferrer">arXiv:2507.14533</a></li></ul>' +
      '<h4>Faces</h4><ul>' +
      '<li><b>RetinaFace</b> &mdash; Deng et al. (2020), CVPR. <a href="https://arxiv.org/abs/1905.00641" target="_blank" rel="noreferrer">arXiv:1905.00641</a></li>' +
      '<li><b>ArcFace</b> &mdash; Deng et al. (2019), CVPR. <a href="https://arxiv.org/abs/1801.07698" target="_blank" rel="noreferrer">arXiv:1801.07698</a> &middot; <a href="https://github.com/deepinsight/insightface" target="_blank" rel="noreferrer">InsightFace</a></li></ul>' +
      '<h4>Meaning: embeddings &amp; search</h4><ul>' +
      '<li><b>CLIP</b> &mdash; Radford et al. (2021), ICML. <a href="https://arxiv.org/abs/2103.00020" target="_blank" rel="noreferrer">arXiv:2103.00020</a></li>' +
      '<li><b>OpenCLIP</b> (ViT-H-14, LAION-2B) &mdash; Ilharco et al. (2021); Cherti et al. (2023), CVPR. <a href="https://github.com/mlfoundations/open_clip" target="_blank" rel="noreferrer">github</a> &middot; <a href="https://arxiv.org/abs/2212.07143" target="_blank" rel="noreferrer">arXiv:2212.07143</a></li>' +
      '<li><b>UMAP</b> &mdash; McInnes, Healy &amp; Melville (2018). <a href="https://arxiv.org/abs/1802.03426" target="_blank" rel="noreferrer">arXiv:1802.03426</a></li>' +
      '<li><b>FAISS</b> &mdash; Johnson, Douze &amp; J&eacute;gou (2019), IEEE Big Data. <a href="https://arxiv.org/abs/1702.08734" target="_blank" rel="noreferrer">arXiv:1702.08734</a></li></ul>' +
      '<h4>Captioning</h4><ul>' +
      '<li><b>InternVL2</b> &mdash; Chen et al. (2024), CVPR. <a href="https://arxiv.org/abs/2312.14238" target="_blank" rel="noreferrer">arXiv:2312.14238</a> &middot; <a href="https://github.com/OpenGVLab/InternVL" target="_blank" rel="noreferrer">models</a></li></ul>' +
      '<h4>Grounding &amp; the natural-language agent</h4><ul>' +
      '<li><b>Qwen2.5</b> (7B / 14B / 32B, via Ollama) &mdash; Qwen Team (2024). <a href="https://arxiv.org/abs/2412.15115" target="_blank" rel="noreferrer">arXiv:2412.15115</a></li>' +
      '<li><b>Claude</b> (Haiku, Sonnet) &mdash; Anthropic (2024), Claude 3 Model Card. <a href="https://www.anthropic.com/" target="_blank" rel="noreferrer">anthropic.com</a></li></ul>',
};

const slides: Slide[] = [
  ...(SHOW_PHOTODANCE ? [photodanceSlide, meaningMachineSlide] : []),
  {
    title: 'SandDance',
    year: 2013,
    venue: 'Microsoft Research',
    citations: 520,
    img: RC + 'researchImages/sanddance.png',
    citation: '<div class="csl-entry">Drucker, S. M., and Fernandez, R. (2013). <i>SandDance</i>. Microsoft Research.</div>',
    text: `A browser-based information visualization system that scales to hundreds of thousands of items while keeping every individual record visible as a distinct mark. SandDance focuses on natural interaction techniques — touch, speech, and gesture — so the entire experience can be operated without a mouse. Users fluidly transition between unit, aggregate, and relational views of the same dataset. The system has shipped in Microsoft PowerBI, Azure Data Explorer, and Visual Studio Code.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/sanddance.pdf',
    video: 'http://research.microsoft.com/~sdrucker/video/TouchViz2.mp4',
  },
  {
    title: 'Spectator Gaming: Watch, Interact, Broadcast',
    year: 2002,
    venue: 'Microsoft Research · Microsoft 5,000th Patent',
    citations: 0,
    img: RC + 'researchImages/spectator_photo.jpg',
    citation: '<div class="csl-entry">He, L., Wong, C. G., Roseway, A. J., Drucker, S. M., Cohen, M. F., and De Mar, S. D. (2006). <i>Spectator Experience For Networked Gaming</i>. US Patent US-2006-0098013-A1. Microsoft Corporation. (Concept developed 2002, filed 2003.)</div>',
    text: `A system that turns online multiplayer games into spectator sports by giving non-playing viewers live, interactive access to matches. Spectators could switch cameras, track specific players, access real-time stats, and interact with the broadcast — capabilities that turned passive observation into an active social experience. Shipped as a proof of concept in MechWarrior and described in Microsoft's 5,000th patent. Twitch, which Amazon acquired for nearly $1 billion in 2014, commercialized this exact idea roughly nine years later. Spectator Gaming was the academic and engineering proof that people will watch strangers play video games — and want to interact while doing so.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/spectator.pdf',
    video: 'http://research.microsoft.com/~sdrucker/Video/spectator.asf',
  },
  {
    title: 'MyLifeBits: Fulfilling the Memex Vision',
    year: 2002,
    venue: 'ACM Multimedia',
    citations: 847,
    img: RC + 'researchImages/memex1.png',
    citation: '<div class="csl-entry">Gemmell, J., Bell, G., Lueder, R., Drucker, S., and Wong, C. (2002). MyLifeBits: fulfilling the Memex vision. In <i>Proceedings of the tenth ACM international conference on Multimedia</i> (pp. 235–238). ACM.</div>',
    text: `An implementation of Vannevar Bush's 1945 Memex concept: a system for storing everything a person sees, hears, and reads in digital form. MyLifeBits organizes this lifetime store through collections, full-text search, and rich annotations, while supporting multiple visualizations to help users navigate their personal history. It introduced transclusion-based authoring to weave together items from the store, and surfaced deep questions about memory, privacy, and the future of personal information management.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/mylifebits.pdf',
  },
  {
    title: 'Interactive Digital Photomontage',
    year: 2004,
    venue: 'ACM SIGGRAPH',
    citations: 1411,
    img: RC + 'researchImages/photomontage.jpg',
    citation: '<div class="csl-entry">Agarwala, A., Dontcheva, M., Agrawala, M., Drucker, S., Colburn, A., Curless, B., … Cohen, M. (2004). Interactive digital photomontage. In <i>ACM Transactions on Graphics (TOG)</i> (Vol. 23, pp. 294–302). ACM.</div>',
    text: `A framework for combining parts of a set of photographs into a single composite. Users specify high-level image objectives — such as "best focus" or "all eyes open" — which the system satisfies using graph-cut optimization to select regions from source images and gradient-domain fusion to seamlessly blend them. The interactive tools let users refine results globally or locally, making it practical to build composites that would be impossible or extremely tedious to create manually.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/photomontage.pdf',
    video: 'http://grail.cs.washington.edu/projects/photomontage/video.avi',
  },
  {
    title: 'Intermedia: A Seamless Information Environment',
    year: 1988,
    venue: 'IEEE Computer',
    citations: 840,
    img: RC + 'researchImages/intermedia.gif',
    citation: '<div class="csl-entry">Yankelovich, N., Haan, B. J., Meyrowitz, N. K., and Drucker, S. M. (1988). Intermedia: The concept and the construction of a seamless information environment. <i>IEEE Computer</i>, <i>21</i>(1), 81–96.</div>',
    text: `One of the earliest and most influential hypertext systems, developed at Brown University's Institute for Research in Information and Scholarship (IRIS). Intermedia provided a seamless environment in which documents of every type — text, graphics, timelines, video — could be linked through bidirectional web connections. Unlike earlier hypertext systems, links in Intermedia were first-class objects: any selection in any document could anchor a link, and following a link preserved context by showing both endpoints. Multi-user collaboration and context-sensitive webs of documents were supported from the start. Intermedia directly shaped the design of the World Wide Web and remains a foundational work of the hypertext field.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/intermedia1.pdf',
  },
  {
    title: 'Foveated 3D Graphics',
    year: 2012,
    venue: 'ACM SIGGRAPH Asia',
    citations: 629,
    img: RC + 'researchImages/foveated.png',
    citation: '<div class="csl-entry">Guenter, B., Finch, M., Drucker, S., Tan, D., and Snyder, J. (2012). Foveated 3D graphics. <i>ACM Transactions on Graphics (TOG)</i>, <i>31</i>(6), 164.</div>',
    text: `A rendering system that exploits the human eye's sharply limited acuity outside the fovea: only the small region where a user is actually looking is rendered at full resolution, while the periphery is rendered at progressively lower resolutions. Eye-tracking drives the system in real time, achieving 5–6× reductions in GPU workload with differences that are imperceptible to the viewer. This work is a foundational technique for modern VR and AR headsets, where rendering budget is critical.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/userstudy07.pdf',
  },
  {
    title: 'Interactions with Big Data Analytics',
    year: 2012,
    venue: 'ACM Interactions',
    citations: 512,
    img: RC + 'researchImages/bigdata.png',
    citation: '<div class="csl-entry">Fisher, D., DeLine, R., Czerwinski, M., and Drucker, S. (2012). Interactions with big data analytics. <i>Interactions</i>, <i>19</i>(3), 50–59.</div>',
    text: `An exploration of how the explosion of personal and organizational data — tweets, social graphs, purchases, search histories, sensor streams — demands fundamentally new interaction paradigms. Traditional query-and-result interfaces break down at scale; this work examines progressive querying, latency-aware UI design, and visualizations that let analysts steer computations as they run, rather than waiting for batch jobs to finish. A call to rethink the contract between users and large-scale data systems.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/inteactions_big_data.pdf',
  },
  {
    title: 'Investigating Behavioral Variability in Web Search',
    year: 2007,
    venue: 'WWW',
    citations: 423,
    img: RC + 'researchImages/websearch.png',
    citation: '<div class="csl-entry">White, R. W., and Drucker, S. M. (2007). Investigating behavioral variability in web search. In <i>Proceedings of the 16th international conference on World Wide Web</i> (pp. 21–30). ACM.</div>',
    text: `A large-scale longitudinal study of how dramatically search behavior differs between people — and within the same person across different queries. Analyzing five months of interaction logs from over two thousand volunteer users, the study found striking variation in interaction style: how deeply users explore results, how many queries they reformulate, how much they click vs. scan. The work identifies two extreme classes — "navigators" (highly consistent, goal-directed) and "explorers" (highly variable, discovery-oriented) — whose contrasting strategies offer concrete design targets for adaptive search interfaces that better support everyone.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/WhiteWWW2007.pdf',
  },
  {
    title: 'Modeltracker',
    year: 2015,
    venue: 'ACM SIGCHI',
    citations: 405,
    img: RC + 'researchImages/modeltracker.png',
    citation: '<div class="csl-entry">Amershi, S., Chickering, M., Drucker, S. M., Lee, B., Simard, P., and Suh, J. (2015). Modeltracker: Redesigning performance analysis tools for machine learning. In <i>Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems</i> (pp. 337–346). ACM.</div>',
    text: `A redesign of performance-analysis tools for machine learning that consolidates summary statistics (confusion matrices, ROC curves, precision-recall) with example-level inspection in a single interactive visualization. Rather than cycling between aggregate views and raw data files, practitioners can click directly from a model metric into the individual examples driving it — finding systematic errors, discovering data-quality issues, and understanding model behavior in a fraction of the time required by conventional ML toolkits.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/pn2048-amershi-fixed.pdf',
  },
  {
    title: 'TouchViz',
    year: 2013,
    venue: 'ACM SIGCHI',
    citations: 180,
    img: RC + 'researchImages/touchvis.png',
    citation: '<div class="csl-entry">Drucker, S. M., Fisher, D., Sadana, R., and Herron, J. (2013). TouchViz: a case study comparing two interfaces for data analytics on tablets. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 2301–2310). ACM.</div>',
    text: `A study of the tradeoffs between two UI designs for data visualization on touch tablets: a conventional desktop-style (WIMP) interface with a control panel and checkboxes, versus a FLUID interface that eliminates the control panel and places all interactions directly on the visualization itself. The comparison reveals when direct-touch data manipulation outperforms translated desktop metaphors, providing design guidelines for building data tools that are genuinely optimized for touch rather than merely ported from the desktop.`,
  },
  {
    title: 'Atom: A Grammar for Unit Visualizations',
    year: 2018,
    venue: 'IEEE VIS',
    citations: 120,
    img: RC + 'researchImages/atom.png',
    citation: '<div class="csl-entry">Park, D., Drucker, S. M., Fernandez, R., &amp; Elmqvist, N. (2018). Atom: A Grammar for Unit Visualizations. <i>IEEE Transactions on Visualization and Computer Graphics</i>, <i>24</i>(12), 3032–3043.</div>',
    text: `Unit visualizations represent every data record as a distinct visual mark, offering richer information and better mental-model alignment than aggregated charts for many tasks. Atom formalizes a grammar for this family: data passes through a pipeline of layout operations — bin, stack, pack, dodge — applied recursively until every point's size and position is determined. The grammar subsumes existing unit chart types (dot plots, unit bar charts, waffle charts) and enables novel ones, with a proof-of-concept implementation demonstrating interactive authoring of unit visualizations from declarative specifications.`,
    pdf: 'https://docs.google.com/viewer?url=https://github.com/StevenMDrucker/ResearchContent/raw/master/papers/atom.pdf',
  },
];

const slugify = (t: string) =>
  t.toLowerCase().replace(/[·:]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const slugOf = (s: Slide) => s.slug ?? slugify(s.title);

export function Feature() {
  const sliderRef = useRef<Slider>(null);
  const { story } = useParams();

  // deep-link: /#/Featured/<slug> opens that story; unknown or absent falls back to the first
  const startIndex = Math.max(0, slides.findIndex(s => slugOf(s) === story));

  // fresh loads / deep-links should start at the top of the page
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // if the story in the URL changes while already mounted, move the slider to it
  useEffect(() => { sliderRef.current?.slickGoTo(startIndex); }, [story]); // eslint-disable-line react-hooks/exhaustive-deps

  const settings = {
    dots: true,
    infinite: true,
    adaptiveHeight: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
    arrows: false,
    initialSlide: startIndex,
    // the first two stories are long; jump back to the top when paging so you never land mid-page
    beforeChange: () => window.scrollTo({ top: 0, behavior: 'auto' }),
    // keep the address bar on the current story so the link is always shareable
    afterChange: (index: number) => {
      const s = slides[index];
      if (s) window.history.replaceState(null, '', '#/Featured/' + slugOf(s));
    },
  };

  return (
    <div className="feature-outer">
      <div style={{ width: '100%' }}>
        <Slider ref={sliderRef} {...settings}>
          {slides.map(slide => (
            <div key={slide.title}>
              <div className="feature-slide">
                <div className="feature-header">
                  <div className="feature-title-row">
                    <h2 className="feature-title">{slide.title}</h2>
                    <div className="feature-nav-btns">
                      <button className="feature-nav-btn" onClick={() => sliderRef.current?.slickPrev()} aria-label="Previous">&#8592;</button>
                      <button className="feature-nav-btn" onClick={() => sliderRef.current?.slickNext()} aria-label="Next">&#8594;</button>
                    </div>
                  </div>
                  <div className="feature-meta">
                    <span className="feature-venue">{slide.venue} · {slide.year}</span>
                    {slide.citations > 0 && <span className="feature-citations">⭐ {slide.citations.toLocaleString()} citations</span>}
                    <div className="feature-links">
                      {slide.pdf && <a href={slide.pdf} target="_blank" rel="noreferrer" className="feature-link">PDF</a>}
                      {slide.video && <a href={slide.video} target="_blank" rel="noreferrer" className="feature-link">Video</a>}
                      {slide.videos?.map(v => <a key={v.url} href={v.url} target="_blank" rel="noreferrer" className="feature-link">{v.label}</a>)}
                    </div>
                    <div className="feature-citation">{parse(slide.citation)}</div>
                  </div>
                </div>
                {slide.sections ? (
                  <div className="feature-sections">
                    {slide.sections.map((sec, i) => (
                      <div key={i} className={`feature-section ${sec.imgRight ? 'feature-section--img-right' : ''}`}>
                        {sec.img && (
                          <div className="feature-section-img-wrap">
                            <img className="feature-img" src={sec.img} alt={sec.heading ?? ''} />
                            {sec.imgCaption && <p className="feature-img-caption">{sec.imgCaption}</p>}
                          </div>
                        )}
                        <div className="feature-section-text">
                          {sec.heading && (
                            <h3 className="feature-section-heading">
                              {sec.stage ? (
                                <>
                                  <span style={{ color: sec.stageColor }}>{sec.stage}</span>
                                  <span style={{ fontWeight: 400, textTransform: 'lowercase', opacity: 0.68, marginLeft: '0.45rem' }}>{sec.heading}</span>
                                </>
                              ) : sec.heading}
                            </h3>
                          )}
                          <p className="feature-text-body">{sec.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="feature-body">
                    <img className="feature-img" src={slide.img} alt={slide.title} />
                    <p className="feature-text-body">{slide.text}</p>
                  </div>
                )}
                {slide.refsHtml && (
                  <details className="feature-refs">
                    <summary>References — models &amp; methods</summary>
                    <div className="feature-refs-body">{parse(slide.refsHtml)}</div>
                  </details>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
