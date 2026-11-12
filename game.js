(() => {
'use strict';

/* ---------- rules ---------- */
const TIERS = [
  { key: 'krill', name: 'Macaw', pts: 10, color: '#d7e1f2', art: 'macaw', line: 'loud, bright, impossible to miss.' },
  { key: 'schooler', name: 'Toucan', pts: 30, color: '#7deaff', art: 'toucan', line: 'a good spot. plenty of people know it.' },
  { key: 'rare', name: 'Sloth', pts: 60, color: '#ff4d4d', art: 'sloth', line: 'easy to walk past. well found.' },
  { key: 'deepcut', name: 'Jaguar', pts: 85, color: '#bfa7ff', art: 'jaguar', line: 'almost nobody ever sees one.' },
  { key: 'krillion', name: 'Obscura', pts: 100, color: '#ffe08a', art: 'moth', line: 'the rarest thing in the forest.' },
];
// Hand-drawn 16x16 pixel sprites. '.' empty, 1 body, 2 shade, 3 highlight, 4 ink.
// 32x32 creatures. 1 = the tier colour, 2 shade, 3 highlight, 4 ink, 5 outline, 6 near-white, 7 and 8 fixed accents.
const ART = {
  krill: ['................................', '................................', '................................', '................................', '................................', '................................', '................................', '........555..........555........', '.......53325........53325.......', '......5311125......5311125......', '.....531666125....531666125.....', '....53166666125..53166666125....', '....531666461255553166646125....', '....521664461133331166446225....', '.....5216441111111111644125.....', '......53111111111111111125......', '.....5311111111111111111125.....', '....531111111111111111111125....', '....531111211111111112111125....', '...53111111222222222211111125...', '...53111173333333333337111125...', '...53111133333333333333111125...', '...52111133333333333333111125...', '....531113333333333333311125....', '....521113333333333333311125....', '...55531113333333333331112555...', '..5333111113333333333111113325..', '.531111111221111111122111111125.', '.521111122552222222255211111225.', '..52525255..55555555..52525255..', '...555555..............555555...', '................................'],
  macaw: ['................................', '.............555................', '...........5533255..............', '..........533111325.............', '.........57111111125............', '........5771111111125...........', '.......57776661111125...........', '......577776664111125...........', '.....57777766441111125..........', '.....57777766611111125..........', '......54477111111111125.........', '.......5445311111111125.........', '........5531111111111125........', '.........531111111111125........', '.........5311111111111125.......', '.........5311111111811125.......', '.........531111111118825........', '.........521111111111185........', '..........53111111181125........', '..........52111111118825........', '...........5311111111185........', '...........521111118225.........', '............52211111885.........', '.............5531112528.........', '..............52111255..........', '...............531125...........', '...............531225...........', '...............531125...........', '...............5211225..........', '................531225..........', '................522225..........', '.................5555...........'],
  toucan: ['................................', '................................', '................................', '................555555..........', '...............53333325.........', '.............55311111125........', '.........5555771111811125.......', '.....55557777771118881125.......', '...5577777777771188648125.......', '..57733333333371118441125.......', '.577777777777771111811125.......', '.5444477777777711111111125......', '..444477777777716661111125......', '..4444888888888666661111125.....', '....555555.5316666666111125.....', '...........5316666666111125.....', '...........5316666666111125.....', '...........5311666661111125.....', '...........5311166611111125.....', '...........5311111111111125.....', '...........5311111111111125.....', '...........5311111111111125.....', '...........5211111111111125.....', '............53111111111125......', '............52111111111125......', '.............5211111111125......', '..............522111111125......', '...............55222211125......', '.................55553125.......', '....................53225.......', '....................52225.......', '.....................555........'],
  sloth: ['................................', '................................', '..7.7.7...................7.7.7.', '88888888888888888888888888888888', '88888888888888888888888888888888', '.5231125................5311325.', '..531125................531125..', '..531125................531125..', '..5211125....555555....531125...', '...531125..5533333255..531125...', '...521125.5331111113255311125...', '....531125311166661112531125....', '....521125316666666612531125....', '.....5311316776666776131125.....', '.....5311177776666777711125.....', '.....521117764666676411125......', '......53111777666677711125......', '......52111666644666611125......', '.......531116664466611125.......', '.......531111126621111125.......', '.......531111112211111125.......', '.......531111111111111125.......', '.......531121111111121125.......', '.......531112111111112125.......', '.......521111111111111125.......', '........5312111111112125........', '........5211211111111225........', '.........52111111111225.........', '..........521111111225..........', '...........52222222252..........', '............55555555............', '................................'],
  jaguar: ['................................', '................................', '................................', '.....5....................5.....', '....5255................5525....', '....533255..55555555..553325....', '....531132553333333255331125....', '....521611331111711133116125....', '.....5316117111737111716125.....', '.....5311173711171117371125.....', '.....5311117111111111711125.....', '....531111111111111111111125....', '....531171111111111111117125....', '...53117371111111111111737125...', '...53111711111111111111171125...', '...53111111648111111648111125...', '...53111111848111111848111125...', '...53111111848111111848111125...', '...53117111111111111111117125...', '...53173711166666666111173725...', '...52117111666777766611117125...', '....531111666667766666111125....', '....521111666666666666111225....', '.....5211162266666662211225.....', '......52116666664666661225......', '.......522166644644661225.......', '........5522666666662255........', '..........552222222255..........', '............55555555............', '................................', '................................', '................................'],
  moth: ['................................', '................................', '..........7.7.......7.7.........', '...5.......5.........5......5...', '..525.......5.......5......525..', '..53255......5.....5.....55325..', '.5311325......555.5.....5331125.', '.531111255....5885....553111125.', '.5311177775...5885...5777711125.', '.531177447755588885557744771125.', '53111746447325822853374644711125', '53111744447113888831174444711225', '5211177447711182281117744771225.', '.52111777711118888111177771225..', '..521111111111822811111111225...', '...5211111222188881221111225....', '....52222255538228255322225.....', '.....555553331888813325555......', '.....5533311118228111133255.....', '....533111111188881111111325....', '....531111111182281111111125....', '....531117711188881117711125....', '....521177771182281177771125....', '.....5317777125885317777125.....', '.....5311771255885211771125.....', '.....531111125.55.531111225.....', '.....522211225....521112225.....', '......5552225......5222555......', '.........555........555.........', '................................', '................................', '................................'],
};
const ACC = {'krill':  ['#ff8fa3', '#2b6b3f'], 'macaw':  ['#ffd166', '#4d9bff'], 'toucan':  ['#ff8a2a', '#ffd166'], 'sloth':  ['#3b2a1a', '#5a3d22'], 'jaguar':  ['#1a1208', '#c8ff5a'], 'moth':  ['#fff3c4', '#5a4024']};
// Shaded 32x32 creature icons for menus, results and the legend, each in its own colours (drawn by scratch icons2.py).
const ICONS = {"krill":{"rows":["................................","................................","................................","................................",".......aaaaa........aaaaa.......","......abcccca......abcccca......",".....abcccccca....abcccccca.....","....abcddeedccaaaabcddeedcca....","....acddfffddgbccccddfffddga....","....acddfhhfdgcccgcddfhhfdga....","....acddfhhfggcddgcddfhhfgga....",".....agddffggbddddcgddffgga.....",".....abgggggbiddddcigggggba.....",".....acccccccddddddccccccga.....",".....accccccddddddddcccccga.....",".....acdddddddddddddddddgga.....","......adddjddddddddddjddga......",".....abddddjjjjjjjjjjjdddii.....",".....aiidddgggggggggdddddga.....","....abddddggklllllllgdddddca....","....acdddggklllllllllgddddga....","....acdddgklmmmmmmmmllddddgi....","...aaidddglmmmmmmmmmmncddggaa...",".aaoppdddglmmmmmmmmmmncddgoppaa.","aopppqcggglmmmmmmmmmnncgggpppppa","apprrrpgoppnmmmmmmmnnoppgorrrpqa","aprrrrppppqbnnnnnnnnbppppprrrrqa","apqrrrrprrqcccccccccgprrprrrqqqa",".aaqqqqrrrqaaaaaaaaaaprrqqqqqaa.","...aaaaqqqqa........apqqqaaaa...",".......aaaaa.........aaaaa......","................................"],"pal":["#2a0d05","#ffd0a8","#ff9a62","#ff7a45","#5a1a08","#ffffff","#b3401b","#141010","#3a1206","#7a2410","#fff4e6","#ffe2c4","#ffd0a0","#e0a070","#ffc59a","#ff8a52","#9c3514","#e8622f"]},"macaw":{"rows":["................................","................................","................................",".................aaaa...........","...............aabcccaa.........","..............abccccccca........","..............accddddceaa.......",".............abdddeeeeefgaa.....",".............acddeehihhgggga....",".............acddehhihjgkgla....","............aacddehmmmjgkkkga...","...........anoodddcjjjjgpkppa...","..........anooqcddcccccaappa....",".........anorrroeddeeaa..aa.....","........anorrrrqsedea...........","........aorrrrrqtteea...........",".......anrrrrrrqtttea...........",".......aorrrrrrqtuvca...........",".......aorrrrrrqtuvca...........",".......aorrrrrqqtuva............",".......aorrrrrqsuvva............",".......aorrrrqqtuva.............",".......aorrrqqsuvva.............",".......aorrqqstvva..............",".......aorqqstvva...............","...aaaaaoqqbcvvaaaaaaaaaaaaaa...","..awxxxxxxxxxxkkkxxxxxxxxxxxxa..","..axyyyyyyyyyyyyyyyyyyyyyyyyya..","...aaanooooaaaaaaaaaaaaaaaaaa...","....anooqqa.....................","....aorqqa......................","....aoqqa......................."],"pal":["#0e1a2c","#d7e8ff","#9cc2ee","#6f9fd8","#3d6ea8","#6b7380","#454b55","#ffffff","#14100c","#c6ccd6","#2b2f36","#8a94a3","#eef1f6","#b9d3f5","#7aa6dc","#16181c","#2f5a8f","#4f84c4","#fff4cf","#f8e29a","#f2d16b","#c9a33c","#c99a62","#a8743f","#5b3a1e"]},"toucan":{"rows":["................................","................................","..............aa................","............aabcaa..............","...........abccccca...aaaaa.....","..........abccddcecaaafggggaaa..",".........abcdddddehiiiggggggjfa.",".........acdddddkkiiilgmmmmnoooa",".........acdddddkpkqqlgmrrmnoosa",".........acddddddkiqqlgmmmrrrrsa","..........addddddeilllgmmnnngaa.",".........abdeedeeetaalgnnnaaa...","........abcdeteetuva.aaaaa......",".......abcddeuuuuuva............",".......acdddeuuuwwva............","......abddddeuwwwvva............","......acdddddcvvvvba............","......acdddddcccccea............","......acddddddccccea............","......acddddddddddea............","......acdddddddddeea............","......acdddddddddea.............","......acddddddddeea.............","......acddeeeeeeea..............",".......aeeejoooea...............","........aejoooooa...............","...aaaaaacosssssaaaaaaaaaaa.....","..axyyyyyyyyyyyyyyyyyyyyyyya....","..ayzzzzzzzzzzzzzzzzzzzzzzza....","...aaaaaabccaaaaaaaaaaaaaaa.....","........accea...................","........aceea..................."],"pal":["#05070b","#4e6688","#2c3a52","#1b2433","#0b0f16","#ffd6a0","#ffad5c","#c2f7d8","#78e0a6","#ffb0b8","#4de3ff","#2a8a5a","#ff8a2a","#c8561a","#ff6676","#0a0a0a","#46c27e","#7a3410","#9e1f2c","#fff6c8","#ffe58a","#d1a93a","#f6d35a","#c99a62","#a8743f","#5b3a1e"]},"sloth":{"rows":["...aa....................aa.....","..abca..................abca....","aabcccaaaaaaaaaaaaaaaaaabcccaaaa","decfgghiiideeeeeeeeehiiicfggdeee","eeeggdiiijeeeeeeeeekiiiiiggdeeek","ekkeekilmlekkkkkkkkkimlmldekkkkk","aaaaaaimmjaaaaaaaaaaimmjjaaaaaaa",".....aimmmia......ahmmmja.......",".....aimmmja......aimmmja.......",".....aimmmjaaaaaaaaimmjja.......","......ammmjahiiiiiimmmja........","......aimmmijjjjjjjmmmja........","......aimmmjjnooooojmmja........","......aimmjjnooooooojmja........",".......ammjnpqrrrrrpqjja........",".......aimjopsprrrpspia.........",".......aimjprrrrtrruupa.........","........ammiurrrrruuhja.........","........aimiiuvuuuvhimia........","........aimmiiivvviimmja........","........aimmmiiiiiimmmja........","........aimmmmmmmmmmmmja........","........aimmmmmmmmmmmmja........","........aimmmmmmmmmmmjja........",".........ammmmmmmmmmmja.........",".........aimmmmmmmmmmja.........","........ahmmmmmmmmmmmmia........","........aimmjjmmmjjjmmja........",".......ahmmjjajjjjaammmia.......",".......aimjja.aaaa.aimmja.......",".......aimja........ammmia......",".......aijja........aijjja......"],"pal":["#2a0a06","#a8eabb","#62c27c","#b88a5c","#946640","#3f9b5a","#2a6b3f","#f2a090","#d9685a","#7a2a1c","#4a2e17","#e8dccc","#b9473a","#fff8f0","#faeadc","#5a2a14","#ffffff","#f2dcc6","#141010","#3a1a10","#d8bca2","#7a3a28"]},"jaguar":{"rows":["................................","................................","................................","................................","................................","................................","................................",".....................a....a.....","....................abaaaaba....","...................abcddddca....","...aaaaaaa.........adeddddeda...","..abdddddda.......abeeeeeeedda..",".abddddddfa.......adeeeeeeeefa..",".adeefffffaaaaaaaabeeeeeeegeeda.","abeeffaaaabddddddddeeeeeehheefa.","adeffaabddddddddddeeeeeeeeeeefa.","adefaabdddeeiieeeeeiieeeeeeeeeda","adefabdeiieeeieeeeeeeeeeeeeeeejj","adeeddeeieeeeeeeiieeeeeeeeeeeffa","adeedeeeeeeeeeeeeieeeeeeffffkka.","adeeeeieeeeeeeeeeeeeeeeffaaaaa..","adeffeeeeeiieeiieeeeeeefa.......","adefafeeeeeeeeeeeeieeeefa.......","adffaaeeeeeeeeeeeeeeeeefa.......",".aaa.adeffeeeeeeeeeffeefa.......",".....adefaeefffffeefaeefa.......",".....adefadefaaaaeefadefa.......",".....adefadefa..adefadefa.......",".....adefadefa..adefadefa.......",".....aaeaaaeaa..aaeaaaeaa.......",".....adffadffa..adffadffa.......","......aaa.aaa....aaa.aaa........"],"pal":["#05030a","#6a5a9c","#7a6ab0","#3b2f5c","#231c36","#0d0a16","#f4ffd0","#c8ff5a","#56478a","#1a1424","#4a3d72"]},"moth":{"rows":["................................","................................","................................","...a........................a...","..aba.......c......c.......aba..",".abccaa.....d......d.....aabcca.",".aceccca...c.d....d.c...abccefa.",".acebccca.....d..d....aabccbefa.","abebeeeccaa....dd....abcceeebeca","aceeeeeeccca..agha..abcceeeeeffa",".aeeeeaaecccaaahiaaabceeaaeeefa.",".aceeejaeeecccahiabcceeeajeeffa.",".aceeeeeeeeecfchibcceeeeeeeefa..","..aeeeeeeeeeefgddheeeeeeeeeefa..","..aceeeeeeeeefhddiceeeeeeeeffa..","...affffffeeefhddiceefffffffa...","....aaaaaaffffhddicfffaaaaaa....",".....aaaaaklllhddikllaaaaaa.....","....aklllllllmhddillllllllla....","....alllllnnnmhddilnnlllllma....","....alnnnnnnnmhdiilnnnnnnnma....","...aknnnnnnnnnldiknnnnnnnnma....","...alnkonnnnnmmhilnnnnnnoknla...","...alnnonnnnmmahilnnnnnnonnma...","...alnnnnnnmmaahiamnnnnnnnmma...","....ammnnnmma..aa.amnnnnmmma....",".....aammmma.......amnmmmaa.....",".......aama.........ammaa.......",".........a...........aa.........","................................","................................","................................"],"pal":["#3a2408","#fff2c4","#ffd77a","#5e4422","#f0b84a","#b0782a","#a68250","#7e5e32","#3a2a14","#fff6d8","#ffd0a0","#ffaa5c","#a85a2a","#e8873a","#5a1a08"]}};
const spriteCache = {};
function sprite(art, color) {
  const key = art + color;
  if (spriteCache[key]) return spriteCache[key];
  const I = ICONS[art];
  if (I) {
    // a locked companion shows as a flat silhouette in the colour it was given
    // drawn in its own colours, unless it is asked for in another one (a player's frog, the frog turned gold):
    // then every colour keeps its lightness but takes that hue, and the whites, blacks and outline stay as they are
    let natural = !color; try { natural = natural || [...TIERS.filter(t => t.art === art).map(t => t.color), ...PALS.filter(p => p.art === art).map(p => p.color), ...TIER_COLOURS.cb].includes(color); } catch (e) { natural = true; }
    const tint = c => { if (natural) return c; const v = parseInt(c.slice(1), 16), r = v >> 16, g2 = (v >> 8) & 255, b = v & 255, mx = Math.max(r, g2, b), mn = Math.min(r, g2, b), L = (mx + mn) / 510;
      if (mx - mn < 26 || L < 0.13) return c; const t = parseInt(color.slice(1), 16), T = [t >> 16, (t >> 8) & 255, t & 255], f = L < 0.5 ? (0.5 - L) * 1.9 : (L - 0.5) * 0.85, to = L < 0.5 ? 0 : 255;
      return 'rgb(' + T.map(x => Math.round(x + (to - x) * Math.min(0.9, f))).join(',') + ')'; };
    const lock = color === '#3a4a3e', cv = document.createElement('canvas'); cv.width = cv.height = I.rows.length; const g = cv.getContext('2d'), ch = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    I.rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] !== '.') { g.fillStyle = lock ? color : tint(I.pal[ch.indexOf(row[x])]); g.fillRect(x, y, 1, 1); } });
    return (spriteCache[key] = cv.toDataURL());
  }
  const n = parseInt(color.slice(1), 16), rgb = [n >> 16, (n >> 8) & 255, n & 255];
  const mix = (to, f) => 'rgb(' + rgb.map(c => Math.round(c + (to - c) * f)).join(',') + ')';
  const acc = ACC[art] || ACC.krill;
  const pal = { 1: color, 2: mix(0, 0.45), 3: mix(255, 0.6), 4: '#050d08', 5: mix(0, 0.78), 6: '#f4f7ee', 7: acc[0], 8: acc[1] };
  const rows = ART[art] || ART.krill, size = rows.length;
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const g = cv.getContext('2d');
  rows.forEach((row, y) => { for (let x = 0; x < size; x++) if (pal[row[x]]) { g.fillStyle = pal[row[x]]; g.fillRect(x, y, 1, 1); } });
  return (spriteCache[key] = cv.toDataURL());
}
const icon = (art, color, size, cls) => h('img', { class: 'spr ' + (cls || ''), src: sprite(art, color), width: size, height: size, alt: '' });
const tierIcon = (tier, size, cls) => icon(TIERS[tier].art, TIERS[tier].color, size, cls);
const M_PER_PT = 10;
const MAX_DEPTH = 12000; // the bottom of the Obscura, metres
// every world on the way down, for 'reached the …'; the gauge shows a few landmarks from it
const ZONES = [[0, 'Canopy'], [150, 'Understory'], [600, 'Deep shade'], [1500, 'Forest floor'], [2000, 'Root caves'], [2800, 'Underground river'], [3700, 'Glowworm grotto'], [4700, 'Crystal caverns'], [5800, 'Sunken temple'], [7000, 'Fungal deep'], [8400, 'Magma veins'], [10000, 'Obscura']];
const TICKS = [[0, 'Canopy', 'canopy'], [600, 'Deep shade', 'deep shade'], [1500, 'Forest floor', 'forest floor'], [2800, 'River', 'river'], [4700, 'Crystals', 'crystals'], [7000, 'Fungal deep', 'fungal deep'], [10000, 'The Obscura', 'the obscura'], [MAX_DEPTH, 'The bottom', 'the bottom']];
const COLORS = ['#ff7a45', '#7dffb0', '#ffe08a', '#ff8fd0', '#6fd6ff', '#c9f26a', '#ffb0a0', '#e6f0dc'];
const PICK_MS = 25000, COUNTDOWN_MS = 4000;

/* ---------- answer matching ---------- */
function norm(s) {
  s = String(s).toLowerCase().replace(/ø/g, 'o').replace(/ł/g, 'l').replace(/ß/g, 'ss').replace(/æ/g, 'ae').replace(/œ/g, 'oe').replace(/ı/g, 'i').replace(/đ/g, 'd').replace(/þ/g, 'th').normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.replace(/\+\+/g, 'plusplus').replace(/#/g, 'sharp').replace(/&/g, ' and ');
  s = s.replace(/^\s*the\s+/, '').replace(/\bst\.?\s/g, 'saint ');
  return s.replace(/[^a-z0-9]/g, '');
}
// Edit distance where a swapped pair of neighbouring letters counts as one slip.
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let pp = null, prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (pp && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, pp[j - 2] + 1);
      cur[j] = v; if (v < best) best = v;
    }
    if (best > max) return max + 1;
    pp = prev; prev = cur;
  }
  return prev[b.length];
}
// A looser spelling key so near-misses still land: ph/f, ck/k, z/s, y/i, doubled letters.
const loose = k => k.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/z/g, 's').replace(/y/g, 'i').replace(/(.)\1+/g, '$1').replace(/e$/, '');
const FILLER = new Set(['the', 'of', 'and', 'a', 'an', 'in', 'de', 'la', 'le', 'st', 'saint', 'mr', 'mrs', 'dr']);
// Extra answers for existing prompts are merged in before anything is indexed.
for (const a of window.BANK_ADD || []) {
  const t = window.BANK.find(x => x && x.id === a.id);
  if (t && Array.isArray(a.t)) a.t.forEach((str, i) => { if (str && i < 5) t.t[i] = t.t[i] ? t.t[i] + ', ' + str : str; });
  // extra spellings for answers that are already there: { alias: { 'Thylacine': ['Tasmanian tiger'] } }
  if (t && a.alias) {
    const want = {}; for (const [k, v] of Object.entries(a.alias)) want[norm(k)] = [].concat(v);
    t.t = t.t.map(str => String(str || '').split(',').map(raw => { const head = raw.split('|')[0].trim(), extra = want[norm(head)]; return extra ? raw.replace(/\s+$/, '') + '|' + extra.join('|') : raw; }).join(','));
  }
}
// Each prompt is indexed the first time it is needed, so loading stays quick however big the bank gets.
function buildTopic(t) {
  const map = new Map(), words = new Map(), lmap = new Map(), list = [], bares = [];
  t.t.slice(0, 5).forEach((str, tier) => {
    for (const raw of String(str).split(',')) {
      const forms = raw.split('|').map(x => x.trim()).filter(Boolean);
      if (!forms.length) continue;
      // a name that already exists only contributes its extra spellings
      let e = map.get(norm(forms[0]));
      if (!e) { e = { name: forms[0], tier, toks: [] }; list.push(e); }
      for (const f of forms) {
        const k = norm(f); if (k && !map.has(k)) map.set(k, e);
        if (k && !lmap.has(loose(k))) lmap.set(loose(k), e);
        const tk = f.split(/[\s\-\/]+/).map(norm).filter(w => w && !FILLER.has(w));
        if (tk.length) e.toks.push(tk);
        for (const w of tk) if (w.length >= 4) { if (!words.has(w)) words.set(w, new Set()); words.get(w).add(e); }
        const bare = f.replace(/\s*\([^)]*\)\s*$/, '').trim(); if (bare && bare !== f) bares.push([bare, e]);
      }
    }
  });
  // "Dim (A Bug's Life)": nobody types the bracket, so the plain name works too, unless it already means another answer
  for (const [bare, e] of bares) { const k = norm(bare); if (k && !map.has(k)) map.set(k, e); if (k && !lmap.has(loose(k))) lmap.set(loose(k), e); }
  // Shape the tiers the way Krillion does: a handful of Krill, a broad Schooler and Rare middle,
  // a long Deep Cut tail, and exactly one Krillion with a fact.
  const fix = (window.TIERFIX || {})[t.id] || (t.k ? { top: list.filter(e => e.tier === 0).map(e => e.name), k: t.k } : {});
  const top = new Set((fix.top || list.filter(e => e.tier === 0).slice(0, 5).map(e => e.name)).map(norm));
  for (const e of list) e.tier = e.tier === 0 ? (top.has(norm(e.name)) ? 0 : 1) : e.tier >= 3 ? 3 : e.tier;
  let star = fix.k && map.get(norm(fix.k[0]));
  if (!star && fix.k) { star = { name: fix.k[0], tier: 3, toks: [] }; list.push(star); map.set(norm(star.name), star); }
  if (!star) star = list.filter(e => e.tier === 3).pop() || list[list.length - 1] || { name: '', tier: 4, toks: [] };
  star.tier = 4; star.fact = fix.k ? fix.k[1] : '';
  // up to four Obscuras a prompt: the one with its fact, and up to three more chosen by hand for being genuinely rare
  for (const n of ((window.OBX || {})[t.id] || t.ob || []).slice(0, 3)) { const e = map.get(norm(n)); if (e && e !== star) e.tier = 4; }
  return { id: t.id, name: t.name, blurb: t.blurb, map, words, lmap, list, star };
}
const RAW = {}, TOPICS = {};
for (const t of window.BANK) if (t && t.id && Array.isArray(t.t) && t.t.some(x => x && String(x).trim()) && !RAW[t.id]) RAW[t.id] = t;
for (const id in RAW) Object.defineProperty(TOPICS, id, { enumerable: true, configurable: true, get() { const v = buildTopic(RAW[id]); Object.defineProperty(TOPICS, id, { value: v, enumerable: true }); return v; } });
// Broad school-quiz categories make dull prompts. They stay in the bank as raw material
// for the oddly specific prompts below, but are never offered on their own.
const HIDDEN = new Set(['composers', 'philosophers', 'emperors', 'painters', 'authors', 'novels', 'battles', 'empires', 'monarchs', 'explorers', 'scientists', 'presidents', 'bible', 'phobias', 'greekmyth', 'constellations', 'bones', 'gems', 'grapes', 'dances', 'musicals', 'shakespeare', 'money', 'trees', 'languages', 'code', 'capitals', 'elements', 'tube', 'ukplaces', 'nationalparks', 'deserts', 'waters', 'mountains', 'rivers', 'islands', 'eurocities', 'asiacities', 'africacities', 'uscities', 'spaceobjects', 'illnesses', 'catbreeds', 'flowers', 'fish', 'reptiles', 'bestpicture', 'breads', 'beers', 'spices', 'instruments', 'cheese', 'genres', 'rockbands', 'popstars', 'rappers', 'birds', 'mammals', 'sea', 'insects', 'countries', 'states', 'cars', 'sports', 'dogs', 'vegetables', 'fruits', 'tools', 'clothing', 'desserts', 'dishes', 'cocktails', 'pasta', 'candy', 'gods', 'dinosaurs', 'bodyparts', 'sitcoms', 'cartoons', 'videogames']);
const COLOURS = /\b(red|blue|green|black|white|gold|golden|silver|grey|gray|yellow|orange|pink|purple|scarlet|crimson|violet|brown|ruby|emerald|amber|blond|blonde|rosy|rose|snowy|snow)\b/i;
const ANIMALS = ['mammals', 'birds', 'sea', 'reptiles', 'insects', 'fish'];
const CITIES = ['uscities', 'eurocities', 'asiacities', 'africacities', 'capitals'];
const one = n => !/[\s\-]/.test(n);
// Each takes answers from existing prompts and keeps the ones that pass its test.
const DERIVED = [
  { id: 'x_and', name: 'Name a country with “an” in its name', from: ['countries'], test: n => /an/i.test(n) },
  { id: 'x_land', name: 'Name a country ending in “land” or “stan”', from: ['countries'], test: n => /(land|stan)$/i.test(n) },
  { id: 'x_short', name: 'Name a country with four or five letters', from: ['countries'], test: n => one(n) && n.length >= 4 && n.length <= 5 },
  { id: 'x_island', name: 'Name a country that is an island or islands', from: ['countries'], test: n => /^(Japan|Iceland|Ireland|United Kingdom|Cuba|Jamaica|Haiti|Dominican Republic|Bahamas|Barbados|Trinidad and Tobago|Madagascar|Sri Lanka|Singapore|Indonesia|Philippines|New Zealand|Australia|Fiji|Malta|Cyprus|Maldives|Mauritius|Seychelles|Samoa|Tonga|Papua New Guinea|Bahrain|Brunei|East Timor|Vanuatu|Solomon Islands|Grenada|Saint Lucia|Dominica|Antigua and Barbuda|Comoros|Sao Tome and Principe|Cape Verde|Saint Kitts and Nevis|Saint Vincent and the Grenadines|Kiribati|Tuvalu|Nauru|Palau|Marshall Islands|Micronesia)$/.test(n) },
  { id: 'x_newstate', name: 'Name a US state with two words in its name', from: ['states'], test: n => /\s/.test(n) },
  { id: 'x_stateA', name: 'Name a US state that ends in the letter A', from: ['states'], test: n => /a$/i.test(n) },
  { id: 'x_double', name: 'Name an animal with a double letter in its name', blurb: 'One-word names only, like giraffe', from: ANIMALS, test: n => one(n) && /([a-z])\1/i.test(n) },
  { id: 'x_three', name: 'Name an animal with a three-letter name', from: ANIMALS, test: n => one(n) && n.length === 3 },
  { id: 'x_colouranimal', name: 'Name an animal with a colour in its name', blurb: 'Like blue whale', from: ANIMALS, test: n => COLOURS.test(n) },
  { id: 'x_fishname', name: 'Name a sea creature with “fish” in its name', from: ['sea', 'fish'], test: n => /fish/i.test(n) },
  { id: 'x_birdsea', name: 'Name an animal named after another animal', blurb: 'Like tiger shark or elephant seal', from: ANIMALS, test: n => /\b(tiger|elephant|leopard|zebra|lion|wolf|horse|cat|dog|bear|bull|cow|goat|pig|hog|fox|eagle|hawk|snake|spider|parrot|bat|rat|mouse|rabbit|monkey|frog|butterfly|bird|shark|whale|crocodile|alligator|turkey|chicken|duck|swan|deer|camel|kangaroo|mole|squirrel|buffalo|ox|sheep|ram|hound)\b/i.test(n) && /\s|-/.test(n) || /^(catfish|dogfish|lionfish|parrotfish|wolffish|ratfish|goatfish|hogfish|zebrafish|frogfish|rabbitfish|cowfish|batfish|boarfish|squirrelfish|hawkfish|lizardfish|toadfish|pigfish|horsefish|bullfrog|cowbird|catbird|antlion|bearcat|seahorse|sea lion)$/i.test(n) },
  { id: 'x_san', name: 'Name a city that starts with San, Santa, Saint or São', from: CITIES, test: n => /^(san|santa|santo|saint|st\.?|são|sao)\s/i.test(n) },
  { id: 'x_newcity', name: 'Name a city with “New” or “Port” in its name', from: CITIES.concat(['ukplaces']), test: n => /\b(new|port)/i.test(n) },
  { id: 'x_cityville', name: 'Name a city ending in “ville”, “burg” or “ton”', from: CITIES.concat(['ukplaces']), test: n => /(ville|burg|burgh|ton)$/i.test(n) },
  { id: 'x_stationanimal', name: 'Name a Tube station with a colour, animal or royal in its name', from: ['tube'], test: n => COLOURS.test(n) || /\b(king|queen|prince|regent|duke|earl|baron|knight|royal|swan|elephant|raven|stag|hound|bull|fox|hart|cock|lamb)/i.test(n) },
  { id: 'x_man', name: 'Name a Marvel or DC character with “man” or “woman” in their name', from: ['marvel', 'dccomics'], test: n => /(man|woman)\b/i.test(n) },
  { id: 'x_herocolour', name: 'Name a Marvel or DC character with a colour in their name', from: ['marvel', 'dccomics'], test: n => COLOURS.test(n) },
  { id: 'x_doctor', name: 'Name a Marvel or DC character with a title in their name', blurb: 'Doctor, Captain, Mister, Lady, King…', from: ['marvel', 'dccomics'], test: n => /^(doctor|dr\.?|captain|mister|mr\.?|miss|ms\.?|mrs\.?|lady|lord|king|queen|professor|general|baron|count|sir|madame|major|colonel|commander|agent|kid|black|the)\s/i.test(n) && !/^(black|the)\s/i.test(n) },
  { id: 'x_swhplotr', name: 'Name a character from Star Wars, Harry Potter or Lord of the Rings', from: ['starwars', 'harrypotter', 'middleearth'], test: () => true },
  { id: 'x_onename', name: 'Name a Star Wars, Harry Potter or Middle-earth character known by one name', blurb: 'Like Yoda, Hagrid or Gollum', from: ['starwars', 'harrypotter', 'middleearth'], test: n => one(n) },
  { id: 'x_notsimpson', name: 'Name a Simpsons character who is not a Simpson', from: ['simpsons'], test: n => !/simpson/i.test(n) },
  { id: 'x_pokeshort', name: 'Name a Pokémon with five letters or fewer', from: ['pokemon'], test: n => one(n) && n.length <= 5 },
  { id: 'x_disneyone', name: 'Name a Disney or Pixar film with a one-word title', from: ['disneyfilms'], test: n => one(n) },
  { id: 'x_disneyname', name: 'Name a Disney or Pixar film with “the” or “and” in the title', from: ['disneyfilms'], test: n => /\b(the|and)\b|&/i.test(n) },
  { id: 'x_swiftone', name: 'Name a Taylor Swift song with a one-word title', from: ['swift'], test: n => one(n) },
  { id: 'x_beatleslove', name: 'Name a Beatles song with “love”, “you” or “me” in the title', from: ['beatles'], test: n => /\b(love|you|me)\b/i.test(n) },
  { id: 'x_cartoonthe', name: 'Name a cartoon with a character\'s name in the title', blurb: 'Like SpongeBob SquarePants', from: ['cartoons'], test: n => /'s\b|\band\b|&/i.test(n) },
  { id: 'x_carshort', name: 'Name a car brand with four letters or fewer', from: ['cars'], test: n => one(n) && n.length <= 4 },
  { id: 'x_dogterrier', name: 'Name a dog breed with a place in its name', blurb: 'Like German Shepherd', from: ['dogs'], test: n => /\b(german|french|english|irish|scottish|welsh|australian|american|siberian|alaskan|belgian|italian|chinese|tibetan|afghan|norwegian|bernese|boston|yorkshire|labrador|newfoundland|rhodesian|staffordshire|shetland|chesapeake|pembroke|maltese|havanese|pekingese|pomeranian|dalmatian|akita|shiba|brittany|brussels|catahoula|cairn|airedale|bedlington|great pyrenees|west highland|pharaoh|saint bernard|lhasa|norfolk|norwich|manchester|skye|kerry|portuguese|spanish|swedish|finnish|dutch|japanese|korean|russian|hungarian|polish|czech|swiss|tibet|caucasian|anatolian|icelandic|greenland|canadian|mexican|peruvian|brazilian|argentin|cuban|egyptian)\b/i.test(n) },
  { id: 'x_berry', name: 'Name a fruit with “berry” in its name', from: ['fruits'], test: n => /berry/i.test(n) },
  { id: 'x_elemnotium', name: 'Name a chemical element that does not end in “ium”', from: ['elements'], test: n => !/ium$/i.test(n) },
  { id: 'x_godshort', name: 'Name a god or goddess with a name of four letters or fewer', from: ['gods'], test: n => one(n) && n.length <= 4 },
  { id: 'x_sportball', name: 'Name a sport with “ball” in its name', from: ['sports'], test: n => /ball/i.test(n) },
  { id: 'x_instrshort', name: 'Name a musical instrument with a name of five letters or fewer', from: ['instruments'], test: n => one(n) && n.length <= 5 },
  { id: 'x_bandthe', name: 'Name a band that starts with “The”', from: ['rockbands'], test: n => /^the\s/i.test(n) },
  { id: 'x_rapper', name: 'Name a rapper with “Lil”, “Young”, “Big” or “MC” in their name', from: ['rappers'], test: n => /\b(lil|young|yung|big|mc|dj|notorious|ice|kid)\b/i.test(n) },
  { id: 'x_onepop', name: 'Name a pop star known by one name', blurb: 'Like Adele', from: ['popstars', 'rappers'], test: n => one(n) },
  { id: 'x_bodyshort', name: 'Name a body part with four letters or fewer', from: ['bodyparts', 'bones'], test: n => one(n) && n.length <= 4 },
  { id: 'x_cocktailname', name: 'Name a cocktail with a place or person in its name', blurb: 'Like Moscow Mule or Bloody Mary', from: ['cocktails'], test: n => /\s/.test(n) && /^[A-Z].*\s[A-Z]/.test(n) },
  { id: 'x_spicehot', name: 'Name a herb or spice with a name of five letters or fewer', from: ['spices'], test: n => one(n) && n.length <= 5 },
];
function buildDerived(dv) {
  const t = ['', '', '', '', ''], seen = new Set();
  for (const id of dv.from) {
    const src = RAW[id] && TOPICS[id]; if (!src) continue;
    for (const str of RAW[id].t.slice(0, 5)) for (const raw of String(str).split(',')) {
      const first = raw.split('|')[0].trim(), key = norm(first), e = src.map.get(key);
      if (!first || !e || seen.has(key) || !dv.test(e.name)) continue;
      seen.add(key);
      const tier = Math.min(3, e.tier === 4 ? 3 : e.tier);
      t[tier] += (t[tier] ? ', ' : '') + raw.trim();
    }
  }
  const out = buildTopic({ id: dv.id, name: dv.name, blurb: dv.blurb || '', t });
  // carry a source prompt's hand-picked answer and fact over when it qualifies
  for (const id of dv.from) { const st = RAW[id] && TOPICS[id].star; if (st && st.fact && out.map.has(norm(st.name))) { out.star.tier = 3; out.star = out.map.get(norm(st.name)); out.star.tier = 4; out.star.fact = st.fact; break; } }
  return out;
}
for (const dv of DERIVED) {
  if (!dv.from.some(id => RAW[id])) continue;
  Object.defineProperty(TOPICS, dv.id, { enumerable: true, configurable: true, get() { const v = buildDerived(dv); Object.defineProperty(TOPICS, dv.id, { value: v, enumerable: true }); return v; } });
}
const usable = id => { try { return TOPICS[id].list.length >= 12; } catch (e) { return false; } };
const CUT = new Set(window.CUT || []);
const TOPIC_IDS = Object.keys(RAW).filter(id => !HIDDEN.has(id)).concat(DERIVED.filter(dv => dv.from.some(id => RAW[id])).map(dv => dv.id)).filter(id => !CUT.has(id));
// Returns { e, fix } for a match (fix = the player must confirm the corrected spelling),
// { amb: true } when the text fits several answers and is not specific enough, or null.
// A correction has to be a slip of the fingers, not a guess: the typed text must point at one answer only.
const typoBudget = n => n >= 12 ? 3 : n >= 7 ? 2 : n >= 4 ? 1 : 0;
// A first name on its own points at nobody in particular, so it is never completed into a full answer.
const GIVEN = new Set('james john joe joseph robert michael mike william will bill david dave richard rick thomas tom charles charlie chris christopher daniel dan matthew matt anthony tony mark donald don steven steve stephen paul andrew andy joshua josh kenneth ken kevin brian george edward ed ronald ron timothy tim jason jeffrey jeff ryan jacob jake gary nicholas nick eric jonathan jon larry justin scott brandon ben benjamin samuel sam frank gregory greg raymond ray alexander alex patrick jack dennis jerry tyler aaron jose henry adam douglas doug nathan peter pete zachary zach kyle walter harry harold carl arthur roger keith jeremy terry sean shawn austin noah liam ethan mason logan lucas oliver elijah aiden max leo luke harry oscar mary patricia jennifer jen linda elizabeth liz barbara susan sue jessica jess sarah karen nancy lisa betty margaret sandra ashley kimberly kim emily donna michelle carol amanda melissa deborah debbie stephanie rebecca laura sharon cynthia kathleen kathy amy angela anna anne ann emma olivia ava sophia isabella mia charlotte amelia harper evelyn abigail ella grace chloe lily hannah zoe kate katie rachel megan julia julie maria marie rose ruby alice jane jean joan helen diana victoria taylor jordan morgan casey jamie lee kelly dr mr mrs ms sir lord lady king queen prince princess captain doctor saint'.split(' '));
// The way people actually say things: "Nile River", "Mt Everest", "Yellowstone National Park",
// "King Henry the 8th", "New York City". Each is tried only when the words as typed match nothing.
const ORDW = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'];
const roman = n => { let r = '', v = n; for (const [d, s] of [[10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']]) while (v >= d) { r += s; v -= d; } return r; };
const TITLE = /^(?:mount|mt\.?|lake|river|the river|king|queen|president|vice president|prince|princess|emperor|empress|tsar|czar|pope|saint|st\.?|sir|lord|lady|dr\.?|doctor|planet)\s+/;
const PLACE = /\s+(?:river|rivers|mountains?|mountain range|range|national park|national monument|np|lake|island|islands|city|falls|waterfall|sea|ocean|desert|volcano|glacier|peninsula|canyon|bay|state|province|county|province|region|dynasty|empire|family|band|game|games|movie|film|series|show|the movie)$/;
function sayings(s) {
  const t = String(s).toLowerCase().replace(/\s+/g, ' ').trim(), out = new Set();
  const ord = t.replace(/\b(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/g, (m, n) => roman(+n)).replace(new RegExp('\\b(?:the\\s+)?(' + ORDW.slice(1).join('|') + ')\\b', 'g'), (m, w) => roman(ORDW.indexOf(w)));
  for (const b of new Set([t, ord])) { const p = b.replace(TITLE, ''); out.add(b); out.add(p); out.add(p.replace(PLACE, '')); out.add(b.replace(PLACE, '')); }
  out.delete(t); return [...out].filter(x => x && x.length >= 3);
}
// Players often pad an answer with words from the prompt ("lori loud" for a Loud House character) or say
// where it's from ("neo from the matrix"). Only when nothing else matched, try again without that padding;
// whatever it finds is offered as a correction, so the player still confirms it.
const PROMPT_SKIP = new Set(['name', 'a', 'an', 'the', 'of', 'or', 'and', 'that', 'is', 'in', 'from', 'with', 'who', 'has', 'have', 'famous', 'something', 'thing', 'you', 'your', 'its', 'it', 'by', 'to', 'for', 'one', 'not', 'usually', 'can']);
function match(topicId, input) {
  const r = matchCore(topicId, input);
  if (r && !r.amb) return r;
  const T = TOPICS[topicId]; if (!T) return r;
  const raw = String(input).trim(), tries = [];
  const pw = new Set(String(T.name).split(/[\s\-\/,“”"'’.()]+/).concat(String(T.name).split(/[\s\/,“”"()]+/)).map(norm).filter(w => w && !PROMPT_SKIP.has(w)));
  const words = raw.split(/\s+/), kept = words.filter(w => !pw.has(norm(w)));
  if (kept.length && kept.length < words.length) tries.push(kept.join(' '));
  const cut = raw.match(/^(.+?)\s+(?:from|in|on|off|of the film|of the show)\s+.+$/i); if (cut) tries.push(cut[1]);
  const as = raw.match(/^.+?\s+as\s+(.+)$/i); if (as) tries.push(as[1]);
  const lead = raw.replace(/^(?:a|an|the|my|some|play|playing)\s+/i, ''); if (lead !== raw) tries.push(lead);
  const mine = raw.replace(/\b(?:my|your|his|her|their)\b/gi, 'the'); if (mine !== raw) tries.push(mine);
  if (kept.length > 1) { const tidy = kept.filter(w => !/^(?:the|a|an|my)$/i.test(w)); if (tidy.length && tidy.length < kept.length) tries.push(tidy.join(' ')); }
  for (const t of tries) { if (norm(t).length < 3) continue; const r2 = matchCore(topicId, t); if (r2 && !r2.amb) return Object.assign({}, r2, { fix: true }); }
  return r;
}
function matchCore(topicId, input) {
  const T = TOPICS[topicId], k = norm(input);
  if (!T || !k) return null;
  if (T.map.has(k)) return { e: T.map.get(k), fix: false };
  if (k.length >= 4) for (const x of [k + 's', k + 'es', k.replace(/s$/, ''), k.replace(/es$/, ''), k.replace(/ies$/, 'y')]) if (x && x !== k && T.map.has(x)) return { e: T.map.get(x), fix: false };
  for (const v of sayings(input)) { const kv = norm(v); if (kv && kv !== k && T.map.has(kv)) return { e: T.map.get(kv), fix: false }; }
  if (k.length < 4) return null;
  const one = set => set.size === 1 ? { e: [...set][0], fix: true } : set.size ? { amb: true } : null;
  // A bare name or word shared by several answers is a lucky dip: it always resolves to the same
  // one for a given prompt, which may turn out common or very rare. The player still confirms it.
  const dip = set => { const arr = [...set].sort((a, b) => a.name < b.name ? -1 : 1); let hsum = 7; for (const ch of topicId + ':' + k) hsum = (hsum * 31 + ch.charCodeAt(0)) >>> 0; return { e: arr[hsum % arr.length], fix: true, dip: arr.length > 1 }; };
  if (GIVEN.has(k)) return T.words.has(k) ? dip(T.words.get(k)) : null;
  // spelt the way it sounds
  const lk = loose(k);
  if (T.lmap.has(lk)) return { e: T.lmap.get(lk), fix: true };
  // typos: same first letter, a small number of slips, and one clear closest answer
  const max = typoBudget(k.length);
  let best = max + 1, hits = new Set(), longer = new Set();
  for (const [key, e] of T.map) {
    if (key.length < 4 || (key[0] !== k[0] && loose(key)[0] !== lk[0])) continue;
    const d = Math.min(lev(k, key, max), lev(lk, loose(key), max));
    if (d < best) { best = d; hits = new Set([e]); longer = new Set(); } else if (d === best && d <= max) hits.add(e);
    if (d === best && d <= max && key.length > k.length) longer.add(e);
  }
  if (hits.size === 1) return { e: [...hits][0], fix: true };
  // on a tie, a dropped letter is the likelier slip than an extra one
  if (hits.size > 1 && longer.size === 1) return { e: [...longer][0], fix: true };
  // a distinctive word of the answer ("vader"): fine if only one answer has it
  // it has to be the word the answer is known by: its last word, not its first
  const byWord = T.words.get(k);
  if (byWord) { const last = new Set([...byWord].filter(e => e.toks.some(tk => tk[tk.length - 1] === k))); return last.size === 1 ? one(last) : dip(byWord); }
  // a clear start of the answer ("achilles" for Achilles tendon)
  if (k.length >= 5) {
    const pre = new Set();
    for (const [key, e] of T.map) if (key.length > k.length && k.length * 2 >= key.length && key.startsWith(k)) pre.add(e);
    if (pre.size) return one(pre);
  }
  // several words, each a near miss ("darth vadr", "grenadines saint vincent"): must cover most of the answer
  const typed = String(input).split(/[\s\-\/]+/).map(norm).filter(w => w && !FILLER.has(w));
  if (typed.length >= 2) {
    const found = new Set();
    for (const e of T.list) for (const tk of e.toks) {
      if (typed.length * 2 < tk.length) continue;
      if (typed.every(w => tk.some(a => a === w || (w.length >= 4 && a[0] === w[0] && lev(w, a, typoBudget(w.length)) <= typoBudget(w.length))))) { found.add(e); break; }
    }
    if (found.size) return one(found);
  }
  return hits.size > 1 ? { amb: true } : null;
}
window.__match = (t, x) => { const m = match(t, x); return !m ? null : m.amb ? 'ambiguous' : m.e.name + (m.dip ? ' (lucky dip)' : m.fix ? ' (confirm)' : ''); };
if (typeof document === 'undefined') { module.exports = { norm, match, TOPICS }; return; }

/* ---------- small helpers ---------- */
const $ = id => document.getElementById(id);
const app = $('app');
const clone = o => JSON.parse(JSON.stringify(o));
const fmt = n => Math.round(n).toLocaleString('en-US');
const ls = {
  get(k) { try { return localStorage.getItem('tr_' + k); } catch (e) { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem('tr_' + k) : localStorage.setItem('tr_' + k, v); } catch (e) { /* storage blocked */ } },
};
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const k in (props || {})) {
    const v = props[k];
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const c of kids.flat(3)) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(String(c))); }
  return e;
}
const withTimeout = (p, ms = 10000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]);
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- sound: synthesized in the browser, no audio files ---------- */
// Everything pitched is in C major pentatonic so cues never clash, and the reward grows with the tier:
// a dull knock for the obvious answer, a chord for a good one, a full cascade for the rarest.
const Sound = (() => {
  let amb = null, ac = null, out = null, wet = null, NB = null, muted = ls.get('mute') === '1', riserNodes = null, clock = null, resumeAt = null, pending = [];
  // Krillion's recovery rules: a context that has closed, whose clock has frozen, or that has not woken
  // within a second of being asked is thrown away and rebuilt on the next tap or key press.
  function reset() {
    const old = ac; ac = out = wet = NB = amb = null; riserNodes = null; clock = resumeAt = null;
    if (old) { try { old.onstatechange = null; const p = old.close(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* already gone */ } }
  }
  function flush() {
    const now = performance.now(), due = pending.filter(p => now - p.t <= 300); pending = [];
    for (const p of due) if (!muted && ac && ac.state === 'running' && CUES[p.name]) { try { CUES[p.name](p.arg); } catch (e) { /* audio is optional */ } }
  }
  function ctx(gesture) {
    const now = performance.now();
    if (ac) {
      const st = ac.state, stuck = st === 'running' && clock && ac.currentTime === clock.a && now - clock.w >= 1000, stalled = st !== 'running' && resumeAt !== null && now - resumeAt >= 1000;
      if (st === 'closed' || (gesture && (stuck || stalled))) reset();
    }
    if (!ac) {
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* only some browsers have it */ }
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      try {
        ac = new A();
        const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 5; comp.attack.value = 0.004; comp.release.value = 0.2;
        out = ac.createGain(); out.gain.value = muted ? 0 : 0.8; out.connect(comp); comp.connect(ac.destination);
        // a short generated room, so notes ring instead of stopping dead
        const len = Math.floor(ac.sampleRate * 1.9), ir = ac.createBuffer(2, len, ac.sampleRate);
        for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
        const conv = ac.createConvolver(); conv.buffer = ir; wet = ac.createGain(); wet.gain.value = 0.32; wet.connect(conv); conv.connect(out);
        // one shared stretch of noise, so a busy moment does not have to generate fresh noise for every sound
        NB = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate); const nd = NB.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
        ac.onstatechange = () => { clock = null; if (ac && ac.state === 'running') { resumeAt = null; flush(); } };
      } catch (e) { ac = null; return null; }
    }
    if (ac.state === 'running') { if (!clock || clock.a !== ac.currentTime) clock = { a: ac.currentTime, w: now }; resumeAt = null; }
    else if (ac.state !== 'closed') {
      if (resumeAt === null) resumeAt = now;
      try { const a = ac, p = a.resume(); if (p && p.then) p.then(() => { if (ac === a && a.state === 'running') { resumeAt = null; flush(); } }, () => {}); } catch (e) { /* stays silent until the next tap */ }
    }
    return ac;
  }
  const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  function route(node, pan, send) {
    let n = node; if (pan && ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = pan; n.connect(p); n = p; }
    n.connect(out); if (send && wet) { const s = ac.createGain(); s.gain.value = send; n.connect(s); s.connect(wet); }
  }
  function tone(o) {
    const t = ac.currentTime + (o.delay || 0), dur = o.dur || 0.2, a = o.a || 0.005, osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(o.f0, t); if (o.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t + dur); if (o.detune) osc.detune.value = o.detune;
    env(g, t, a, o.peak || 0.2, dur);
    let node = osc; if (o.lp) { const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(o.lp, t); if (o.lpTo) f.frequency.exponentialRampToValueAtTime(o.lpTo, t + dur); osc.connect(f); node = f; }
    node.connect(g); route(g, o.pan, o.send); osc.start(t); osc.stop(t + dur + a + 0.05);
  }
  function noise(o) {
    const t = ac.currentTime + (o.delay || 0), dur = o.dur || 0.3;
    const src = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain(); src.buffer = NB; src.loop = true;
    lp.type = o.bp ? 'bandpass' : 'lowpass'; if (o.bp) lp.Q.value = o.q || 1.2; lp.frequency.setValueAtTime(o.lp || 1200, t); if (o.to) lp.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    let node = lp; src.connect(lp); if (o.hp) { const hf = ac.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = o.hp; lp.connect(hf); node = hf; }
    if (o.swell) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + dur * 0.96); g.gain.linearRampToValueAtTime(0.0001, t + dur); } else env(g, t, o.a || 0.003, o.peak || 0.2, dur);
    node.connect(g); route(g, o.pan, o.send); src.start(t, Math.random() * 3.5); src.stop(t + dur + 0.1);
  }
  // a struck bell or mallet: a fundamental with a few quickly fading overtones
  function bell(f, o = {}) {
    const peak = o.peak || 0.16, dur = o.dur || 1.1;
    [[1, 1, 1], [2, 0.42, 0.6], [3.01, 0.2, 0.35], [4.2, 0.12, 0.22], [5.4, 0.06, 0.14]].forEach(([m, amp, len]) => { if (f * m < 9000) tone({ f0: f * m, dur: dur * len, a: 0.002, peak: peak * amp, delay: o.delay, pan: o.pan, send: o.send == null ? 0.5 : o.send }); });
  }
  // a warm chord: detuned saws under a closing filter
  function pad(freqs, o = {}) { freqs.forEach((f, i) => [-9, 8].forEach(dt => tone({ type: 'sawtooth', f0: f, detune: dt, dur: o.dur || 1.4, a: o.a || 0.08, peak: (o.peak || 0.05), lp: o.lp || 2400, lpTo: 500, delay: o.delay, pan: (i % 2 ? 0.35 : -0.35), send: 0.6 }))); }
  function stopRiser() { if (!riserNodes) return; const t = ac.currentTime; try { riserNodes.g.gain.cancelScheduledValues(t); riserNodes.g.gain.setTargetAtTime(0.0001, t, 0.02); riserNodes.osc.stop(t + 0.15); } catch (e) { /* already ended */ } riserNodes = null; }
  // anticipation: a tone that climbs for exactly as long as the fall lasts, higher and louder for rarer answers
  function riser(dur, tier) {
    stopRiser();
    const t = ac.currentTime, osc = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter(), trem = ac.createOscillator(), tg = ac.createGain();
    const f1 = [196, 262, 392, 523, 784][tier], peak = [0.03, 0.05, 0.07, 0.085, 0.1][tier];
    osc.type = 'triangle'; osc.frequency.setValueAtTime(98, t); osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, t); lp.frequency.exponentialRampToValueAtTime(1200 + tier * 900, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.97); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.03);
    trem.frequency.setValueAtTime(5, t); trem.frequency.linearRampToValueAtTime(9 + tier * 4, t + dur); tg.gain.value = peak * 0.45; trem.connect(tg); tg.connect(g.gain);
    osc.connect(lp); lp.connect(g); route(g, 0, 0.4); osc.start(t); trem.start(t); osc.stop(t + dur + 0.1); trem.stop(t + dur + 0.1);
    riserNodes = { osc, g };
    if (tier >= 2) noise({ dur, bp: true, lp: 300, to: 2600 + tier * 900, q: 1.6, peak: 0.03 + tier * 0.012, swell: true, send: 0.3 });
  }
  const C = { C3: 130.81, G3: 196, C4: 261.63, E4: 329.63, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98, C7: 2093 };
  const LINE = [C.G4, C.C5, C.E5, C.G5, C.C6];
  const CUES = {
    click() { tone({ type: 'triangle', f0: 620, dur: 0.05, peak: 0.06 }); },
    // a soft wooden tap per letter that climbs a little as the word grows, and a lower one for deleting
    type(n) { const f = 1250 + Math.min(n || 0, 18) * 22 + Math.random() * 90; tone({ f0: f, f1: f * 0.72, dur: 0.035, a: 0.002, peak: 0.05, lp: 3800 }); noise({ dur: 0.016, lp: 6000, hp: 2200, peak: 0.022 }); },
    erase() { tone({ type: 'triangle', f0: 760, f1: 560, dur: 0.04, a: 0.002, peak: 0.04, lp: 2600 }); },
    pick() { bell(C.C5, { peak: 0.1, dur: 0.6 }); bell(C.G5, { peak: 0.09, dur: 0.7, delay: 0.07 }); },
    submit() { tone({ type: 'triangle', f0: 740, f1: 1110, dur: 0.09, peak: 0.13 }); noise({ dur: 0.05, lp: 5000, hp: 2000, peak: 0.05 }); bell(C.E6, { peak: 0.05, dur: 0.4, delay: 0.06 }); },
    reject() { tone({ f0: 170, f1: 70, dur: 0.32, peak: 0.2, lp: 600 }); noise({ dur: 0.18, lp: 380, peak: 0.14 }); },
    fix() { bell(C.A5, { peak: 0.08, dur: 0.4 }); bell(C.E5, { peak: 0.08, dur: 0.5, delay: 0.09 }); },
    begin() { noise({ dur: 1, lp: 2400, to: 300, peak: 0.1, send: 0.4 }); tone({ f0: 196, f1: 98, dur: 1, peak: 0.2 }); bell(C.D5, { peak: 0.1, dur: 0.9 }); bell(C.A5, { peak: 0.1, dur: 1.1, delay: 0.18 }); },
    count(go) { if (go) { bell(C.C6, { peak: 0.14, dur: 0.9 }); tone({ f0: 130, f1: 65, dur: 0.3, peak: 0.16 }); } else tone({ type: 'triangle', f0: 440, dur: 0.12, peak: 0.12, send: 0.3 }); },
    sink(o) { noise({ dur: 0.7, lp: 2600, to: 300, hp: 250, peak: 0.12, send: 0.3 }); tone({ f0: 330, f1: 90, dur: 0.6, peak: 0.08 }); riser(o.dur, o.tier); },
    // each line rings one step higher, a little louder and brighter, swinging left and right
    // breaking a tier line: a short clean blip that climbs with each line, so a run of them reads as a rising beat
    line() { tone({ type: 'triangle', f0: 840, f1: 1680, dur: 0.07, a: 0.002, peak: 0.13, lp: 2600 }); },
    // the instant of contact, before the reward
    impact(tier) { stopRiser(); noise({ dur: 0.035, lp: 7000, hp: 1500, peak: 0.16 + tier * 0.03 }); tone({ f0: 150 - tier * 14, f1: 44, dur: 0.28 + tier * 0.14, peak: 0.26 + tier * 0.03, lp: 700 }); },
    land(tier) {
      if (tier === 0) { tone({ type: 'triangle', f0: C.G3, dur: 0.28, peak: 0.13, lp: 900 }); return; }
      if (tier === 1) { bell(C.C5, { peak: 0.15 }); bell(C.E5, { peak: 0.13, delay: 0.06 }); return; }
      if (tier === 2) { [C.C5, C.E5, C.G5].forEach((f, i) => bell(f, { peak: 0.15, dur: 1.3, delay: i * 0.055, pan: (i - 1) * 0.3 })); bell(C.C7, { peak: 0.04, dur: 0.8, delay: 0.24 }); pad([C.C4, C.G4], { dur: 0.9, peak: 0.03 }); noise({ dur: 0.5, lp: 6000, hp: 3000, peak: 0.03, delay: 0.05, send: 0.5 }); return; }
      if (tier === 3) {
        tone({ f0: 70, f1: 38, dur: 0.9, peak: 0.3 });
        [C.C5, C.E5, C.G5, C.B5, C.D6].forEach((f, i) => bell(f, { peak: 0.15, dur: 1.6, delay: i * 0.06, pan: (i - 2) * 0.22 }));
        pad([C.C4, C.E4, C.G4, C.B5 / 2], { dur: 1.6, peak: 0.04 });
        bell(C.G6, { peak: 0.06, dur: 1, delay: 0.42 }); bell(C.C7, { peak: 0.05, dur: 1, delay: 0.52 });
        noise({ dur: 0.9, lp: 7000, hp: 3500, peak: 0.035, delay: 0.05, send: 0.6 }); return;
      }
      // the rarest answer: a low boom, a full chord, a run up two octaves, and a scatter of high bells
      tone({ f0: 62, f1: 34, dur: 1.5, peak: 0.34 }); noise({ dur: 0.5, lp: 500, peak: 0.16 });
      pad([C.C3, C.G3, C.C4, C.E4, C.G4, C.D5], { dur: 2.6, peak: 0.04, lp: 3000 });
      [C.C5, C.E5, C.G5, C.C6, C.E6, C.G6, C.C7].forEach((f, i) => bell(f, { peak: 0.15, dur: 1.9, delay: 0.05 + i * 0.085, pan: Math.sin(i * 1.3) * 0.5 }));
      [C.G6, C.E6, C.D6, C.C6, C.A5, C.G5].forEach((f, i) => bell(f, { peak: 0.07, dur: 1.4, delay: 0.85 + i * 0.07, pan: -Math.sin(i * 1.3) * 0.5 }));
      for (let i = 0; i < 10; i++) bell([C.C7, C.G6, C.E6, C.D6][i % 4] * (i % 3 ? 1 : 2), { peak: 0.03, dur: 0.7, delay: 1.3 + Math.random() * 1.4, pan: Math.random() * 1.6 - 0.8, send: 0.8 });
      noise({ dur: 2.2, lp: 9000, hp: 4000, peak: 0.035, delay: 0.1, send: 0.7 });
    },
    // the score counting up: a run of soft clicks that climbs with it
    slam(i) { const f = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1318.51][i] || 880; tone({ f0: 120 - i * 6, f1: 50, dur: 0.18, peak: 0.16, lp: 600 }); noise({ dur: 0.05, lp: 4000, hp: 900, peak: 0.07 }); bell(f, { peak: 0.09 + i * 0.01, dur: 0.9, send: 0.6 }); if (i === 6) { bell(f * 1.5, { peak: 0.08, dur: 1.6, delay: 0.08, send: 0.8 }); bell(f * 2, { peak: 0.06, dur: 1.8, delay: 0.16, send: 0.9 }); } },
    tally(u) { tone({ type: 'triangle', f0: 700 + u * 900, dur: 0.035, peak: 0.05 }); },
    ding() { bell(C.E6, { peak: 0.1, dur: 0.8 }); },
    best() { [C.G5, C.C6, C.E6].forEach((f, i) => bell(f, { peak: 0.1, dur: 1, delay: i * 0.09 })); },
    zone() { bell(C.C3, { peak: 0.2, dur: 3, send: 0.9 }); bell(C.G3, { peak: 0.08, dur: 2.4, delay: 0.05, send: 0.9 }); noise({ dur: 1.6, bp: true, lp: 500, to: 1400, q: 2, peak: 0.03, send: 0.8 }); },
    miss() { stopRiser(); tone({ f0: 233, f1: 55, dur: 0.7, peak: 0.22 }); noise({ dur: 0.45, lp: 420, peak: 0.12, delay: 0.04 }); },
    tick() { tone({ f0: 932, dur: 0.06, peak: 0.11 }); },
    descend() { noise({ dur: 0.7, lp: 1600, to: 260, peak: 0.08, send: 0.3 }); tone({ f0: 130, f1: 60, dur: 0.7, peak: 0.16 }); },
    ribbit() { tone({ type: 'sawtooth', f0: 190, f1: 140, dur: 0.09, peak: 0.14, lp: 900 }); tone({ type: 'sawtooth', f0: 210, f1: 150, dur: 0.11, peak: 0.14, lp: 900, delay: 0.13 }); },
    surface() { noise({ dur: 1.8, lp: 300, to: 3200, peak: 0.13, send: 0.5 }); tone({ f0: 80, f1: 620, dur: 1.7, peak: 0.07, send: 0.4 }); },
    fanfare() { [C.C5, C.E5, C.G5, C.C6].forEach((f, i) => bell(f, { peak: 0.14, dur: 1.4, delay: i * 0.12 })); pad([C.C4, C.E4, C.G4], { dur: 1.8, peak: 0.035 }); tone({ f0: 98, dur: 1, peak: 0.16 }); },
  };
  // ambience: a quiet bed of filtered noise shaped to each place, and now and then the sound of something living there
  const AMB = { canopy: [1400, 0.014, 'lowpass'], forest: [700, 0.016, 'lowpass'], floor: [420, 0.02, 'lowpass'], roots: [260, 0.026, 'lowpass'], river: [1000, 0.034, 'bandpass'], grotto: [380, 0.015, 'lowpass'], crystal: [2400, 0.008, 'bandpass'], temple: [300, 0.02, 'lowpass'], fungal: [520, 0.015, 'lowpass'], magma: [140, 0.05, 'lowpass'], obscura: [190, 0.032, 'lowpass'] };
  const pan = () => Math.random() * 1.4 - 0.7;
  const drip = () => { const f = 1000 + Math.random() * 700; tone({ f0: f, f1: f * 2.1, dur: 0.07, a: 0.002, peak: 0.035, pan: pan(), send: 0.9 }); };
  const CRITTERS = {
    canopy() { const f = 2400 + Math.random() * 1400, p = pan(); tone({ f0: f, f1: f * 1.25, dur: 0.07, peak: 0.022, pan: p, send: 0.4 }); tone({ f0: f * 1.1, f1: f * 1.4, dur: 0.06, peak: 0.018, pan: p, delay: 0.11, send: 0.4 }); },
    forest() { if (Math.random() < 0.5) CRITTERS.canopy(); else { const p = pan(); for (let i = 0; i < 3; i++) tone({ type: 'triangle', f0: 4300, dur: 0.025, peak: 0.01, pan: p, delay: i * 0.07 }); } },
    floor() { const p = pan(); for (let i = 0; i < 4; i++) tone({ type: 'triangle', f0: 4600, dur: 0.02, peak: 0.01, pan: p, delay: i * 0.06 }); },
    roots: drip, river: drip, grotto() { drip(); if (Math.random() < 0.4) bell(2093 + Math.random() * 800, { peak: 0.012, dur: 1.4, pan: pan(), send: 0.95 }); },
    crystal() { bell([1318.5, 1568, 1975.5, 2349.3][Math.random() * 4 | 0], { peak: 0.025, dur: 1.8, pan: pan(), send: 0.95 }); },
    temple() { bell(98 + Math.random() * 30, { peak: 0.05, dur: 3, pan: pan(), send: 0.95 }); },
    fungal() { tone({ f0: 280 + Math.random() * 120, f1: 760, dur: 0.06, peak: 0.022, pan: pan(), send: 0.6 }); },
    magma() { const p = pan(); for (let i = 0; i < 3 + (Math.random() * 3 | 0); i++) noise({ dur: 0.03, bp: true, lp: 1600 + Math.random() * 1600, q: 2, peak: 0.04, pan: p, delay: i * 0.05 + Math.random() * 0.04 }); },
    obscura() { tone({ f0: 58, f1: 40, dur: 0.28, peak: 0.1 }); tone({ f0: 52, f1: 38, dur: 0.3, peak: 0.08, delay: 0.32 }); },
  };
  function ambient(kind) {
    if (!ac || ac.state !== 'running' || !NB || muted || !kind) { if (amb && ac) { amb.g.gain.setTargetAtTime(0, ac.currentTime, 0.4); amb.kind = null; } return; }
    if (!amb) { const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); src.buffer = NB; src.loop = true; g.gain.value = 0; src.connect(f); f.connect(g); g.connect(out); src.start(); amb = { src, f, g, kind: null, next: ac.currentTime + 2 }; }
    const t = ac.currentTime;
    if (amb.kind !== kind) { const p = AMB[kind] || AMB.forest; amb.kind = kind; if (amb.f.type !== p[2]) amb.f.type = p[2]; amb.f.Q.value = p[2] === 'bandpass' ? 0.6 : 0.7; amb.f.frequency.setTargetAtTime(p[0], t, 1.2); amb.g.gain.setTargetAtTime(p[1], t, 1.5); }
    if (t > amb.next) { amb.next = t + (kind === 'obscura' ? 2.6 : 3 + Math.random() * 6); try { (CRITTERS[kind] || CRITTERS.forest)(); } catch (e) { /* ambience is optional */ } }
  }
  return {
    ambient,
    unlock: () => ctx(true),
    // a sound asked for while the audio is still waking is held for a moment and played once it is up, not dropped
    play(name, arg) {
      if (muted || document.hidden || !CUES[name] || !ctx()) return;
      if (ac.state !== 'running') { if (pending.length < 8) pending.push({ name, arg, t: performance.now() }); return; }
      try { CUES[name](arg); } catch (e) { /* audio is optional */ }
    },
    sleep() { pending = []; if (ac && ac.state === 'running') { try { const p = ac.suspend(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* fine */ } } },
    muted: () => muted,
    toggle() { muted = !muted; ls.set('mute', muted ? '1' : null); if (out) out.gain.value = muted ? 0 : 0.8; if (!muted) { reset(); ctx(true); this.play('pick'); } return muted; },
  };
})();
const snd = (n, a) => Sound.play(n, a);
window.__amb = kind => Sound.ambient(SET.amb && !document.hidden ? kind : null);
// Settings, after Krillion's: low-power graphics, colour-blind tier colours, whether corrections
// are previewed, and whether a rejected answer is cleared from the box.
// Companions, unlocked by keeping a daily streak going (Krillion does the same with its mascots).
const PALS = [
  { id: 'frog', name: 'Frog', art: 'krill', color: '#ff7a45', need: 0 },
  { id: 'macaw', name: 'Macaw', art: 'macaw', color: '#ff5d5d', need: 3 },
  { id: 'toucan', name: 'Toucan', art: 'toucan', color: '#ffc04d', need: 5 },
  { id: 'sloth', name: 'Sloth', art: 'sloth', color: '#c9a27a', need: 14 },
  { id: 'jaguar', name: 'Jaguar', art: 'jaguar', color: '#f0b14a', need: 30 },
  { id: 'moth', name: 'Moth', art: 'moth', color: '#e8ff7a', need: 45 },
];
const streakNow = () => { const last = ls.get('lastDay'), d = new Date(), y = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), yk = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0'); return last === dayKey() || last === yk ? Number(ls.get('streak') || 0) : 0; };
const bestStreak = () => Math.max(Number(ls.get('beststreak') || 0), streakNow());
function setPal(id) { const p = PALS.find(x => x.id === id && bestStreak() >= x.need) || PALS[0]; ls.set('pal', p.id === 'frog' ? null : p.id); window.__pal = p; }
const SET = { amb: ls.get('s_amb') !== '0', low: ls.get('s_low') === '1', cb: ls.get('s_cb') === '1', corr: ls.get('s_corr') !== '0', clear: ls.get('s_clear') === '1' };
const TIER_COLOURS = { normal: ['#d7e1f2', '#7deaff', '#ff4d4d', '#bfa7ff', '#ffe08a'], cb: ['#ffffff', '#56b4e9', '#e69f00', '#cc79a7', '#f0e442'] };
function applySettings() {
  document.body.classList.toggle('low', SET.low); document.body.classList.toggle('cb', SET.cb);
  TIERS.forEach((t, i) => { t.color = TIER_COLOURS[SET.cb ? 'cb' : 'normal'][i]; });
  window.__low = SET.low; if (!window.__pal) setPal(ls.get('pal') || 'frog'); if (window.__rebuild) window.__rebuild();
}
function openSettings() {
  if ($('settings')) return;
  const row = (key, title, text, get, set) => {
    const b = h('button', { class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(get()), 'aria-label': title }, h('i', { text: get() ? 'On' : 'Off' }));
    b.addEventListener('click', () => { set(!get()); b.setAttribute('aria-checked', String(get())); b.firstChild.textContent = get() ? 'On' : 'Off'; });
    return h('div', { class: 'setrow' }, h('div', null, h('strong', { text: title }), h('p', { class: 'note', text: text })), b);
  };
  const flag = (key, lsKey, onVal) => [() => SET[key], v => { SET[key] = v; ls.set(lsKey, v === onVal ? null : (v ? '1' : '0')); applySettings(); }];
  const close = () => { const m = $('settings'); if (m) m.remove(); };
  const modal = h('div', { id: 'settings', class: 'modal', role: 'dialog', 'aria-label': 'Settings', onclick: e => { if (e.target.id === 'settings') close(); } },
    h('div', { class: 'panel' },
      h('div', { class: 'ph' }, h('span', { text: 'Settings' }), h('button', { class: 'small', type: 'button', onclick: close, text: 'Close' })),
      row('sound', 'Sound', 'Chimes, thumps and the climb as an answer falls.', () => !Sound.muted(), () => { Sound.toggle(); const mb = $('mute'); if (mb) { mb.textContent = Sound.muted() ? 'Sound off' : 'Sound on'; mb.setAttribute('aria-pressed', String(Sound.muted())); } }),
      row('amb', 'Ambience', 'The sound of each place as you fall: birds, dripping caves, humming crystal, rumbling rock.', ...flag('amb', 's_amb', true)),
      row('low', 'Low-power mode', 'Lighter graphics and fewer background animations.', ...flag('low', 's_low', false)),
      row('cb', 'Colourblind mode', 'Brighter text and more separated tier colours.', ...flag('cb', 's_cb', false)),
      row('corr', 'Answer corrections', 'Preview corrected answers before scoring. Off accepts them immediately.', ...flag('corr', 's_corr', true)),
      row('clear', 'Clear rejected entries', 'Empty the answer box after a failed attempt.', ...flag('clear', 's_clear', false)),
      h('div', { class: 'ph' }, h('span', { text: 'Companion' }), h('em', { text: 'best streak ' + bestStreak() })),
      h('div', { class: 'pals' }, PALS.map(p => { const open = bestStreak() >= p.need, b = h('button', { class: 'pal' + (window.__pal.id === p.id ? ' on' : ''), type: 'button', disabled: !open, 'aria-label': p.name }, icon(p.art, open ? p.color : '#3a4a3e', 32), h('span', { text: p.name }), h('small', { text: open ? (p.need ? p.need + '-day' : 'starter') : p.need + '-day streak' })); b.addEventListener('click', () => { setPal(p.id); b.parentElement.querySelectorAll('.pal').forEach(x => x.classList.toggle('on', x === b)); }); return b; }))));
  document.body.append(modal);
}
// The prompts are the game: nothing on the page can be selected, copied or dragged out. Typing still works.
for (const ev of ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart']) addEventListener(ev, e => { const t = e.target; if (!(t && t.closest && t.closest('input'))) e.preventDefault(); }, true);
addEventListener('pointerdown', e => { Sound.unlock(); if (e.target.closest && e.target.closest('button:not(#mute)')) snd('click'); }, true);
addEventListener('keydown', () => Sound.unlock(), true);
// Enter moves you on: from a result to the next prompt, and (for whoever can) from a round's results to the next round.
addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.repeat || e.isComposing || document.querySelector('.modal')) return;
  const t = e.target, tag = t && t.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return;
  const nx = document.getElementById('next'), go = document.querySelector('.landed .go') || (nx && !nx.hidden ? nx : null);
  if (go && !go.disabled) { e.preventDefault(); go.click(); }
});
// Phones only let sound start from a finished tap, not from the press, so wake the audio on those too
// and nudge it with a silent blip (Safari needs one before it will play anything).
['pointerup', 'touchend', 'click'].forEach(ev => addEventListener(ev, () => {
  const ac = Sound.unlock(); if (!ac || Sound._kicked) return;
  try { const b = ac.createBufferSource(); b.buffer = ac.createBuffer(1, 1, 22050); b.connect(ac.destination); b.start(0); if (ac.state === 'running') Sound._kicked = true; } catch (e) { /* audio is optional */ }
}, true));
addEventListener('visibilitychange', () => { if (document.hidden) Sound.sleep(); else Sound.unlock(); });
{
  const b = h('button', { id: 'mute', class: 'small', type: 'button', 'aria-pressed': String(Sound.muted()), text: Sound.muted() ? 'Sound off' : 'Sound on' });
  b.addEventListener('click', () => { const m = Sound.toggle(); b.textContent = m ? 'Sound off' : 'Sound on'; b.setAttribute('aria-pressed', String(m)); });
  document.body.append(b);
  document.body.append(h('button', { id: 'burger', class: 'small', type: 'button', 'aria-label': 'Open menu', onclick: () => openMenu() }, h('i'), h('i'), h('i')));
  document.body.append(h('button', { id: 'gear', class: 'small', type: 'button', onclick: () => openSettings(), text: 'Settings' }));
  applySettings();
}

/* ---------- state ---------- */
const S = {
  mode: null,            // null (home) | 'solo' | 'online'
  db: null, dbState: 'wait', canWrite: null,
  me: { id: ls.get('pid'), name: ls.get('name') || '' },
  code: null, room: null, players: {}, mine: null,
  roomRef: null, meRef: null, unsub: [],
  screen: '', busy: false, msg: '', fb: null, done: '', jitter: Math.random() * 1500,
};
if (!S.me.id) { S.me.id = 'p_' + Math.random().toString(36).slice(2, 10); ls.set('pid', S.me.id); }

const ordered = () => Object.entries(S.players).map(([id, p]) => ({ id, ...p }))
  .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0) || (a.id < b.id ? -1 : 1));
const colorOf = id => COLORS[Math.max(0, ordered().findIndex(p => p.id === id)) % COLORS.length];
const roundOf = (p, r) => (p && p.g === S.room.g && p.rounds && p.rounds[r]) || { a: [], pts: 0 };
const total = p => (p && p.g === S.room.g && p.rounds) ? Object.values(p.rounds).reduce((s, r) => s + (r.pts || 0), 0) : 0;
const depthOf = p => Math.min(MAX_DEPTH, total(p) * M_PER_PT);
const zoneOf = d => { let z = 'Canopy'; for (const [m, name] of ZONES) if (m > 0 && d >= m) z = name; return z; };
const isHost = () => S.mode === 'solo' || (S.room && S.room.host === S.me.id);
const nameOf = p => (p && p.name) || 'Diver';

function say(msg) {
  S.msg = msg; const n = $('msg'); if (n) { n.textContent = msg; n.hidden = !msg; }
  // the reconnecting note shows on every screen, not just the lobby
  let c = $('conn'); const on = msg === 'Reconnecting…' && S.mode === 'online';
  if (on && !c) { c = h('div', { id: 'conn', role: 'status' }, h('i'), h('span', { text: 'Reconnecting…' })); document.body.append(c); } else if (!on && c) c.remove();
}

/* ---------- writes ---------- */
let roomQ = Promise.resolve();
function patchRoom(p) {
  Object.assign(S.room, p);
  if (S.mode === 'online') {
    const ref = S.roomRef;
    roomQ = roomQ.then(() => ref.update(p)).catch(() => say('That did not save. Check your connection.'));
  }
  render();
}
let saving = false, dirty = false;
async function saveMe() {
  S.players[S.me.id] = S.mine;
  if (S.mode !== 'online') return;
  S.mine.seen = Date.now(); // anything you do counts as being here
  dirty = true;
  if (saving) return;
  saving = true;
  let fails = 0;
  while (dirty && S.meRef) {
    dirty = false;
    try { await S.meRef.set(clone(S.mine)); if (fails) { fails = 0; if (S.msg === 'Reconnecting…') say(''); } }
    catch (e) {
      // a dropped connection is not the end: keep the answers and try again, a little longer each time
      dirty = true; fails++;
      if (fails >= 2) say('Reconnecting…');
      await new Promise(r => setTimeout(r, Math.min(15000, 1000 * 2 ** fails)));
    }
  }
  saving = false;
}

/* ---------- joining and leaving ---------- */
function readName(solo) {
  const el = $('nick');
  const typed = (el ? el.value : S.me.name).trim().slice(0, 16), v = typed || (solo ? S.me.name || 'Diver' : '');
  if (!v) { say('Type a name first.'); if (el) el.focus(); return null; }
  S.me.name = v; if (typed) ls.set('name', v);
  return v;
}
function freshMine(g, joinedAt) { return { name: S.me.name, joinedAt: joinedAt || Date.now(), g, rounds: {} }; }

function startSolo() {
  if (!readName(true)) return;
  say('');
  S.mode = 'solo'; S.code = 'SOLO';
  S.room = { host: S.me.id, phase: 'lobby', g: 1, round: 0, rounds: 3, dives: 5, secs: 25, used: [] };
  S.mine = freshMine(1);
  S.players = { [S.me.id]: S.mine };
  startRound(1);
}

async function createRoom() {
  if (S.busy || !S.db || !readName()) return;
  S.busy = true; say('Opening a room…');
  try {
    let code = '', ref = null;
    for (let i = 0; i < 6; i++) {
      code = Array.from({ length: 4 }, () => 'BCDFGHJKLMNPQRSTVWXZ'[Math.floor(Math.random() * 20)]).join('');
      ref = S.db.doc('rooms/' + code);
      const snap = await withTimeout(ref.get());
      if (!snap.exists) break;
      ref = null;
    }
    if (!ref) throw { code: 'busy' };
    await withTimeout(ref.set({ host: S.me.id, phase: 'lobby', g: 1, round: 0, rounds: 3, dives: 5, secs: 25, used: [], createdAt: Date.now() }));
    S.busy = false;
    await joinRoom(code, false);
  } catch (e) {
    say(e && e.code === 'invalid_argument'
      ? 'You can open this page but cannot write to it. Ask the owner for edit access, or practise solo.'
      : 'Could not open a room. Check your connection and try again.');
  } finally { S.busy = false; }
}

async function joinRoom(code, silent) {
  if (S.busy || !S.db) return;
  if (!silent && !readName()) return;
  code = String(code || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (code.length !== 4) { if (!silent) say('Room codes are four letters.'); return; }
  S.busy = true; if (!silent) say('Joining…');
  try {
    const ref = S.db.doc('rooms/' + code);
    const snap = await withTimeout(ref.get());
    if (!snap.exists) { ls.set('code', null); if (!silent) say('No room has the code ' + code + '.'); return; }
    const room = clone(snap.data());
    // coming back on page load: only if that game is still going, not to a finished or long-abandoned room
    if (silent && (room.phase === 'final' || (room.createdAt && Date.now() - room.createdAt > 3 * 3600e3))) { ls.set('code', null); return; }
    const meRef = ref.collection('players').doc(S.me.id);
    const old = await withTimeout(meRef.get());
    const prev = old.exists ? clone(old.data()) : null;
    const mine = prev && prev.g === room.g ? Object.assign(prev, { name: S.me.name, left: false }) : freshMine(room.g, prev && prev.joinedAt);
    await withTimeout(meRef.set(clone(mine)));
    if (S.mode) return; // started something else while this was loading
    S.mode = 'online'; S.code = code; S.room = room; S.mine = mine;
    S.players = { [S.me.id]: mine }; S.roomRef = ref; S.meRef = meRef; S._joinedAt = Date.now(); S._plOk = false;
    ls.set('code', code); say(''); heartbeat();
    // live links to the room; if either drops (shaky wifi, a phone asleep) both are re-made, sooner then less often
    let live = [], tries = 0, retryT = 0;
    const stop = () => { live.forEach(u => { try { u(); } catch (e) { /* already closed */ } }); live = []; clearTimeout(retryT); };
    const lost = () => {
      if (S.roomRef !== ref) return;
      stop(); tries++; say('Reconnecting…');
      retryT = setTimeout(listen, Math.min(15000, 800 * 2 ** Math.min(tries, 5)));
    };
    const ok = () => { if (tries) { tries = 0; if (S.msg === 'Reconnecting…') say(''); heartbeat(); } };
    function listen() {
      if (S.roomRef !== ref) return;
      stop();
      live.push(ref.onSnapshot(s => {
        if (S.roomRef !== ref) return;
        if (!s.exists) return;
        ok();
        S.room = clone(s.data());
        if (S.room.g !== S.mine.g) { S.mine = freshMine(S.room.g, S.mine.joinedAt); saveMe(); }
        render();
      }, lost));
      live.push(ref.collection('players').onSnapshot(q => {
        if (S.roomRef !== ref) return;
        ok();
        // a list served from the offline cache can be missing people: add to what we know, never drop anyone on it
        const m = q.fromCache ? Object.assign({}, S.players) : {};
        if (!q.fromCache) S._plOk = true;
        q.docs.forEach(d => { m[d.id] = d.data(); });
        m[S.me.id] = S.mine;
        S.players = m;
        render();
      }, lost));
    }
    S.relisten = () => { if (S.roomRef === ref) { tries = 0; listen(); } };
    S.unsub.push(stop);
    listen();
    render();
  } catch (e) {
    if (!silent) say(e && e.code === 'invalid_argument'
      ? 'You can open this page but cannot play on it. Ask the owner for edit access, or practise solo.'
      : 'Could not reach that room. Check your connection and try again.');
  } finally { S.busy = false; }
}

function leave() {
  window.__gold = false;
  document.body.classList.remove('trek', 'quiet', 'run', 'spot');
  window.__lines = null; window.__sink = null; document.body.classList.remove('sinking');
  S.unsub.forEach(u => { try { u(); } catch (e) { /* already closed */ } });
  S.unsub = [];
  if (S.mode === 'online' && S.room.phase === 'lobby' && S.meRef) S.meRef.delete().catch(() => {});
  else if (S.mode === 'online' && S.meRef && S.mine) { S.mine.left = true; S.meRef.set(clone(S.mine)).catch(() => {}); } // gone mid-game: do not hold the others up
  S.relisten = null; S.done = null; S.mode = null; S.room = null; S.roomRef = null; S.meRef = null; S.code = null; S.players = {}; S.fb = null; S.dive = null; S.shown = null; S.allAt = 0;
  S._lead = undefined; S._seenKey = null; S._ranks = null; S._fan = null; const rv = $('rival'); if (rv) rv.remove();
  ls.set('code', null); S.msg = '';
  render();
}

/* ---------- solo runs: the daily descent and themed packs ---------- */
// Seven prompts, one answer each, 25 seconds a prompt, 700 points at most. The daily set is the
// same for everyone on a given date and can be played once; packs draw from one subject.
const PACKS = {
  sports: { label: 'Sports', ids: ['x_sportball', 'nicknames', 'worldcupwinners'] },
  geo: { label: 'Geography', ids: ['x_and', 'x_land', 'x_short', 'x_island', 'x_newstate', 'x_stateA', 'x_san', 'x_newcity', 'x_cityville', 'x_stationanimal', 'equator', 'monarchies', 'notlargest', 'redwhiteblue', 'spanishcountries'] },
};
const packPool = kind => TOPIC_IDS.filter(id => PACKS[kind].ids.includes(id) || (RAW[id] && RAW[id].pack === kind));
function dayKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
const dayNo = () => { const d = new Date(); return Math.max(1, Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 10, 9)) / 864e5) + 1); };
function seeded(seed) { let v = 2166136261; for (const ch of seed) v = Math.imul(v ^ ch.charCodeAt(0), 16777619) >>> 0; return () => { v ^= v << 13; v >>>= 0; v ^= v >>> 17; v ^= v << 5; v >>>= 0; return v / 4294967296; }; }
function pickSeven(pool, rnd) {
  const ids = pool.slice().sort(); for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  const out = []; for (const id of ids) { if (usable(id)) out.push(id); if (out.length === 7) break; } return out;
}
const dayNoOf = key => { const p = key.split('-').map(Number); return Math.max(1, Math.floor((Date.UTC(p[0], p[1] - 1, p[2]) - Date.UTC(2026, 10, 9)) / 864e5) + 1); };
// No repeats: the pool is shuffled once per cycle and dealt out seven a day until it runs out, then reshuffled.
function dealSeven(pool, tag, n) { const ids = pool.filter(usable).sort(), per = Math.floor(ids.length / 7); if (!per) return []; const cyc = Math.floor((n - 1) / per), rnd = seeded('obscura:' + tag + ':' + cyc); for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; } const k = ((n - 1) % per) * 7; return ids.slice(k, k + 7); }
window.__dbg = { sprite, S: () => S, render: () => render(), topic: id => TOPICS[id], champ: name => moment(Math.round(innerHeight * 0.3), 'CHAMPION', name + ' · 1,240 pts', icon('krill', '#ffc23a', 128), 'champ'), lead: (name, kind) => leadSlam({ id: 'x', name }, kind), emote: e => showEmote(S.me.id, e), count: t => { const m = S.mode; S.mode = 'online'; bigCount(t); S.mode = m; }, rivalNews: name => { rivalToast([icon('moth', '#ffe08a', 28), h('span', { text: name + ' found an Obscura' }), h('b', { text: '+100' })], '#ffe08a', true); rivalGold(); } };
window.__deal = (tag, n) => dealSeven(tag === 'daily' ? TOPIC_IDS : packPool(tag), tag, n);
const dailySaved = () => { try { return JSON.parse(ls.get('daily_' + dayKey()) || 'null'); } catch (e) { return null; } };
const dailyKey = kind => 'daily_' + kind + '_' + dayKey();
const dailyDone = kind => { try { return JSON.parse(ls.get(dailyKey(kind)) || 'null'); } catch (e) { return null; } };
function startRun(kind, day, daily) {
  const el = $('nick'), nm = el ? el.value.trim().slice(0, 16) : ''; if (nm) { S.me.name = nm; ls.set('name', nm); } if (!S.me.name) S.me.name = 'Explorer';
  let saved = null;
  if (kind === 'daily') { try { saved = JSON.parse(ls.get('daily_' + (day || dayKey())) || 'null'); } catch (e) { saved = null; } }
  if (daily && kind !== 'daily') saved = dailyDone(kind);
  const ids = saved ? saved.ids : kind === 'daily' ? dealSeven(TOPIC_IDS, 'daily', dayNoOf(day || dayKey())) : (daily ? dealSeven(packPool(kind), kind, dayNo()) : pickSeven(packPool(kind), Math.random));
  if (ids.length < 7) return say('That pack is still being stocked. Try the daily descent or geography for now.');
  say('');
  S.mode = 'solo'; S.code = kind === 'daily' ? 'DAILY' : kind.toUpperCase();
  S.room = { host: S.me.id, phase: saved ? 'final' : 'lobby', g: 1, round: saved ? 7 : 0, rounds: 7, dives: 1, secs: 25, used: [], fixed: ids, kind, day: day || null, daily: !!daily && kind !== 'daily' };
  S.mine = freshMine(1); if (saved) S.mine.rounds = saved.rounds;
  S.players = { [S.me.id]: S.mine };
  if (saved) { window.__depth = total(S.mine) * M_PER_PT; render(); return; }
  let prog = null; try { prog = JSON.parse(ls.get(progKey(S.room)) || 'null'); } catch (e) { prog = null; }
  if (prog && JSON.stringify(prog.ids) === JSON.stringify(ids) && prog.rounds) {
    S.mine.rounds = prog.rounds;
    for (let n = 1; n <= 7; n++) { const rd = S.mine.rounds[n]; if (rd && rd.seen && !rd.a.length) rd.a.push(['', -1]); }
    let next = 1; while (next <= 7 && S.mine.rounds[next] && S.mine.rounds[next].a.length) next++;
    window.__depth = total(S.mine) * M_PER_PT; saveProg();
    if (next > 7) { S.room.round = 7; S.room.phase = 'play'; finishRun(); return; }
    S.room.round = next - 1; startRound(next); return;
  }
  startRound(1);
}
// With the shared store available, today's descents are compared: where you rank, and how many chose each answer.
async function dailyStats() {
  const r = S.room; if (!S.db || !r || r.kind !== 'daily' || r.day) return;
  const mineA = r.fixed.map((id, i) => { const a = roundOf(S.mine, i + 1).a[0]; return a && a[1] >= 0 ? a[0] : ''; }), score = total(S.mine);
  try {
    const col = S.db.collection('daily/' + dayKey() + '/scores');
    if (S.canWrite !== false) await withTimeout(col.doc(S.me.id).set({ score, a: mineA }));
    const q = await withTimeout(col.limit(1000).get()), docs = q.docs.map(d => d.data()).filter(Boolean), n = docs.length;
    if (n < 2) return;
    const el = $('pct'); if (el) { el.textContent = 'deeper than ' + Math.round(docs.filter(d => (d.score || 0) < score).length / (n - 1) * 100) + '% of ' + fmt(n) + ' explorers today'; el.hidden = false; }
    mineA.forEach((nm, i) => { const e2 = $('oth-' + i); if (!e2 || !nm) return; const c = docs.filter(d => Array.isArray(d.a) && d.a[i] === nm).length - 1; e2.textContent = c > 0 ? fmt(c) + (c > 1 ? ' others' : ' other') + ' chose this' : 'nobody else chose this'; e2.hidden = false; });
  } catch (e) { /* stats are a bonus */ }
}
function finishRun() {
  const r = S.room;
  if (r.kind === 'daily' && r.day) { if (!ls.get('daily_' + r.day)) ls.set('daily_' + r.day, JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds })); }
  else if (r.kind === 'daily' && !dailySaved()) {
    const t = total(S.mine), st = streakNow() + 1;
    ls.set('streak', String(st)); ls.set('lastDay', dayKey()); if (st > Number(ls.get('beststreak') || 0)) ls.set('beststreak', String(st));
    ls.set('daily_' + dayKey(), JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds }));
    if (t > Number(ls.get('best') || 0)) ls.set('best', String(t));
    ls.set('played', String(Number(ls.get('played') || 0) + 1)); ls.set('sum', String(Number(ls.get('sum') || 0) + t));
  }
  else if (r.daily && !dailyDone(r.kind)) ls.set(dailyKey(r.kind), JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds }));
  const pk = progKey(r); if (pk) ls.set(pk, null);
  patchRoom({ phase: 'final' });
}
// Every accepted answer for a prompt, browsable by tier and searchable, shown once a prompt is over.
function answerBrowser(T, mine) {
  let tier = -1, q = '', shown = 100;
  const counts = [0, 0, 0, 0, 0]; T.list.forEach(e => counts[e.tier]++);
  const sorted = T.list.slice().sort((a, b) => b.tier - a.tier || (a.name < b.name ? -1 : 1));
  const tabs = h('div', { class: 'tabs', role: 'tablist' }), list = h('ul', { class: 'alist' });
  const search = h('input', { type: 'search', placeholder: 'Search all answers…', 'aria-label': 'Search answers', autocomplete: 'off', oninput: e => { q = e.target.value; shown = 100; draw(); } });
  const more = h('button', { class: 'small', type: 'button', onclick: () => { shown += 200; draw(); } });
  const tab = (i, label, n) => h('button', { class: 'small tab' + (i >= 0 ? ' t-' + TIERS[i].key : '') + (tier === i ? ' on' : ''), type: 'button', role: 'tab', 'aria-selected': String(tier === i), onclick: () => { tier = i; shown = 100; draw(); } }, label + ' ', h('b', { text: fmt(n) }));
  function draw() {
    tabs.replaceChildren(tab(-1, 'All', T.list.length), ...[4, 3, 2, 1, 0].map(i => tab(i, TIERS[i].name, counts[i])));
    const nq = norm(q), rows = sorted.filter(e => (tier < 0 || e.tier === tier) && (!nq || norm(e.name).includes(nq)));
    list.replaceChildren(...rows.slice(0, shown).map(e => h('li', { class: 't-' + TIERS[e.tier].key + (e.name === mine ? ' mine' : '') },
      tierIcon(e.tier, 16), h('span', { text: e.name }), e.name === mine && h('i', { text: 'you' }), h('b', { text: '+' + TIERS[e.tier].pts }), e.fact && h('em', { text: e.fact }))),
      ...(rows.length ? [] : [h('li', { class: 'none', text: 'nothing matches' })]));
    more.hidden = rows.length <= shown; more.textContent = fmt(Math.min(shown, rows.length)) + ' of ' + fmt(rows.length) + ' · show more';
  }
  draw();
  return h('div', { class: 'browser' }, tabs, search, list, more);
}
const BEARING = [[450, 'Pure Obscura. You were never coming back up.'], [351, 'Jaguar. Seriously deep.'], [251, 'Sloth. Well below the canopy.'], [151, 'Toucan. Holding your own.'], [0, 'Macaw. Plenty of forest left below.']];
function buildRunFinal() {
  const r = S.room, score = total(S.mine), daily = r.kind === 'daily', title = daily ? (r.day ? 'Archive descent · ' + r.day : 'Daily descent #' + dayNo()) : (r.daily ? 'Daily ' + PACKS[r.kind].label.toLowerCase() + ' #' + dayNo() : PACKS[r.kind].label + ' descent');
  const SQ = ['⬜', '🟦', '🟥', '🟪', '🟨'], rows = [], squares = [];
  r.fixed.forEach((id, i) => {
    const T = TOPICS[id], a = roundOf(S.mine, i + 1).a[0], hit = a && a[1] >= 0;
    squares.push(hit ? SQ[a[1]] : '⬛');
    const toggle = h('button', { class: 'small plus', type: 'button', 'aria-expanded': 'false', 'aria-label': 'Show every answer for prompt ' + (i + 1), text: '+' });
    toggle.addEventListener('click', () => { const body = toggle.closest('.logrow').querySelector('.logbody'), open = body.querySelector('.browser'); if (open) { open.remove(); toggle.textContent = '+'; toggle.setAttribute('aria-expanded', 'false'); } else { body.append(answerBrowser(T, hit ? a[0] : null)); toggle.textContent = '−'; toggle.setAttribute('aria-expanded', 'true'); } });
    rows.push(h('li', { class: 'logrow' },
      h('span', { class: 'num', text: String(i + 1) }),
      h('div', { class: 'logbody' },
        h('p', { class: 'q', text: T.name }),
        h('div', { class: 'a' }, hit ? h('ul', { class: 'chips' }, chip(a[0], a[1], '+' + TIERS[a[1]].pts)) : h('span', { class: 'note', text: 'nothing landed' }), h('span', { class: 'note oth', id: 'oth-' + i, hidden: true })),
        h('p', { class: 'gem' }, tierIcon(4, 16), h('span', { text: T.star.name }), T.star.fact && h('em', { text: T.star.fact }))),
      toggle));
  });
  const share = 'Obscura · ' + title.toLowerCase() + '\n' + score + ' pts · -' + fmt(score * M_PER_PT) + 'm\n' + squares.join('');
  let next = '';
  if (daily) { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), mins = Math.ceil((m - n) / 60000); next = 'next descent in ' + Math.floor(mins / 60) + 'h ' + String(mins % 60).padStart(2, '0') + 'm'; }
  return h('section', { class: 'final run' }, topBar(),
    h('p', { class: 'eyebrow', text: title + ' complete' }),
    h('div', { class: 'bigscore' }, h('b', { text: String(score) }), h('span', { text: '-' + fmt(score * M_PER_PT) + 'm' })),
    h('p', { class: 'bearing', text: (BEARING.find(b => score >= b[0]) || BEARING[4])[1] }),
    h('p', { class: 'note', id: 'pct', style: 'text-align:center', hidden: true }),
    // how each prompt landed: longer bars went deeper
    h('div', { class: 'bars', role: 'img', 'aria-label': 'Depth reached on each prompt' }, r.fixed.map((id, i) => { const a = roundOf(S.mine, i + 1).a[0], hit = a && a[1] >= 0, pts = hit ? TIERS[a[1]].pts : 0; return h('div', { class: 'dbar' }, h('i', { style: 'height:' + Math.max(4, Math.round(pts * 0.9)) + 'px;background:' + (hit ? TIERS[a[1]].color : '#3a4a3e') + ';animation-delay:' + (0.3 + i * 0.08) + 's' }), h('b', { text: hit ? '+' + pts : '0', style: 'color:' + (hit ? TIERS[a[1]].color : '#8fae8f') + ';animation-delay:' + (0.6 + i * 0.08) + 's' }), h('span', { text: String(i + 1) })); })),
    h('div', { class: 'actions', style: 'justify-content:center' },
      h('button', { type: 'button', text: 'Copy result', onclick: e => { const b = e.currentTarget; (navigator.clipboard ? navigator.clipboard.writeText(share) : Promise.reject()).then(() => { b.textContent = 'Copied'; }, () => { b.textContent = 'Copy blocked'; }); } }),
      !daily && h('button', { class: 'go', type: 'button', style: 'align-self:center', text: '▼ Another seven ▼', onclick: () => { const k = r.kind; leave(); startRun(k); } }),
      h('button', { type: 'button', text: 'Home', onclick: leave })),
    daily && h('p', { class: 'note', style: 'text-align:center' }, 'streak ' + streakNow() + ' · played ' + (ls.get('played') || 1) + ' · avg ' + Math.round(Number(ls.get('sum') || score) / Number(ls.get('played') || 1)) + ' · best ' + (ls.get('best') || score)),
    daily && h('p', { class: 'note', id: 'nextin', style: 'text-align:center', text: next }),
    panel('The bearing', null, h('ul', { class: 'bearings' }, [['0–150', 0], ['151–250', 1], ['251–350', 2], ['351–449', 3], ['450+', 4]].map(([range, t], i) => h('li', { class: 't-' + TIERS[t].key + ((score >= [0, 151, 251, 351, 450][i] && (i === 4 || score < [151, 251, 351, 450][i])) ? ' here' : '') }, tierIcon(t, 16), h('b', { text: range }), h('span', { text: BEARING[4 - i][1] }))))),
    panel('The descent log', 'tap + for every answer', h('ol', { class: 'log' }, rows)));
}

/* ---------- game flow ---------- */
// Daily runs are saved as they go, so a reload picks up where you were. A prompt you had already seen counts as a miss,
// which stops a reload from buying extra time or a second try at today's descent.
const progKey = r => !r || !r.fixed ? null : r.kind === 'daily' ? 'dprog_' + (r.day || dayKey()) : r.daily ? 'dprog_' + r.kind + '_' + dayKey() : null;
function saveProg() { const r = S.room, k = progKey(r); if (k && S.mode === 'solo') ls.set(k, JSON.stringify({ ids: r.fixed, rounds: S.mine.rounds })); }
function startRound(n) {
  const r = S.room;
  if (r.fixed && progKey(r)) { if (!S.mine.rounds[n]) S.mine.rounds[n] = { a: [], pts: 0 }; S.mine.rounds[n].seen = 1; saveProg(); }
  if (r.fixed) { const now = Date.now(); return patchRoom({ phase: 'play', round: n, topic: r.fixed[n - 1], startsAt: now + 2600, endsAt: now + 2600 + (r.secs + 14) * 1000 }); }
  let used = r.used || [];
  let pool = TOPIC_IDS.filter(id => !used.includes(id));
  if (pool.length < 5) { used = []; pool = TOPIC_IDS.slice(); }
  const order = ordered().map(p => p.id), picks = [];
  for (const id of shuffle(pool)) { if (usable(id)) picks.push(id); if (picks.length === 5) break; }
  patchRoom({
    phase: 'pick', round: n, options: picks, used,
    picker: order[(n - 1) % order.length] || S.me.id, pickEndsAt: Date.now() + PICK_MS, topic: '',
  });
}
function choose(topicId) {
  const r = S.room;
  if (r.phase !== 'pick' || !TOPICS[topicId]) return;
  const now = Date.now();
  patchRoom({
    phase: 'play', topic: topicId, used: [...(r.used || []), topicId],
    startsAt: now + COUNTDOWN_MS, endsAt: now + COUNTDOWN_MS + (r.dives || 5) * (r.secs + 14) * 1000 + 4000, // room for the fall and the timed result after every answer, and an Obscura's longer moment
  });
}
function next() {
  const r = S.room;
  if (r.phase !== 'reveal') return;
  if (r.round < r.rounds) startRound(r.round + 1);
  else patchRoom({ phase: 'final' });
}
function again() {
  if (S.mode === 'solo') { S.room.g++; S.mine = freshMine(S.room.g, S.mine.joinedAt); S.players = { [S.me.id]: S.mine }; startRound(1); return; }
  patchRoom({ phase: 'lobby', g: S.room.g + 1, round: 0 });
}
function once(key, fn) { if (S.done === key) return; S.done = key; fn(); }

function diveState() {
  const r = S.room, key = S.code + ':' + r.g + ':' + r.round;
  if (!S.dive || S.dive.key !== key) S.dive = { key, stage: 'wait', i: roundOf(S.mine, r.round).a.length, until: 0, hit: null };
  return S.dive;
}
// solo: the result waits for Descend or Enter. In a room it moves on by itself (longer after an Obscura, so its moment can play)
const landedMs = hit => S.mode === 'online' ? (hit && hit.tier === 4 && !SET.low ? 8500 : 5500) : 0;
function setStage(stage, ms, extra) {
  Object.assign(diveState(), extra || {}, { stage, until: ms ? Date.now() + ms : 0 });
  document.body.classList.toggle('sinking', stage === 'sink');
  document.body.classList.toggle('quiet', stage === 'landed' || stage === 'done');
  // the spotlight: dark everywhere but around the answer while it falls, lifting a couple of seconds after it lands
  // only a Jaguar (Krillion's Deep Cut) dims the forest: a tight spotlight on the falling answer, wider when it lands, gone 2.3 s later
  const dh = diveState().hit, deep = !!dh && dh.tier === 3; clearTimeout(setStage._spot);
  document.body.classList.toggle('spot', deep && (stage === 'sink' || stage === 'landed'));
  document.body.style.setProperty('--spot', stage === 'landed' ? '200px' : '66px');
  if (deep && stage === 'landed') setStage._spot = setTimeout(() => document.body.classList.remove('spot'), 2300);
  if (stage !== 'sink') window.__lines = null;
  renderDive();
}
// Lock one answer in (or a timeout when hit is null) and play its descent.
// giving up on an answer: no points, straight to the next one instead of waiting out the clock
function skipAnswer() {
  const d = diveState();
  if (!S.room || S.room.phase !== 'play' || d.stage !== 'ask') return;
  lockIn(null, true);
}
function lockIn(hit, skipped) {
  const r = S.room, d = diveState();
  if (S.mine.g !== r.g) S.mine = freshMine(r.g, S.mine.joinedAt);
  const rd = S.mine.rounds[r.round] || (S.mine.rounds[r.round] = { a: [], pts: 0 });
  rd.tp = r.topic;
  // seconds taken on this answer, for the end-of-game rundown
  const took = d.until ? Math.max(0, Math.round((r.secs * 1000 - (d.until - Date.now())) / 100) / 10) : null;
  rd.a.push(hit ? [hit.name, hit.tier, took] : ['', skipped ? -2 : -1, took]);
  if (hit) rd.pts += TIERS[hit.tier].pts;
  d.i = rd.a.length; S.fb = null;
  $('edge').classList.remove('hot');
  saveMe(); saveProg();
  if (hit) {
    const dur = [3.4, 3.0, 3.4, 4.3, 4.6][hit.tier], to = total(S.mine) * M_PER_PT, box = $('answer');
    if (window.__fx && box) window.__fx.submit(box.getBoundingClientRect(), hit.name);
    window.__depth = to;
    window.__sink = { to, dur, start: performance.now() };
    window.__lines = { id: Date.now() + Math.random(), base: to - TIERS[hit.tier].pts * M_PER_PT, tier: hit.tier, label: '“' + hit.name + '” ▼' };
    setStage('sink', dur * 1000 + 450, { hit, skipped: false });
  } else if (skipped) { snd('descend'); setStage('landed', landedMs(null), { hit: null, skipped: true }); }
  else { if (window.__fx) window.__fx.miss(); setStage('landed', landedMs(null), { hit: null, skipped: false }); }
  refresh();
}
function advance() {
  const r = S.room, d = diveState();
  if (d.stage !== 'landed') return;
  restart($('crt'), 'zap'); snd('descend');
  if (d.i >= (r.dives || 5)) { if (r.fixed) { if (r.round < r.rounds) startRound(r.round + 1); else finishRun(); return; } setStage('done'); } else setStage('ask', r.secs * 1000);
}
function submit(ev) {
  ev.preventDefault();
  const r = S.room, input = $('answer'), d = diveState();
  if (!input || r.phase !== 'play' || d.stage !== 'ask') return;
  const text = input.value.trim();
  if (!text) return;
  const m = match(r.topic, text), form = input.closest('form'), typed = '“' + text.slice(0, 30) + '”';
  const say2 = (fb) => { S.fb = fb; renderFb(); };
  // wrong guesses are kept for the rundown at the end
  const wrong = () => { if (S.mine.g !== r.g) S.mine = freshMine(r.g, S.mine.joinedAt); const rw = S.mine.rounds[r.round] || (S.mine.rounds[r.round] = { a: [], pts: 0 }); rw.tp = r.topic; rw.w = rw.w || []; if (rw.w.length < 20) rw.w.push(text.slice(0, 28)); };
  if (!m || m.amb) wrong();
  if ((!m || m.amb) && SET.clear) input.value = '';
  if (m && m.amb) { restart(form, 'jolt'); restart($('fb'), 'shake'); return say2({ kind: 'miss', text: typed + ' fits more than one answer', sub: 'be more specific' }); }
  if (!m) { restart(form, 'jolt'); if (window.__fx) window.__fx.reject(); say2({ kind: 'miss', text: typed + ': no trace of that. try again' }); return restart($('fb'), 'shake'); }
  const hit = m.e;
  if (roundOf(S.mine, r.round).a.some(x => x[0] === hit.name)) { restart(form, 'jolt'); return say2({ kind: 'dup', text: '“' + hit.name + '” is already in your notebook' }); }
  const changed = norm(text) !== norm(hit.name);
  if ((m.fix && SET.corr) || (changed && S.shown !== hit.name)) {
    S.shown = hit.name;
    input.value = hit.name;
    snd('fix');
    say2({ kind: 'fix', text: typed + ' → “' + hit.name + '”', sub: m.dip ? 'lucky dip · press enter again to take it · or edit' : 'corrects to this · press enter again to confirm · or edit' });
    return restart($('fb'), 'pop');
  }
  S.shown = null;
  lockIn(hit);
}
function renderFb() {
  const fb = $('fb'); if (!fb) return;
  fb.replaceChildren(...(S.fb ? [h('p', { text: S.fb.text }), S.fb.sub && h('small', { text: S.fb.sub })].filter(Boolean) : []));
  fb.className = 'fb ' + (S.fb ? 'f-' + S.fb.kind : '');
}
function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
const fxOn = name => S.fx && Date.now() < S.fx.until && (name == null || S.fx.name === name);

/* ---------- shared pieces ---------- */
const chip = (name, tier, extra, n) => h('li', { class: 'chip t-' + TIERS[tier].key, style: n != null ? '--n:' + n : null }, tierIcon(tier, 16), h('span', { text: name }), extra != null && h('b', { text: extra }));
function tierLegend() {
  return h('ul', { class: 'legend', 'aria-label': 'Answer tiers' }, TIERS.map((t, i) => chip(t.name, i, '+' + t.pts)));
}
const panel = (title, aside, ...kids) => h('div', { class: 'panel' },
  h('div', { class: 'ph' }, h('span', { text: title }), aside && h('em', { text: aside })), kids);
// The title: OBSCURA in mossy green pixels, overgrown along the tops, with a vine draped across
// the word and more hanging off it that sway. Drawn once at pixel size, then shown scaled up.
const LOGO = { art: null, wait: null };
function drawLogo() {
  if (LOGO.art) return Promise.resolve(LOGO.art);
  if (LOGO.wait) return LOGO.wait;
  const fontReady = document.fonts && document.fonts.load ? document.fonts.load('24px VT323').catch(() => {}) : Promise.resolve();
  return (LOGO.wait = fontReady.then(() => {
    const F = 24, TOP = 7, BOT = 30, PAD = 6, word = 'OBSCURA', rnd = seeded('obscura-logo');
    const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const tmp = document.createElement('canvas').getContext('2d'); tmp.font = F + 'px VT323';
    const ws = [...word].map(c => Math.ceil(tmp.measureText(c).width)), GAP = 2;
    const TW = ws.reduce((a, b) => a + b, 0) + GAP * (word.length - 1), W = TW + PAD * 2, H = TOP + F + BOT;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d'); c.font = F + 'px VT323'; c.textBaseline = 'top'; c.fillStyle = '#fff';
    let x = PAD; const lx = [];
    [...word].forEach((ch, i) => { lx.push(x); c.fillText(ch, x, TOP); x += ws[i] + GAP; });
    const raw = c.getImageData(0, 0, W, H).data, M = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) M[i] = raw[i * 4 + 3] > 110 ? 1 : 0;
    // thicken the strokes by a pixel so the letters read as chunky blocks
    const B = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) if (M[y * W + x2] || (x2 > 0 && M[y * W + x2 - 1])) B[y * W + x2] = 1;
    const m = (x2, y) => x2 >= 0 && y >= 0 && x2 < W && y < H && B[y * W + x2] === 1;
    let gy0 = H, gy1 = 0; for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) if (B[y * W + x2]) { gy0 = Math.min(gy0, y); gy1 = Math.max(gy1, y); }
    c.clearRect(0, 0, W, H);
    const px = (x2, y, col) => { c.fillStyle = col; c.fillRect(x2, y, 1, 1); };
    const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    // a hard shadow two pixels down, then a dark rim, then the letters lit from above
    for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) if (!m(x2, y) && (m(x2, y - 1) || m(x2, y - 2) || m(x2 - 1, y - 2))) px(x2, y, '#03140a');
    for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) if (!m(x2, y) && (m(x2 - 1, y) || m(x2 + 1, y) || m(x2, y - 1) || m(x2, y + 1) || m(x2 - 1, y - 1) || m(x2 + 1, y - 1) || m(x2 - 1, y + 1) || m(x2 + 1, y + 1))) px(x2, y, '#06200f');
    const ramp = ['#e4ffb0', '#b8f27a', '#8fde5c', '#6cc84a', '#4aa83c', '#2c7a30'];
    for (let y = 0; y < H; y++) for (let x2 = 0; x2 < W; x2++) if (m(x2, y)) {
      const u = (y - gy0) / Math.max(1, gy1 - gy0), v = u * (ramp.length - 1.2) + BAY[(x2 & 3) + ((y & 3) << 2)] / 16 - 0.4;
      let col = ramp[Math.max(1, Math.min(ramp.length - 1, Math.round(v)))];
      if (!m(x2, y - 1)) col = ramp[0];
      else if (!m(x2 - 1, y) && u < 0.7) col = ramp[1];
      else if (!m(x2 + 1, y) || !m(x2, y + 1)) col = ramp[5];
      px(x2, y, col);
    }
    // moss tufts and the odd fleck of lichen on every upward surface
    const tops = []; for (let x2 = 0; x2 < W; x2++) for (let y = 1; y < H; y++) if (m(x2, y) && !m(x2, y - 1)) tops.push([x2, y]);
    const moss = ['#2f7d32', '#3f9b3a', '#5fbf45', '#8be05a'];
    for (const [x2, y] of tops) {
      if (rnd() < 0.82) px(x2, y - 1, moss[ri(0, 2)]);
      if (rnd() < 0.42) px(x2, y - 2, moss[ri(1, 3)]);
      if (rnd() < 0.12) px(x2, y - 3, moss[3]);
      if (rnd() < 0.18) px(x2, y + 1, moss[ri(0, 1)]);
    }
    for (let y = gy0; y <= gy1; y++) for (let x2 = 0; x2 < W; x2++) if (m(x2, y) && m(x2, y - 1) && rnd() < 0.012) px(x2, y, '#3f9b3a');
    const leaf = (x2, y, dir, big) => { px(x2 + dir, y, '#5cc24a'); px(x2 + dir * 2, y - 1, '#7fdc58'); if (big) { px(x2 + dir * 2, y, '#3d8f35'); px(x2 + dir * 3, y - 1, '#a6ef72'); } };
    // a vine draped across the top of the word, sagging between the letters
    const lastX = lx[lx.length - 1] + ws[ws.length - 1];
    for (let x2 = lx[0] - 2; x2 <= lastX + 2; x2++) {
      const u = (x2 - lx[0]) / (lastX - lx[0]), sag = Math.abs(Math.sin(u * Math.PI * 3.5)) * 4;
      const y = Math.round(gy0 - 1 + sag + Math.sin(x2 * 0.7) * 0.6);
      px(x2, y, '#2b5f22'); if (x2 % 2) px(x2, y - 1, '#447f2c');
      if (x2 % 4 === 0) leaf(x2, y, rnd() < 0.5 ? -1 : 1, rnd() < 0.5);
      if (rnd() < 0.05) { px(x2, y - 1, '#ff4d4d'); px(x2 + 1, y - 2, '#ffd166'); }
    }
    // hanging vines: each its own small picture so it can sway from where it hangs
    const vines = [], anchors = [];
    for (let i = 0; i < word.length; i++) { anchors.push(lx[i] + ri(1, Math.max(1, ws[i] - 2))); if (rnd() < 0.55) anchors.push(lx[i] + ri(0, ws[i])); }
    anchors.push(lx[0] - 3, lastX + 3);
    for (const ax of anchors) {
      // hang from the underside of the letter in that column, so the faces stay readable
      let ay = -1; for (let y = H - 1; y >= gy0; y--) if (m(ax, y)) { ay = y + 2; break; }
      if (ay < 0) ay = gy0 + Math.round(Math.abs(Math.sin(((ax - lx[0]) / (lastX - lx[0])) * Math.PI * 3.5)) * 4);
      const len = ri(6, Math.max(8, H - ay - 3)), VW = 9, vc = document.createElement('canvas'); vc.width = VW; vc.height = len + 2;
      const v = vc.getContext('2d'), vp = (x2, y, col) => { v.fillStyle = col; v.fillRect(x2, y, 1, 1); }, ph = rnd() * 6;
      for (let y = 0; y < len; y++) {
        const x2 = 4 + Math.round(Math.sin(y * 0.33 + ph) * 1.2);
        vp(x2, y, y % 3 ? '#2b5f22' : '#3c7a2a');
        if (y > 1 && y % 3 === 1) { const dir = (y / 3 | 0) % 2 ? 1 : -1; vp(x2 + dir, y, '#4fae3e'); vp(x2 + dir * 2, y - 1, '#7fdc58'); if (rnd() < 0.5) vp(x2 + dir * 2, y, '#3d8f35'); }
      }
      const ex = 4 + Math.round(Math.sin((len - 1) * 0.33 + ph) * 1.2);
      if (rnd() < 0.35) { vp(ex - 1, len, '#ff4d4d'); vp(ex + 1, len, '#ff4d4d'); vp(ex, len - 1, '#ff4d4d'); vp(ex, len + 1, '#ff4d4d'); vp(ex, len, '#ffd166'); }
      else { vp(ex, len, '#7fdc58'); vp(ex - 1, len - 1, '#5cc24a'); vp(ex + 1, len - 1, '#5cc24a'); }
      vines.push({ src: vc.toDataURL(), x: (ax - 4) / W, y: ay / H, w: VW / W, h: (len + 2) / H, d: -rnd() * 4, s: 3.2 + rnd() * 2.4 });
    }
    LOGO.art = { src: cv.toDataURL(), w: W, h: H, vines };
    return LOGO.art;
  }));
}
function logo() {
  const box = h('h1', { class: 'logo grown', 'aria-label': 'Obscura' });
  const fill = art => {
    box.style.aspectRatio = art.w + ' / ' + art.h;
    box.replaceChildren(h('img', { class: 'lw', src: art.src, alt: '', draggable: 'false' }),
      ...art.vines.map(v => h('img', { class: 'vine', src: v.src, alt: '', draggable: 'false', style: `left:${v.x * 100}%;top:${v.y * 100}%;width:${v.w * 100}%;height:${v.h * 100}%;animation-delay:${v.d}s;animation-duration:${v.s}s` })));
  };
  if (LOGO.art) fill(LOGO.art); else drawLogo().then(fill, () => box.replaceChildren(document.createTextNode('OBSCURA')));
  return box;
}
const yPct = d => Math.sqrt(Math.min(d, MAX_DEPTH) / MAX_DEPTH) * 100;
function gaugeEl() {
  return h('div', { class: 'gauge', id: 'gauge', role: 'img', 'aria-label': 'Depth of each diver' },
    TICKS.map(([m, , label]) => h('div', { class: m === MAX_DEPTH ? 'tick floor' : 'tick', style: 'top:' + yPct(m) + '%' },
      h('span', { text: label }), h('i', { text: fmt(m) + 'm' }))),
    h('div', { class: 'lanes', id: 'lanes' }));
}
function refreshGauge() {
  const lanes = $('lanes'); if (!lanes) return;
  const ps = ordered();
  const seen = new Set();
  ps.forEach((p, i) => {
    let m = lanes.querySelector('[data-id="' + p.id + '"]');
    if (!m) { m = h('div', { class: 'diver', 'data-id': p.id }, h('img', { class: 'spr', width: 28, height: 28, alt: '' }), h('span')); lanes.append(m); }
    const src = sprite('krill', COLORS[i % COLORS.length]);
    if (m.firstChild.getAttribute('src') !== src) m.firstChild.setAttribute('src', src);
    m.lastChild.textContent = p.id === S.me.id ? 'you' : nameOf(p).slice(0, 3);
    m.lastChild.style.color = COLORS[i % COLORS.length];
    m.style.top = yPct(depthOf(p)) + '%';
    m.style.left = ((i + 0.5) / ps.length * 100) + '%';
    m.classList.toggle('me', p.id === S.me.id);
    m.title = nameOf(p) + ', ' + fmt(depthOf(p)) + ' m';
    seen.add(p.id);
  });
  lanes.querySelectorAll('.diver').forEach(m => { if (!seen.has(m.dataset.id)) m.remove(); });
}
function boardRows(withRound) {
  const r = S.room, ps = ordered().sort((a, b) => total(b) - total(a)), multi = ps.length > 1, top = ps[0] ? total(ps[0]) : 0;
  const prev = S._ranks || {}; S._ranks = {};
  let rank = 0;
  return ps.map((p, i) => {
    if (i === 0 || total(p) !== total(ps[i - 1])) rank = i + 1;
    const up = multi && prev[p.id] && rank < prev[p.id]; S._ranks[p.id] = rank;
    const lead = multi && rank === 1 && top > 0;
    return h('li', { class: (p.id === S.me.id ? 'me' : '') + (up ? ' up' : '') },
      multi && h('span', { class: 'rk', style: 'color:' + (MEDAL[rank - 1] || '#8fae8f'), text: String(rank) }),
      icon('krill', colorOf(p.id), 24),
      h('span', { class: 'who' }, h('span', { text: nameOf(p) + (p.id === S.me.id ? ' (you)' : '') }), lead && h('i', { class: 'crown', 'aria-label': 'in the lead', text: '♛' })),
      withRound && h('span', { class: 'count', text: roundOf(p, r.round).a.length + '/' + (r.dives || 5) }),
      multi && rank > 1 && top > 0 && h('small', { class: 'gap', text: '−' + fmt(top - total(p)) }),
      // depth stops at the bottom of the forest, so rivals are ranked and shown by points, which never cap
      h('span', { class: 'depth' + (p.id === S.me.id && fxOn() ? ' slam' : ''), text: multi ? fmt(total(p)) + ' pts' : fmt(depthOf(p)) + 'm' }));
  });
}
// ---------- a little rivalry in party rooms: lead changes and rivals' rare finds pop up (tier only, never the answer) ----------
const MEDAL = ['#ffe08a', '#d7e1f2', '#ffb35c'];
function rivalToast(kids, color, big) {
  const old = $('rival'); if (old) old.remove();
  const el = h('div', { id: 'rival', class: 'rival' + (big ? ' big' : ''), style: '--rc:' + (color || '#7dffb0'), role: 'status' }, kids);
  document.body.append(el); clearTimeout(rivalToast._t); rivalToast._t = setTimeout(() => el.remove(), big ? 3300 : 2700);
}
// someone else in the room found an Obscura: the edges of your screen flare gold and rays open behind the news,
// without covering your own game
function rivalGold() {
  const old = $('obzmini'); if (old) old.remove();
  const el = h('div', { id: 'obzmini', 'aria-hidden': 'true' }, h('div', { class: 'om-edge' }), h('div', { class: 'om-rays' }));
  document.body.append(el); setTimeout(() => el.remove(), 2200);
  snd('best'); [4, 5, 6].forEach((i, k) => setTimeout(() => snd('slam', i), 120 + k * 110));
}
function rivalWatch() {
  const r = S.room; if (S.mode !== 'online' || !r || r.phase !== 'play') return;
  const ps = ordered(); if (ps.length < 2) return;
  if (diveState().stage === 'sink') return; // hold news until your own answer has landed
  const key = r.g + ':' + r.round;
  if (S._seenKey !== key) { S._seenKey = key; S._seen = {}; ps.forEach(p => { S._seen[p.id] = roundOf(p, r.round).a.length; }); }
  for (const p of ps) {
    if (p.id === S.me.id) continue;
    const a = roundOf(p, r.round).a, was = S._seen[p.id] == null ? a.length : S._seen[p.id];
    S._seen[p.id] = a.length;
    if (a.length > was) {
      const best = a.slice(was).reduce((m, x) => (x[1] > m[1] ? x : m), ['', -1]);
      if (best[1] >= 2) { const T = TIERS[best[1]]; rivalToast([icon(T.art, T.color, 28), h('span', { text: nameOf(p) + (best[1] === 4 ? ' found an Obscura' : ' found a ' + T.name) }), h('b', { text: '+' + T.pts })], T.color, best[1] === 4); if (best[1] === 4) rivalGold(); else snd('ding'); }
    }
  }
  const sorted = ps.slice().sort((a, b) => total(b) - total(a)), lead = sorted[0];
  const leadId = total(lead) > 0 && total(sorted[1]) < total(lead) ? lead.id : null;
  if (!leadId) { if (S._lead === undefined) S._lead = null; return; }
  if (S._lead !== undefined && leadId !== S._lead) {
    if (leadId === S.me.id) { leadSlam(lead, 'you'); snd('best'); }
    else if (S._lead === S.me.id) { leadSlam(lead, 'lost'); snd('miss'); }
    else { leadSlam(lead, 'other'); snd('ding'); }
  }
  S._lead = leadId;
}
function topBar() {
  return h('header', { class: 'bar' },
    h('span', { class: 'brand', text: 'Obscura' }),
    S.mode === 'online' ? h('span', { class: 'code', text: 'Room ' + S.code }) : h('span', { class: 'code', text: S.room && S.room.fixed ? (S.room.kind === 'daily' ? 'Daily descent' : PACKS[S.room.kind].label + ' pack') : 'Solo descent' }),
    h('button', { class: 'ghost small', type: 'button', onclick: leave, text: 'Leave' }));
}

/* ---------- screens ---------- */
const HOWTO = ['Seven prompts a day. The same for everyone.', '25 seconds to name one thing.', 'Rare answers score big. Obvious ones barely move you.', 'Every point drops you 10 metres. 700 is the forest floor of legend.', 'A bare name is a lucky dip: it lands on one answer that carries it.', 'One daily descent. Packs, rooms and free play are unlimited.'];
/* ---------- the menu, laid out like Krillion's: a grid of tiles for every place you can go ---------- */
function modal(id, label, title, ...kids) {
  const old = $(id); if (old) old.remove();
  const close = () => { const m = $(id); if (m) m.remove(); };
  const m = h('div', { id, class: 'modal', role: 'dialog', 'aria-label': title, onclick: e => { if (e.target.id === id) close(); } },
    h('div', { class: 'panel sheet' },
      h('div', { class: 'sheethead' }, h('div', null, h('small', { text: label }), h('h2', { text: title })), h('button', { class: 'small x', type: 'button', 'aria-label': 'Close', onclick: close, text: '×' })),
      kids));
  document.body.append(m); m.close = close; return m;
}
// The Obscura moment: the forest goes dark, gold rays turn behind the moth, rings break outward,
// and the name slams down letter by letter, each with its own rising note, before the result card arrives.
function moment(y, word, sub, pic, cls) {
  const old = $('obz'); if (old) old.remove();
  const low = SET.low || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = h('div', { id: 'obz', class: (low ? 'low ' : '') + (cls || ''), 'aria-hidden': 'true', style: '--y:' + Math.round(y) + 'px' },
    h('div', { class: 'obz-dim' }), h('div', { class: 'obz-rays' }), h('div', { class: 'obz-core' }),
    [0, 1, 2].map(i => h('div', { class: 'obz-ring', style: '--d:' + (0.05 + i * 0.22) + 's' })),
    h('div', { class: 'obz-moth' }, pic),
    h('div', { class: 'obz-word' }, [...word].map((c, i) => h('span', { style: '--i:' + i, text: c }))),
    h('div', { class: 'obz-sub', text: sub }));
  document.body.append(el);
  if (!low) [...word].forEach((c, i) => setTimeout(() => snd('slam', Math.min(6, Math.round(i * 6 / Math.max(1, word.length - 1)))), 640 + i * 90));
  setTimeout(() => el.remove(), 3300);
}
window.__obscura = y => moment(y, 'OBSCURA', 'the rarest find in the forest', icon('moth', '#ffe08a', 128));
// ---------- party-room flair ----------
// a big 3, 2, 1, DIVE! at the start of every round
function bigCount(t) {
  if (S.mode !== 'online') return;
  const old = $('bigcount'); if (old) old.remove();
  const el = h('div', { id: 'bigcount', class: t.length > 1 ? 'go' : '', 'aria-hidden': 'true', text: t });
  document.body.append(el); setTimeout(() => el.remove(), 900);
}
// a lead change gets a banner with the leader's frog
function leadSlam(p, kind) {
  const old = $('leadslam'); if (old) old.remove();
  const col = kind === 'lost' ? '#ff7a45' : kind === 'you' ? '#ffe08a' : colorOf(p.id);
  const el = h('div', { id: 'leadslam', class: kind, style: '--lc:' + col, role: 'status' },
    icon('krill', kind === 'you' ? '#ffc23a' : colorOf(p.id), 52),
    h('div', null, h('small', { text: kind === 'lost' ? 'overtaken' : 'new leader' }), h('strong', { text: kind === 'you' ? 'You take the lead' : kind === 'lost' ? nameOf(p) + ' passed you' : nameOf(p) + ' takes the lead' })));
  document.body.append(el); setTimeout(() => el.remove(), 2500);
}
// reactions: a quick word to the room that floats up on everyone's screen (only these words can be sent)
const EMOTES = ['GG', 'WOW', 'NOO', 'LOL', 'SO CLOSE', '🐸'];
function emoteBar() {
  if (S.mode !== 'online') return null;
  return h('div', { class: 'emotes', role: 'group', 'aria-label': 'React' }, EMOTES.map(e => h('button', { class: 'small', type: 'button', text: e, onclick: () => sendEmote(e) })));
}
function sendEmote(e) {
  const now = Date.now(); if (now - (S._emoAt || 0) < 1200) return; S._emoAt = now;
  S.mine.emo = { e, t: now }; saveMe(); showEmote(S.me.id, e); snd('pick');
}
function showEmote(pid, e) {
  let box = $('emos'); if (!box) { box = h('div', { id: 'emos', 'aria-live': 'polite' }); document.body.append(box); }
  const p = S.players[pid];
  const b = h('div', { class: 'emo' + (pid === S.me.id ? ' me' : ''), style: '--pc:' + colorOf(pid) }, icon('krill', colorOf(pid), 22), h('span', { class: 'who', text: p ? nameOf(p) : '' }), h('b', { text: e }));
  box.append(b); while (box.children.length > 5) box.firstChild.remove(); setTimeout(() => b.remove(), 3800);
}
function emoteWatch() {
  if (S.mode !== 'online' || !S.room) return;
  const first = !S._emo; S._emo = S._emo || {};
  for (const p of ordered()) {
    if (p.id === S.me.id || !p.emo || !EMOTES.includes(p.emo.e)) continue;
    const t = Number(p.emo.t) || 0;
    if (t > (S._emo[p.id] || 0)) { S._emo[p.id] = t; if (!first && Date.now() - t < 8000) { showEmote(p.id, p.emo.e); snd('click'); } }
  }
}
// the end of a game: everyone watches the winner's frog turn gold and CHAMPION slam down
function champion(p) { moment(Math.round(innerHeight * 0.3), 'CHAMPION', nameOf(p) + ' · ' + fmt(total(p)) + ' pts', icon('krill', '#ffc23a', 128), 'champ'); }
const goHome = () => { if (S.mode) leave(); document.querySelectorAll('.modal').forEach(m => m.remove()); };
function openMenu() {
  const here = !S.mode ? 'home' : S.room && S.room.fixed ? S.room.kind : S.mode;
  const tile = (key, glyph, label, fn, art) => h('button', { class: 'tile' + (here === key ? ' on' : ''), type: 'button', onclick: () => { document.querySelectorAll('.modal').forEach(m => m.remove()); fn(); } }, art ? icon(art[0], art[1], 24) : h('i', { text: glyph }), h('span', { text: label }));
  modal('menu', 'Obscura', 'Menu',
    h('div', { class: 'ph' }, h('span', { text: 'Drop in' })),
    h('div', { class: 'tiles' },
      tile('daily', '↓', 'Daily descent', () => { goHome(); startRun('daily'); }),
      tile('solo', '∞', 'Free play', () => { goHome(); startSolo(); }),
      tile('online', '', 'Party room', () => { goHome(); const n = $('nick'); if (n) n.focus(); }, ['krill', '#ff7a45']),
      tile('archive', '⟲', 'Archive', () => { goHome(); openArchive(); }),
      tile('packs', '▦', 'Themed packs', () => { goHome(); openPacks(); }),
      tile('me', '☻', 'My Obscura', openMe),
      tile('settings', '⚙', 'Settings', openSettings),
      tile('faq', '?', 'How to play', openHowto),
      S.mode && tile('home', '⌂', 'Home', goHome)),
    h('p', { class: 'fine', style: 'text-align:left', text: 'pure obscura.' }));
}
function openHowto() { modal('howto', 'Obscura', 'How to play', h('ul', { class: 'howlist' }, HOWTO.map(tx => h('li', { text: tx }))), h('div', { class: 'ph' }, h('span', { text: 'The finds' })), tierLegend(),
  h('button', { class: 'small', type: 'button', style: 'align-self:center', text: '▶ Watch an Obscura land', onclick: () => { document.querySelectorAll('.modal').forEach(m => m.remove()); Sound.unlock(); snd('land', 4); window.__obscura(Math.round(innerHeight * 0.36)); } })); }
function openPacks() {
  modal('packs', 'Seven prompts', 'Themed packs',
    h('div', { class: 'ph' }, h('span', { text: 'Today’s' })),
    h('div', { class: 'tiles' }, Object.keys(PACKS).map(k => h('button', { class: 'tile' + (dailyDone(k) ? ' on' : ''), type: 'button', disabled: packPool(k).length < 7, onclick: () => { goHome(); startRun(k, null, true); } }, h('i', { text: dailyDone(k) ? '✓' : '↓' }), h('span', { text: 'Daily ' + PACKS[k].label.toLowerCase() }), h('small', { text: dailyDone(k) ? 'see result' : 'same seven for everyone' })))),
    h('div', { class: 'ph' }, h('span', { text: 'Unlimited' })),
    h('div', { class: 'tiles' }, Object.keys(PACKS).map(k => { const n = packPool(k).length; return h('button', { class: 'tile', type: 'button', disabled: n < 7, onclick: () => { goHome(); startRun(k); } }, h('i', { text: k === 'geo' ? '◍' : '◆' }), h('span', { text: PACKS[k].label }), h('small', { text: n < 7 ? 'being stocked' : n + ' prompts' })); })),
    h('p', { class: 'note', text: 'One answer per prompt, 25 seconds each. Play as often as you like.' }));
}
// past daily descents: play any you missed (they do not count towards your streak)
function openArchive() {
  const rows = [];
  for (let back = 1; back <= 14; back++) {
    const d = new Date(); d.setDate(d.getDate() - back);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), no = dayNo() - back;
    if (no < 1) break;
    let saved = null; try { saved = JSON.parse(ls.get('daily_' + key) || 'null'); } catch (e) { /* unreadable */ }
    const score = saved ? Object.values(saved.rounds).reduce((t, r) => t + (r.pts || 0), 0) : null;
    rows.push(h('li', null, h('span', { text: '#' + no + ' · ' + d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) }), h('b', { text: score == null ? '' : score + ' pts' }),
      h('button', { class: 'small', type: 'button', text: saved ? 'Result' : 'Play', onclick: () => { goHome(); startRun('daily', key); } })));
  }
  modal('archive', 'Past descents', 'Archive', rows.length ? h('ul', { class: 'archlist' }, rows) : h('p', { class: 'note', text: 'Nothing here yet. Today is descent #1; yesterday’s will appear here tomorrow.' }));
}
function openMe() {
  const played = Number(ls.get('played') || 0), stat = (k, v) => h('li', null, h('span', { text: k }), h('b', { text: String(v) }));
  modal('me', 'Logbook', 'My Obscura',
    h('ul', { class: 'stats' }, stat('Streak', streakNow()), stat('Best streak', bestStreak()), stat('Played', played), stat('Average', played ? Math.round(Number(ls.get('sum') || 0) / played) : 0), stat('Best', ls.get('best') || 0)),
    h('div', { class: 'ph' }, h('span', { text: 'Companion' })),
    h('div', { class: 'pals' }, PALS.map(p => { const open = bestStreak() >= p.need, b = h('button', { class: 'pal' + (window.__pal.id === p.id ? ' on' : ''), type: 'button', disabled: !open, 'aria-label': p.name }, icon(p.art, open ? p.color : '#3a4a3e', 32), h('span', { text: p.name }), h('small', { text: open ? (p.need ? p.need + '-day' : 'starter') : p.need + '-day streak' })); b.addEventListener('click', () => { setPal(p.id); b.parentElement.querySelectorAll('.pal').forEach(x => x.classList.toggle('on', x === b)); }); return b; })));
}
function buildHome() {
  return h('section', { class: 'home' },
    logo(),
    h('p', { class: 'tag', text: 'The daily descent' }),
    h('p', { class: 'lede', text: '7 prompts · 25 seconds each · rarer answers drop deeper' }),
    h('details', { class: 'howto' }, h('summary', { text: 'How to play' }), h('ul', null, HOWTO.map(tx => h('li', { text: tx })))),
    h('p', { id: 'msg', class: 'msg', role: 'status', hidden: true }),
    panel('Party room', 'play together',
      h('label', { for: 'nick', text: 'Your name' }),
      h('input', { id: 'nick', maxlength: '16', autocomplete: 'off', value: S.me.name, placeholder: 'what the crew calls you' }),
      h('div', { class: 'partyrow' },
        h('button', { id: 'create', type: 'button', onclick: createRoom, text: 'Host a room' }),
        h('form', { class: 'joinrow', onsubmit: e => { e.preventDefault(); joinRoom($('code').value, false); } },
          h('input', { id: 'code', maxlength: '4', autocomplete: 'off', autocapitalize: 'characters', placeholder: 'KRLP', 'aria-label': 'Room code' }),
          h('button', { id: 'join', class: 'pink', text: 'Join' }))),
      h('p', { id: 'net', class: 'note' })),
    h('button', { id: 'daily', class: 'go big', type: 'button', onclick: () => startRun('daily'), text: dailySaved() ? '▼ Today’s result ▼' : '▼ Begin descent ▼' }),
    h('div', { class: 'dailies' }, Object.keys(PACKS).map(k => h('button', { type: 'button', disabled: packPool(k).length < 7, onclick: () => startRun(k, null, true) }, h('small', { text: dailyDone(k) ? 'done · see result' : 'today’s seven' }), h('span', { text: (dailyDone(k) ? '✓ ' : '▼ ') + 'Daily ' + PACKS[k].label.toLowerCase() })))),
    h('div', { class: 'homerow' },
      h('span', { class: 'note', text: 'descent #' + dayNo() }),
      h('button', { class: 'small', type: 'button', onclick: openArchive, text: 'Archive ⟲' }),
      h('button', { class: 'small', type: 'button', onclick: openPacks, text: 'Themed packs' }),
      h('button', { class: 'small', type: 'button', onclick: startSolo, text: 'Free play ∞' })));
}
function refreshHome() {
  const net = $('net'); if (!net) return;
  const ready = S.dbState === 'ready' && S.canWrite !== false;
  $('create').disabled = !ready; $('join').disabled = !ready; $('code').disabled = !ready;
  const msgEl = $('msg'); if (msgEl && msgEl.parentElement !== $('daily').parentElement.parentElement) { /* keep messages near the top */ }
  net.textContent = S.dbState === 'wait' ? 'Connecting to online rooms…'
    : S.dbState === 'none' ? 'Party rooms are not switched on here yet. Everything else is playable.'
    : S.canWrite === false ? 'You have view-only access, so you cannot join a room here. You can still practise solo.'
    : '';
  net.hidden = !net.textContent;
  say(S.msg);
}

function buildLobby() {
  const host = isHost();
  const opt = (id, label, values, unit) => h('label', { class: 'opt', for: id }, label,
    h('select', { id, disabled: !host, onchange: e => patchRoom({ [id.slice(2)]: Number(e.target.value) }) },
      values.map(v => h('option', { value: v, text: v + unit }))));
  return h('section', { class: 'lobby' }, topBar(),
    panel('Room code', null,
      h('div', { class: 'bigcode' }, h('span', { id: 'codetext', text: S.code }),
        h('button', { class: 'small', type: 'button', text: 'Copy', onclick: e => {
          const b = e.currentTarget;
          (navigator.clipboard ? navigator.clipboard.writeText(S.code) : Promise.reject()).then(() => { b.textContent = 'Copied'; }, () => {
            const s = getSelection(), rg = document.createRange(); rg.selectNodeContents($('codetext')); s.removeAllRanges(); s.addRange(rg);
          });
        } })),
      ),
    panel('Explorers', null, h('ol', { id: 'board', class: 'board' })),
    panel('Expedition plan', null,
      h('div', { class: 'opts' }, opt('o-rounds', 'Prompts', [3, 5, 7], ''), opt('o-dives', 'Answers per prompt', [3, 5, 7], ''), opt('o-secs', 'Seconds per answer', [15, 25, 40], ' s'))),
    host ? h('button', { class: 'go', type: 'button', onclick: () => startRound(1), text: '▼ Begin descent ▼' })
         : h('p', { class: 'note', id: 'waithost', style: 'text-align:center', text: 'Waiting for the host to set off.' }),
    emoteBar(),
    h('p', { id: 'msg', class: 'msg', role: 'status', hidden: true }));
}
function refreshLobby() {
  $('board').replaceChildren(...ordered().map(p => h('li', { class: p.id === S.me.id ? 'me' : '' },
    h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }),
    h('span', { class: 'who', text: nameOf(p) + (p.id === S.me.id ? ' (you)' : '') }),
    p.id === S.room.host && h('span', { class: 'count', text: 'host' }))));
  $('o-rounds').value = S.room.rounds; $('o-dives').value = S.room.dives || 5; $('o-secs').value = S.room.secs;
}

function buildPick() {
  const r = S.room, mineToPick = r.picker === S.me.id;
  return h('section', { class: 'pick' }, topBar(),
    h('p', { class: 'eyebrow', text: 'Round ' + r.round + ' of ' + r.rounds }),
    h('h2', { text: mineToPick ? 'Choose the prompt' : nameOf(S.players[r.picker]) + ' is choosing' }),
    h('p', { class: 'note', id: 'clock' }),
    h('div', { class: 'cards' }, (r.options || []).map(id => {
      const T = TOPICS[id]; if (!T) return null;
      return h('button', { class: 'card', type: 'button', disabled: !mineToPick, onclick: () => choose(id) },
        h('strong', { text: T.name }), h('span', { text: T.blurb }));
    })),
    panel('Standings', null, h('ol', { id: 'board', class: 'board' })));
}

function buildPlay() {
  const r = S.room;
  return h('section', { class: 'play' }, topBar(),
    h('div', { class: 'hud' },
      h('div', { class: 'hudbox' }, h('span', { text: 'Depth' }), h('b', { id: 'hud-depth', text: '0m' })),
      h('div', { class: 'pipwrap' }, h('div', { class: 'pips', id: 'pips' }), h('span', { id: 'pipnote' })),
      h('div', { class: 'hudbox right' }, h('span', { text: 'Score' }), h('b', { id: 'hud-score', text: '0' }))),
    h('div', { class: 'split' },
      h('div', { class: 'main' }, h('div', { id: 'stage', class: 'stage' }), panel('Explorers', null, h('ol', { id: 'board', class: 'board' }))),
      h('aside', null, gaugeEl())));
}
function promptCard() {
  const r = S.room, d = diveState(), T = TOPICS[r.topic] || { name: '?' };
  return h('div', { class: 'panel topic' },
    h('p', { class: 'eyebrow pinkish', text: r.fixed ? 'Prompt ' + r.round + ' of ' + r.rounds : 'Answer ' + Math.min(d.i + 1, r.dives || 5) + ' of ' + (r.dives || 5) }),
    h('h2', { text: T.name }),
    h('p', { class: 'note', text: '▼ rarer answers drop deeper ▼' }));
}
function renderDive() {
  const st = $('stage'); if (!st) return;
  const r = S.room, d = diveState(), K = r.dives || 5;
  let kids;
  if (d.stage === 'wait') kids = [promptCard(), h('p', { id: 'clock', class: 'pill' })];
  else if (d.stage === 'ask') kids = [promptCard(),
    h('form', { class: 'ans', onsubmit: submit },
      h('div', { id: 'ring', class: 'ring', 'aria-hidden': 'true' }),
      h('div', { class: 'field' },
        h('input', { id: 'answer', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'send', placeholder: 'type one answer…', 'aria-label': 'Your answer', oninput: e => window.__fx && window.__fx.type(e.target, e) }),
        h('div', { class: 'air', 'aria-hidden': 'true' }, h('div', { id: 'airbar' }))),
      h('button', { id: 'send', class: 'pink', text: 'Drop' }),
      h('button', { id: 'skip', class: 'small skip', type: 'button', text: 'Skip', title: 'Give up this answer for 0 points and move on', onclick: skipAnswer })),
    h('div', { id: 'fb', class: 'fb', role: 'status' })];
  else if (d.stage === 'sink') return;
  else if (d.stage === 'landed') {
    const hit = d.hit, last = r.fixed ? r.round >= r.rounds : d.i >= K, btn = h('button', { class: 'go', type: 'button', onclick: advance, text: last ? '▲ Climb out ▲' : '▼ Descend ▼' });
    if (hit) {
      const T = TIERS[hit.tier];
      // an Obscura: your companion leaves the forest and perches on the card, gold, with a soft halo behind it
      const pal = window.__pal || { art: 'krill', color: '#ff7a45' };
      window.__perched = hit.tier === 4;
      kids = [h('div', { class: 'landed t-' + T.key }, hit.tier === 4 ? h('div', { class: 'perch' }, icon(pal.art, '#ffc23a', 84, 'bigicon perched')) : tierIcon(hit.tier, 72, 'bigicon'),
        h('h2', { class: 'tname', 'aria-label': hit.tier === 4 ? 'Pure Obscura' : T.name, style: '--n:' + (hit.tier === 4 ? 12 : T.name.length) }, [...(hit.tier === 4 ? 'Pure Obscura' : T.name)].map((ch, i) => h('span', { 'aria-hidden': 'true', style: 'animation-delay:' + ((hit.tier === 4 && !SET.low ? 3.05 : 0.28) + i * 0.055).toFixed(3) + 's', text: ch === ' ' ? '\u00a0' : ch }))),
        h('p', { class: 'tans', text: '“' + hit.name + '”' }),
        h('p', { class: 'tpts' }, h('b', { class: 'ptsup', 'data-pts': String(T.pts), text: '+0 PTS' }), ' · drop ' + fmt(T.pts * M_PER_PT) + 'm'),
        h('p', { class: 'note', text: hit.fact || T.line }), btn)];
      // what has this player done so far this game?
      const all = Object.keys(S.mine.rounds).sort((a, b) => a - b).flatMap(k2 => S.mine.rounds[k2].a).filter(x => x[1] >= 0), before = all.slice(0, -1);
      let streak = 0; for (let q = all.length - 1; q >= 0 && all[q][1] >= 2; q--) streak++;
      const best = before.length > 0 && hit.tier >= 1 && before.every(x => x[1] < hit.tier);
      const tags = [best && 'your deepest find yet', streak >= 2 && streak + ' rare finds in a row'].filter(Boolean);
      if (tags.length) { kids[0].insertBefore(h('p', { class: 'badges' }, tags.map(tx => h('span', { text: tx }))), kids[0].children[1]); setTimeout(() => snd('best'), 650); }
      // the points leave the card and land in the score
      const sc = $('hud-score');
      const nL = hit.tier === 4 ? 12 : T.name.length, tUp = hit.tier === 4 && !SET.low ? 3300 : 150;
      // the points tick up on the card, then lift off and land in the score
      setTimeout(() => {
        const b = document.querySelector('.landed .ptsup'); if (!b) return;
        const t0 = performance.now(), ms = 380 + hit.tier * 90;
        const step = now => { if (!b.isConnected) return; const o = Math.min((now - t0) / ms, 1); b.textContent = '+' + Math.round(T.pts * (1 - Math.pow(1 - o, 3))) + ' PTS'; if (o < 1) requestAnimationFrame(step); else { b.classList.add('pop'); snd('ding'); } };
        requestAnimationFrame(step);
        setTimeout(() => { if (b.isConnected) b.textContent = '+' + T.pts + ' PTS'; }, ms + 400);
      }, tUp);
      setTimeout(() => {
        const b = document.querySelector('.landed .ptsup'); if (!sc || !sc.isConnected || !b) return;
        const rc = sc.getBoundingClientRect(), rb = b.getBoundingClientRect(), x0 = rb.left + rb.width / 2, y0 = rb.top + rb.height / 2;
        const fly = h('span', { class: 'fly t-' + T.key, 'aria-hidden': 'true', text: '+' + T.pts, style: 'left:' + Math.round(x0) + 'px;top:' + Math.round(y0) + 'px;--dx:' + Math.round(rc.left + rc.width / 2 - x0) + 'px;--dy:' + Math.round(rc.top + rc.height / 2 - y0) + 'px' });
        document.body.append(fly); setTimeout(() => { fly.remove(); if (sc.isConnected) restart(sc, 'slam'); }, 820);
      }, tUp + 750);
      
    } else kids = [h('div', { class: 'landed' }, h('h2', { class: 'tname miss', text: d.skipped ? 'Skipped' : 'Lost your grip' }), h('p', { class: 'tans', text: '—' }),
      h('p', { class: 'tpts', text: '+0 PTS' }), h('p', { class: 'note', text: d.skipped ? 'on to the next one.' : 'the clock beat you to it.' }), btn)];
  } else kids = [h('div', { class: 'landed' }, h('h2', { class: 'tname miss', text: 'Descent complete' }),
    h('ul', { class: 'chips', style: 'justify-content:center' }, roundOf(S.mine, r.round).a.filter(x => x[1] >= 0).map(([n, t]) => chip(n, t, '+' + TIERS[t].pts))),
    h('p', { class: 'note', text: 'waiting for the other explorers to climb out.' }))];
  st.replaceChildren(...kids);
  const f = st.querySelector('#answer, button.go'); if (f) f.focus();
}
function refreshPlay() {
  const r = S.room, d = diveState(), K = r.dives || 5, mine = roundOf(S.mine, r.round);
  if (!$('stage').firstChild) renderDive();
  const shown = d.stage === 'sink' ? mine.a.slice(0, -1) : mine.a;
  $('pips').replaceChildren(...Array.from({ length: K }, (_, i) => h('i', { class: i < shown.length ? 'done' : i === shown.length ? 'now' : '', style: i < shown.length && shown[i][1] >= 0 ? 'background:' + TIERS[shown[i][1]].color : null })));
  if (r.fixed) {
    // a run shows one pip per prompt, coloured by how each landed
    $('pips').replaceChildren(...Array.from({ length: r.rounds }, (_, i) => { const a = roundOf(S.mine, i + 1).a[0], done = a && (i + 1 < r.round || d.stage !== 'sink'); return h('i', { class: done ? 'done' : i + 1 === r.round ? 'now' : '', style: done ? 'background:' + (a[1] >= 0 ? TIERS[a[1]].color : '#3a4a3e') : null }); }));
  }
  $('pipnote').textContent = 'prompt ' + r.round + ' of ' + r.rounds;
  const held = d.stage === 'sink' && d.hit ? TIERS[d.hit.tier].pts : 0, pts = total(S.mine) - held;
  const sc = $('hud-score');
  if (sc._to !== pts) {
    const from = sc._to == null ? pts : Number(sc.textContent) || 0, t0 = performance.now() + (sc._to == null ? 0 : d.stage === 'landed' && d.hit ? 1150 : 520), big = d.hit && d.hit.tier === 4, ms = big ? 1300 : 600 + (d.hit ? d.hit.tier * 120 : 0);
    sc._to = pts;
    const step = now => { if (sc._to !== pts || !sc.isConnected) return; if (now < t0) return requestAnimationFrame(step); const o = Math.min((now - t0) / ms, 1), a = 1 - Math.pow(1 - o, 4); sc.textContent = String(Math.round(from + (pts - from) * (big && a < 0.9 ? 1.06 * a : a))); if (o < 1) { if (pts !== from && now - (sc._tk || 0) > 55) { sc._tk = now; snd('tally', o); } requestAnimationFrame(step); } else { sc.textContent = String(pts); if (pts !== from) { restart(sc, 'slam'); snd('ding'); } } };
    requestAnimationFrame(step);
    setTimeout(() => { if (sc.isConnected && sc._to === pts) sc.textContent = String(pts); }, Math.max(0, t0 - performance.now()) + ms + 400);
  }
  $('board').replaceChildren(...boardRows(true));
  window.__depth = total(S.mine) * M_PER_PT;
  rivalWatch();
}
function buildReveal() {
  const r = S.room, T = TOPICS[r.topic] || { name: '?' };
  return h('section', { class: 'reveal' }, topBar(),
    h('p', { class: 'eyebrow', text: 'Round ' + r.round + ' of ' + r.rounds + ' · ' + T.name }),
    h('h2', { text: 'Back at camp' }),
    h('div', { class: 'split' },
      h('div', { class: 'main' },
        h('div', { id: 'results', class: 'results' }),
        h('div', { id: 'missed' }),
        h('div', { id: 'allans' }, h('button', { class: 'small', type: 'button', text: 'See every answer', onclick: e => { const box = $('allans'), open = box.querySelector('.browser'); if (open) { open.remove(); e.currentTarget.textContent = 'See every answer'; } else if (TOPICS[S.room.topic]) { const mineA = roundOf(S.mine, S.room.round).a.filter(x => x[1] >= 0).map(x => x[0]); box.append(answerBrowser(TOPICS[S.room.topic], mineA[0] || null)); e.currentTarget.textContent = 'Hide answers'; } } })),
        h('button', { id: 'next', class: 'go', type: 'button', onclick: next, hidden: !isHost(), text: r.round < r.rounds ? '▼ Next round ▼' : '▼ Final depths ▼' }),
        !isHost() && h('p', { class: 'note', id: 'waithost', style: 'text-align:center', text: 'Waiting for the host to continue.' }), emoteBar()),
      h('aside', null, gaugeEl())));
}
function refreshReveal() {
  const r = S.room, T = TOPICS[r.topic];
  const ps = ordered().sort((a, b) => roundOf(b, r.round).pts - roundOf(a, r.round).pts), multi = ps.length > 1;
  const saidN = {}; ps.forEach(p => roundOf(p, r.round).a.forEach(x => { if (x[1] >= 0) saidN[x[0]] = (saidN[x[0]] || 0) + 1; }));
  const topPts = ps[0] ? roundOf(ps[0], r.round).pts : 0, win = multi && topPts > 0 && (!ps[1] || roundOf(ps[1], r.round).pts < topPts);
  $('results').replaceChildren(...ps.map((p, pi) => {
    const rd = roundOf(p, r.round), won = win && pi === 0;
    return h('article', { class: 'panel haul' + (p.id === S.me.id ? ' me' : '') + (won ? ' win' : '') },
      h('header', null, h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }),
        h('strong', { text: nameOf(p) }), won && h('i', { class: 'crown', text: '♛ round' }),
        h('span', { class: 'depth', text: '+' + fmt(rd.pts * M_PER_PT) + 'm · ' + rd.pts + ' pts' })),
      rd.a.some(x => x[1] >= 0) ? h('ul', { class: 'chips' }, rd.a.filter(x => x[1] >= 0).sort((a, b) => b[1] - a[1]).map(([n, t], i) => { const c = chip(n, t, '+' + TIERS[t].pts, i); if (multi && saidN[n] === 1) { c.classList.add('solo'); c.title = 'nobody else said it'; } return c; }))
                  : h('p', { class: 'note', text: 'Found nothing.' }));
  }));
  if (!T) return;
  const said = new Set(); ps.forEach(p => roundOf(p, r.round).a.forEach(x => said.add(x[0])));
  const star = T.star, found = said.has(star.name);
  $('missed').replaceChildren(h('div', { class: 'panel star' },
    h('div', { class: 'ph' }, h('span', { text: found ? 'The Obscura · found' : 'The Obscura · nobody found it' })),
    h('p', { class: 'starname' }, tierIcon(4, 32), h('span', { text: star.name }), h('b', { text: '+100' })),
    star.fact && h('p', { class: 'note', text: star.fact })));
}

function buildFinal() {
  if (S.room.fixed) return buildRunFinal();
  return h('section', { class: 'final' }, topBar(),
    h('p', { class: 'eyebrow', text: 'Expedition complete' }),
    h('h2', { id: 'winner' }),
    h('div', { class: 'split' },
      h('div', { class: 'main' },
        h('div', { id: 'podium', class: 'podium' }),
        panel('Final depths', null, h('ol', { id: 'ranks', class: 'ranks' })),
        h('div', { id: 'awards' }),
        h('div', { id: 'rundown' }),
        isHost() ? h('button', { class: 'go', type: 'button', onclick: again, text: S.mode === 'solo' ? '▼ Drop again ▼' : '▼ Back to the lobby ▼' })
                 : h('p', { class: 'note', style: 'text-align:center', text: 'The host can start another expedition.' }), emoteBar()),
      h('aside', null, gaugeEl())));
}
// The full rundown: everyone's game at a glance, then every round answer by answer.
function rundown(ps) {
  const box = $('rundown'); if (!box) return;
  const mine = p => p.g === S.room.g && p.rounds ? p.rounds : {};
  const ks = [...new Set(ps.flatMap(p => Object.keys(mine(p))))].map(Number).filter(k => k > 0).sort((a, b) => a - b);
  if (!ks.length) return box.replaceChildren();
  const multi = ps.length > 1, used = S.room.used || [], last = Math.max(S.room.round || 0, ...ks);
  const topicAt = k => ps.map(p => roundOf(p, k).tp).find(Boolean) || used[used.length - 1 - (last - k)];
  const said = {}; ps.forEach(p => ks.forEach(k => roundOf(p, k).a.forEach(x => { if (x[1] >= 0) said[k + '|' + x[0]] = (said[k + '|' + x[0]] || 0) + 1; })));
  const secs = v => v == null ? '' : (v < 10 ? v.toFixed(1) : Math.round(v)) + 's';
  const pill = (txt, cls) => h('span', { class: 'rdpill' + (cls ? ' ' + cls : ''), text: txt });
  // per-player totals
  const stat = p => {
    const all = ks.flatMap(k => roundOf(p, k).a.map(x => ({ n: x[0], t: x[1], s: x[2], k })));
    const hits = all.filter(x => x.t >= 0), times = hits.map(x => x.s).filter(v => v != null);
    const tiers = [0, 1, 2, 3, 4].map(t => hits.filter(x => x.t === t).length);
    const best = hits.reduce((m, x) => (!m || x.t > m.t || (x.t === m.t && (x.s || 99) < (m.s || 99)) ? x : m), null);
    const rounds = ks.map(k => ({ k, pts: roundOf(p, k).pts })), br = rounds.reduce((m, x) => x.pts > m.pts ? x : m, { pts: -1 });
    const fast = hits.filter(x => x.s != null).reduce((m, x) => (!m || x.s < m.s ? x : m), null);
    return { p, pts: total(p), hits: hits.length, tries: all.length, tiers, best, br, fast,
      avg: times.length ? times.reduce((a, b) => a + b, 0) / times.length : null,
      solo: hits.filter(x => said[x.k + '|' + x.n] === 1).length,
      skips: all.filter(x => x.t === -2).length, outs: all.filter(x => x.t === -1).length,
      wrong: ks.reduce((s, k) => s + ((roundOf(p, k).w || []).length), 0) };
  };
  const st = ps.map(stat);
  const card = s => h('div', { class: 'rdcard' + (s.p.id === S.me.id ? ' me' : '') },
    h('div', { class: 'rdwho' }, h('span', { class: 'dot', style: 'background:' + colorOf(s.p.id) }), h('strong', { text: nameOf(s.p) + (s.p.id === S.me.id ? ' (you)' : '') }), h('span', { class: 'rdpts', text: fmt(s.pts) + ' pts' })),
    h('div', { class: 'rdtiers' }, ...[4, 3, 2, 1, 0].map(t => h('span', { class: 'rdtier t-' + TIERS[t].key + (s.tiers[t] ? '' : ' none'), title: TIERS[t].name }, tierIcon(t, 18), h('b', { text: '×' + s.tiers[t] })))),
    h('dl', { class: 'rdstats' },
      ...[['Found', s.hits + ' of ' + s.tries + ' tries'],
        ['Hit rate', s.tries ? Math.round(s.hits / s.tries * 100) + '%' : '—'],
        multi && ['Nobody else said', String(s.solo)],
        ['Wrong guesses', String(s.wrong)],
        ['Skipped', String(s.skips)], ['Ran out of time', String(s.outs)],
        ['Avg answer time', s.avg == null ? '—' : secs(s.avg)],
        ['Fastest', s.fast ? '“' + s.fast.n + '” in ' + secs(s.fast.s) : '—'],
        ['Rarest find', s.best ? '“' + s.best.n + '” · ' + (s.best.t === 4 ? 'Obscura' : TIERS[s.best.t].name) : '—'],
        ['Best round', s.br.pts > 0 ? 'Round ' + s.br.k + ' · ' + s.br.pts + ' pts' : '—']].filter(Boolean)
        .flatMap(([a, b]) => [h('dt', { text: a }), h('dd', { text: b })])));
  // round by round
  const round = k => {
    const tp = topicAt(k), T = tp && TOPICS[tp];
    const rows = ps.map(p => ({ p, rd: roundOf(p, k) })).sort((a, b) => b.rd.pts - a.rd.pts);
    const top = rows[0] && rows[0].rd.pts, won = multi && top > 0 && rows.filter(x => x.rd.pts === top).length === 1;
    const saidHere = new Set(); rows.forEach(x => x.rd.a.forEach(y => { if (y[1] >= 0) saidHere.add(y[0]); }));
    const obs = T ? T.list.filter(e => e.tier === 4) : [];
    const popular = T ? T.list.filter(e => e.tier === 0 && !saidHere.has(e.name)).slice(0, 6) : [];
    const counts = {}; rows.forEach(x => x.rd.a.forEach(y => { if (y[1] >= 0) counts[y[0]] = (counts[y[0]] || 0) + 1; }));
    const crowd = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return h('div', { class: 'rd' },
      h('div', { class: 'rdhead' }, h('p', { class: 'eyebrow', text: 'Round ' + k }), T && h('h3', { text: T.name }), T && T.blurb && h('p', { class: 'note', text: T.blurb })),
      ...rows.map(({ p, rd }, i) => {
        const good = rd.a.filter(x => x[1] >= 0).sort((a, b) => b[1] - a[1]);
        const sk = rd.a.filter(x => x[1] === -2).length, out = rd.a.filter(x => x[1] === -1).length, w = rd.w || [];
        return h('div', { class: 'rdrow' + (p.id === S.me.id ? ' me' : '') },
          h('div', { class: 'rdwho' }, h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }), h('strong', { text: nameOf(p) }), won && i === 0 ? h('i', { class: 'crown', text: '♛ round' }) : null, h('span', { class: 'rdpts', text: rd.pts + ' pts' })),
          h('ul', { class: 'chips' }, ...good.map(([n, t, s]) => { const c = chip(n, t, '+' + TIERS[t].pts + (s != null ? ' · ' + secs(s) : '')); if (multi && said[k + '|' + n] === 1) { c.classList.add('solo'); c.title = 'nobody else said it'; } return c; }),
            !rd.a.length ? h('li', { class: 'rdmiss', text: 'no answers' }) : null),
          (sk || out || w.length) ? h('div', { class: 'rdmeta' },
            sk > 0 ? pill(sk + ' skipped') : null, out > 0 ? pill(out + ' ran out of time') : null,
            w.length > 0 ? (p.id === S.me.id ? pill(w.length + ' wrong: ' + w.map(x => '“' + x + '”').join(', '), 'wrong') : pill(w.length + ' wrong ' + (w.length === 1 ? 'guess' : 'guesses'), 'wrong')) : null) : null);
      }),
      h('div', { class: 'rdfoot' },
        obs.length ? h('p', null, h('span', { class: 'k', text: obs.length > 1 ? 'Obscuras' : 'Obscura' }), ...obs.map(e => { const who = rows.filter(x => x.rd.a.some(y => y[0] === e.name)).map(x => nameOf(x.p)); return h('span', { class: 'rdob' + (who.length ? ' got' : '') }, tierIcon(4, 16), h('b', { text: e.name }), h('small', { text: who.length ? ' found by ' + who.join(', ') : ' nobody' })); })) : null,
        multi && crowd && crowd[1] > 1 ? h('p', null, h('span', { class: 'k', text: 'Most said' }), h('span', { text: '“' + crowd[0] + '” · ' + crowd[1] + ' players' })) : null,
        popular.length ? h('p', null, h('span', { class: 'k', text: 'Easy ones nobody said' }), h('span', { text: popular.map(e => e.name).join(', ') })) : null,
        T && obs[0] && obs[0].fact ? h('p', { class: 'note', text: obs[0].name + ': ' + obs[0].fact }) : null));
  };
  box.replaceChildren(
    panel('The rundown', null, h('div', { class: 'rdcards' }, ...st.map(card))),
    panel('Every answer, round by round', null, h('div', { class: 'rundown' }, ...ks.map(round))));
}
function refreshFinal() {
  if (S.room.fixed) return;
  const ps = ordered().sort((a, b) => total(b) - total(a));
  const top = ps[0];
  $('winner').textContent = !top ? '' : ps.length === 1 ? 'You reached ' + fmt(depthOf(top)) + ' m'
    : (ps[1] && total(ps[1]) === total(top)) ? 'A tie at ' + fmt(total(top)) + ' pts' : nameOf(top) + ' went deepest';
  $('ranks').replaceChildren(...ps.map(p => {
    const n = (p.g === S.room.g && p.rounds) ? Object.values(p.rounds).reduce((s, r) => s + r.a.filter(x => x[1] >= 0).length, 0) : 0;
    return h('li', { class: p.id === S.me.id ? 'me' : '' },
      h('span', { class: 'dot', style: 'background:' + colorOf(p.id) }),
      h('span', { class: 'who', text: nameOf(p) + (p.id === S.me.id ? ' (you)' : '') }),
      h('span', { class: 'count', text: n + ' answers · reached the ' + zoneOf(depthOf(p)).toLowerCase() }),
      h('span', { class: 'depth', text: ps.length > 1 ? fmt(total(p)) + ' pts' : fmt(depthOf(p)) + ' m' }));
  }));
  rundown(ps);
  // a podium and a few awards when there was someone to beat
  if (ps.length < 2) { $('podium').replaceChildren(); $('awards').replaceChildren(); return; }
  const place = (p, k) => p && h('div', { class: 'pl p' + (k + 1), style: '--mc:' + MEDAL[k] }, icon('krill', colorOf(p.id), k === 0 ? 56 : 40), h('span', { class: 'who', text: nameOf(p) }), h('span', { class: 'd', text: fmt(total(p)) + ' pts' }), h('div', { class: 'block', text: String(k + 1) }));
  $('podium').replaceChildren(...[place(ps[1], 1), place(ps[0], 0), place(ps[2], 2)].filter(Boolean));
  const all = p => (p.g === S.room.g && p.rounds) ? Object.entries(p.rounds).flatMap(([k, rd]) => rd.a.filter(x => x[1] >= 0).map(x => ({ n: x[0], t: x[1], r: k }))) : [];
  const said = {}; ps.forEach(p => all(p).forEach(x => { const key = x.r + '|' + x.n; said[key] = (said[key] || 0) + 1; }));
  const bestOf = (score) => { let b = null, v = 0; for (const p of ps) { const s = score(p); if (s > v) { v = s; b = p; } } return b && { p: b, v }; };
  const deep = bestOf(p => Math.max(0, ...all(p).map(x => x.t + 1))), deepA = deep && all(deep.p).reduce((m, x) => (x.t > m.t ? x : m), { t: -1 });
  const hunter = bestOf(p => all(p).filter(x => x.t >= 2).length), wolf = bestOf(p => all(p).filter(x => said[x.r + '|' + x.n] === 1).length);
  const row = (k, tier, who, what) => h('li', null, tierIcon(tier, 22), h('span', { class: 'k', text: k }), h('strong', { text: nameOf(who.p) }), h('span', { class: 'note', text: what }));
  $('awards').replaceChildren(panel('Awards', null, h('ul', { class: 'awards' },
    deep && row('Deepest find', deepA.t, deep, '“' + deepA.n + '” · ' + (deepA.t === 4 ? 'Pure Obscura' : TIERS[deepA.t].name)),
    hunter && row('Rare hunter', 2, hunter, hunter.v + ' sloth-or-rarer finds'),
    wolf && row('Lone wolf', 3, wolf, wolf.v + ' answers nobody else said'))));
  const key = S.room.g + ':' + ps[0].id;
  if (S._fan !== key) { S._fan = key; if (total(ps[0]) > total(ps[1])) { if (ps[0].id === S.me.id) snd('fanfare'); else snd('best'); if (S.mode === 'online') setTimeout(() => champion(ps[0]), 400); } }
}

/* ---------- render loop ---------- */
const BUILD = { lobby: buildLobby, pick: buildPick, play: buildPlay, reveal: buildReveal, final: buildFinal };
const REFRESH = { lobby: refreshLobby, pick: () => $('board').replaceChildren(...boardRows(false)), play: refreshPlay, reveal: refreshReveal, final: refreshFinal };
function refresh() {
  if (!S.mode) return refreshHome();
  (REFRESH[S.room.phase] || (() => {}))();
  emoteWatch();
  refreshGauge();
  say(S.msg);
  tick();
}
function render() {
  const r = S.room;
  const key = !S.mode ? 'home' : [r.phase, r.g, r.round, S.code, isHost(), r.picker].join(':');
  if (key !== S.screen) {
    S.screen = key;
    if (S.mode && r.phase !== 'play') S.fb = null;
    const dive = !!S.mode && r.phase !== 'lobby';
    if (document.body.classList.contains('dive') !== dive) { document.body.classList.toggle('dive', dive); if (window.__sea) window.__sea(); }
    document.body.classList.toggle('trek', !!S.mode && r.phase === 'play');
    document.body.classList.toggle('run', !!S.mode && !!r.fixed);
    const scr = !S.mode ? buildHome() : (BUILD[r.phase] || buildLobby)();
    scr.classList.add('enter');
    setTimeout(() => scr.classList.remove('enter'), 1800);
    app.replaceChildren(scr);
    if (S.mode) snd(r.phase === 'play' ? 'begin' : r.phase === 'final' ? 'surface' : r.phase === 'pick' ? 'pick' : 'click');
    if (S.mode && r.phase === 'final') { const dpt = window.__depth || 0; window.__lines = null; window.__depth = 0; if (dpt > 20) window.__sink = { rise: true, to: 0, dur: Math.min(6, Math.max(2.4, dpt / 700)), start: performance.now() }; setTimeout(() => snd('fanfare'), Math.min(6, Math.max(2.4, dpt / 700)) * 1000); if (r.fixed) setTimeout(dailyStats, 50); }
    window.scrollTo(0, 0);
  }
  refresh();
}
function tick() {
  { const ni = $('nextin'); if (ni) { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), sec = Math.max(0, Math.floor((m - n) / 1000)), tx = 'next descent in ' + String(Math.floor(sec / 3600)).padStart(2, '0') + ':' + String(Math.floor(sec / 60) % 60).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); if (ni.textContent !== tx) ni.textContent = tx; } }
  const r = S.room; if (!S.mode || !r) return;
  const now = Date.now(), lag = isHost() ? 0 : 2500 + S.jitter, clock = $('clock');
  // the host closed their tab or left: the earliest remaining player takes over, so nobody is stuck in the lobby
  if (S.mode === 'online') {
    const live = ordered().filter(p => !gone(p, now));
    // only once the real player list has arrived, and never in your first moments in the room
    const hostP = S.players[r.host], hostAway = S._plOk && Date.now() - (S._joinedAt || 0) > 15000 && (!hostP || hostP.left || (hostP.seen && Date.now() - hostP.seen > 180000));
    if (live.length && hostAway && !live.some(p => p.id === r.host) && live[0].id === S.me.id) once('host:' + S.code + ':' + r.host + ':' + r.g, () => { patchRoom({ host: S.me.id }); say('The host left, so you are hosting now.'); });
  }
  if (r.phase === 'pick') {
    const left = Math.max(0, Math.ceil((r.pickEndsAt - now) / 1000));
    if (clock) clock.textContent = left ? left + ' s to choose, or the first topic is picked.' : 'Picking the first topic…';
    if (now > r.pickEndsAt + lag) once('pick:' + r.g + ':' + r.round, () => choose(r.options[0]));
  } else if (r.phase === 'play') {
    const d = diveState(), K = r.dives || 5;
    if (d.stage === 'wait') {
      const c = $('clock'), txt = String(Math.max(1, Math.min(3, Math.ceil((r.startsAt - now) / 1000))));
      if (c && c.dataset.n !== txt) { c.dataset.n = txt; c.replaceChildren('dropping · the clock starts in ', h('b', { text: txt })); restart(c.lastChild, 'pop'); snd('count'); bigCount(txt); }
      if (now >= r.startsAt) { snd('count', true); if (!d.i) bigCount('DIVE!'); if (d.i >= K) setStage('done'); else setStage('ask', r.secs * 1000); }
    } else if (d.stage === 'ask') {
      const ring = $('ring'), bar = $('airbar'), left = Math.max(0, d.until - now), f = Math.min(1, left / (r.secs * 1000)), low = left < 6000;
      if (ring) {
        const n = String(Math.ceil(left / 1000)); if (ring.textContent !== n) { ring.textContent = n; if (left < 5500 && left > 0) snd('tick'); }
        ring.style.setProperty('--f', (f * 360).toFixed(0) + 'deg');
        ring.closest('form').classList.toggle('low', low);
      }
      if (bar) { bar.style.clipPath = 'inset(0 ' + ((1 - f) * 100).toFixed(1) + '% 0 0)'; bar.classList.toggle('low', low); }
      $('edge').classList.toggle('hot', low);
      if (now > d.until) lockIn(null);
    } else if (d.stage === 'sink') {
      if (now > d.until) { setStage('landed', landedMs(d.hit)); refresh(); }
    } else if (d.stage === 'landed' && d.until) {
      // in a room the result moves on by itself, so nobody can sit on it and look answers up; the button counts down
      const go = document.querySelector('.landed .go');
      if (go) { if (!go.dataset.label) go.dataset.label = go.textContent; const left = Math.max(0, Math.ceil((d.until - now) / 1000)), tx = go.dataset.label + ' ' + left; if (go.textContent !== tx) go.textContent = tx; }
      if (now > d.until) advance();
    }
    const all = ordered().every(p => gone(p, now) || roundOf(p, r.round).a.length >= K);
    if (all && d.stage === 'done') { if (!S.allAt) S.allAt = now; } else S.allAt = 0;
    if (!r.fixed && ((S.allAt && now > S.allAt + 2500 + lag) || now > r.endsAt + lag)) once('play:' + r.g + ':' + r.round, () => patchRoom({ phase: 'reveal', revealAt: Date.now() }));
  } else if (r.phase === 'reveal') {
    $('edge').classList.remove('hot');
    const nextBtn = $('next'), wait = $('waithost');
    if (nextBtn && nextBtn.hidden && now > (r.revealAt || 0) + 20000) { nextBtn.hidden = false; if (wait) wait.textContent = 'Host gone quiet? Anyone can continue.'; }
  }
}
setInterval(tick, 250);
// players check in every 20 s; anyone silent for 70 s (tab closed, phone locked) stops holding up the room
const gone = (p, now) => p.left || (p.id !== S.me.id && p.seen && (now || Date.now()) - p.seen > 120000);
function heartbeat() { if (S.mode === 'online' && S.meRef && S.mine) { S.mine.seen = Date.now(); saveMe(); } }
setInterval(heartbeat, 20000);
const checkIn = () => { if (S.mode !== 'online') return; heartbeat(); if (S.relisten) S.relisten(); };
addEventListener('visibilitychange', () => { if (!document.hidden) checkIn(); });
addEventListener('online', checkIn);

/* ---------- the descent: down through a rainforest, from the treetops to the caves under its roots ---------- */
// Drawn every animation frame. Branches, vines and ledges are generated from their depth,
// so the forest is endless and the same depth always looks the same.
(function scene() {
  const cv = $('sea'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const bloomC = $('bloom'), bloomX = bloomC && bloomC.getContext('2d'); let bloomN = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ruler = $('ruler'), over = $('tierlines'), notes = $('notes'), vig = $('vig');
  const MPS = 230, AP = innerWidth >= 1700 && innerHeight >= 1000 ? 4 : 3; // metres per screen height, CSS px per art pixel (bigger on big screens)
  const R = Math.random, mod = (a, n) => ((a % n) + n) % n, D = (a, b) => a + R() * (b - a);
  const hsh = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
  const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  const css = (c, a) => a == null ? 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')' : 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
  // the colour of the air at each depth: leaf light, green shade, dusk, then stone
  const AIR = [[0, [122, 204, 132]], [150, [84, 172, 112]], [400, [52, 130, 92]], [700, [36, 104, 84]], [1050, [30, 82, 66]], [1500, [44, 66, 36]],
    [1900, [44, 30, 20]], [2700, [36, 26, 20]], [2950, [16, 44, 58]], [3600, [12, 36, 50]], [3850, [8, 30, 46]], [4600, [8, 26, 40]], [4850, [40, 22, 64]], [5700, [34, 18, 58]],
    [5950, [52, 44, 24]], [6900, [44, 38, 20]], [7150, [50, 16, 46]], [8300, [40, 12, 38]], [8550, [72, 20, 10]], [9900, [86, 24, 8]], [10150, [58, 42, 14]], [12000, [70, 52, 18]]];
  function air(m) {
    if (m <= 0) return AIR[0][1];
    for (let i = 1; i < AIR.length; i++) if (m <= AIR[i][0]) { const a = AIR[i - 1], b = AIR[i]; return lerp3(a[1], b[1], (m - a[0]) / (b[0] - a[0])); }
    return AIR[AIR.length - 1][1];
  }
  const FLOOR = 1500; // below this you are under the forest, falling through one world after another
  const NOTES = [[60, 'the canopy closes overhead'], [150, 'THE UNDERSTORY', 1], [260, 'howler monkeys call from here'], [420, 'barely any sunlight gets this far'], [600, 'THE DEEP SHADE', 1], [880, 'jaguar country'], [1180, 'nothing down here has seen the sky'],
    [1500, 'THE FOREST FLOOR', 1], [1750, 'roots drop away into the dark'], [2000, 'THE ROOT CAVES', 1], [2400, 'water is running somewhere below'], [2800, 'THE UNDERGROUND RIVER', 1], [3250, 'the current pulls everything down'],
    [3700, 'THE GLOWWORM GROTTO', 1], [4200, 'a ceiling of living stars'], [4700, 'THE CRYSTAL CAVERNS', 1], [5250, 'the walls hum as you pass'], [5800, 'THE SUNKEN TEMPLE', 1], [6400, 'someone built this, long ago'],
    [7000, 'THE FUNGAL DEEP', 1], [7700, 'the spores glow where they settle'], [8400, 'THE MAGMA VEINS', 1], [9200, 'the rock is warm to the touch'], [10000, 'THE OBSCURA', 1], [11000, 'no one has been deeper']];
  let W = 0, H = 0, DPR = 1, mpp = 1, AY = 0, cam = 0, camS = 0, vel = 0, time = 0, last = 0, linesId = null;
  let leavesA = [], leavesB = [], roam = [], parts = [], clouds = [], puffs = [], flash = 0, flashC = '#fff', lastCrank = 0, lastTrail = 0;
  let orbit = null, burstT = 0, rings = [], sweeps = [], punch = 0, hold = 0, zoneAt = -1, ambT = 0;
  const frog = { x: -80, y: 200, rot: 0, emit: 0, hop: 0 };
  // sparks are more saturated than the tier labels, so bursts read against the forest
  const SPARK = ['#8fa3c4', '#4de3ff', '#ff5252', '#9d7bff', '#ffd166'];
  const sn = v => Math.round(v * DPR) / DPR, toM = y => camS + (y - AY) * mpp, yOf = m => AY + (m - camS) / mpp;
  const near = (m, pad) => { const y = yOf(m); return y > -pad && y < H + pad; };
  // how the falling answer sways: common answers flutter down like a leaf, rarer ones shiver and steady
  const wobble = (p, tier) => tier === 0 ? 36 * Math.sin(7 * p) * (1 - 0.25 * p) : tier === 4 ? Math.sin(24 * p) * (1 - p) * 26 : Math.sin(16 * p) * (1 - p) * 14;
  const tinted = {};
  const img = (art, color) => { const k = art + color; if (!tinted[k]) { const im = new Image(); im.src = sprite(art, color); tinted[k] = im; } return tinted[k]; };
  // ---- pixel art made once and reused ----
  const BUCKETS = [0, 45, 110, 225, 375, 600, 900, 1240, 1575], cache = {};
  const bucketOf = m => { let b = 0; for (let i = 0; i < BUCKETS.length; i++) if (m >= BUCKETS[i]) b = i; return b; };
  const rng = seed => { let v = (seed * 9301 + 49297) % 233280; return () => (v = (v * 9301 + 49297) % 233280) / 233280; };
  // a mass of leaves: lit from above, shaded below, ragged at the edge, with a few hanging tips
  function clump(v, b, dark) {
    const key = 'c' + v + '_' + b + '_' + dark; if (cache[key]) return cache[key];
    const S = dark > 0.6 ? 1.7 : 1, w = Math.round(46 * S), hh = Math.round(34 * S), c = document.createElement('canvas'); c.width = w; c.height = hh;
    const g = c.getContext('2d'), r = rng(v + 1 + (S > 1 ? 40 : 0)), depth = BUCKETS[b], light = Math.max(0, 1 - depth / 1500), base = lerp3(air(depth), [2, 8, 5], dark);
    const tones = [lerp3(base, [1, 6, 3], 0.5), lerp3(base, [30, 124, 58], 0.4 * light + 0.05), lerp3(base, [70, 180, 84], 0.55 * light + 0.07), lerp3(base, [176, 236, 132], 0.6 * light + 0.05)].map(t => css(t));
    const blobs = []; for (let i = 0; i < (S > 1 ? 13 : 7); i++) blobs.push([(8 + r() * 30) * S, (9 + r() * 11) * S, (5.5 + r() * 7) * (S > 1 ? 1.3 : 1)]);
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
      let inside = false, top = 1;
      for (const [bx, by, br] of blobs) { const dx = x - bx, dy = (y - by) * 1.15; if (dx * dx + dy * dy < br * br) { inside = true; top = Math.min(top, (dy + br) / (2 * br)); } }
      const n = r(); if (!inside) continue;
      let t = top < 0.26 ? 3 : top < 0.52 ? 2 : top < 0.8 ? 1 : 0;
      if (t === 3 && n < 0.5) t = 2; else if (t === 2 && n < 0.24) t = 1; else if (t === 1 && n < 0.2) t = 0; else if (t === 0 && n < 0.1) t = 1;
      g.fillStyle = tones[t]; g.fillRect(x, y, 1, 1);
    }
    g.fillStyle = tones[0];
    for (let i = 0; i < 10 * S; i++) { const x = Math.round((6 + r() * 34) * S), y0 = Math.round((17 + r() * 6) * S), L = 2 + (r() * 7 * S | 0); g.fillRect(x, y0, 1, L); if (L > 3) g.fillRect(x + (i % 2 ? 1 : -1), y0 + L - 2, 1, 2); }
    return cache[key] = c;
  }
  function drawClump(v, depth, dark, x, y, scale) {
    const b = bucketOf(depth), f = b < BUCKETS.length - 1 ? Math.min(1, Math.max(0, (depth - BUCKETS[b]) / (BUCKETS[b + 1] - BUCKETS[b]))) : 0;
    const a = clump(v, b, dark), w = a.width * scale, hh = a.height * scale, dx = sn(x - w / 2), dy = sn(y - hh * 0.6);
    ctx.drawImage(a, dx, dy, w, hh);
    if (f > 0.03) { ctx.globalAlpha = f; ctx.drawImage(clump(v, b + 1, dark), dx, dy, w, hh); ctx.globalAlpha = 1; }
  }
  // bark detail laid over whatever colour the trunk is at this depth
  let barkC = null, barkP = null;
  function barkTex() {
    if (barkC) return barkC;
    const c = document.createElement('canvas'); c.width = 32; c.height = 64; const g = c.getContext('2d'), r = rng(7);
    for (let i = 0; i < 52; i++) { const x = r() * 32 | 0, y = r() * 64 | 0, L = 4 + (r() * 22 | 0); g.fillStyle = r() < 0.6 ? 'rgba(0,0,0,' + (0.12 + r() * 0.22).toFixed(2) + ')' : 'rgba(255,255,255,' + (0.03 + r() * 0.05).toFixed(2) + ')'; g.fillRect(x, y, 1, L); if (y + L > 64) g.fillRect(x, 0, 1, y + L - 64); }
    for (let i = 0; i < 4; i++) { const x = 3 + (r() * 24 | 0), y = 2 + (r() * 56 | 0); g.fillStyle = 'rgba(0,0,0,0.32)'; g.fillRect(x, y, 4, 2); g.fillRect(x + 1, y - 1, 2, 4); }
    for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(96,176,92,' + (0.07 + r() * 0.13).toFixed(2) + ')'; g.fillRect(r() * 32 | 0, r() * 64 | 0, 1 + (r() * 3 | 0), 1); }
    return barkC = c;
  }
  function fillBark(x, y, w, hh, scroll, col, seed) {
    ctx.fillStyle = col; ctx.fillRect(x, y, w, hh);
    if (!barkP) barkP = ctx.createPattern(barkTex(), 'repeat');
    barkP.setTransform(new DOMMatrix([AP, 0, 0, AP, x + seed * 37, -scroll]));
    ctx.fillStyle = barkP; ctx.fillRect(x, y, w, hh);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x, y, Math.max(AP, Math.round(w * 0.16)), hh);
    ctx.fillStyle = 'rgba(0,0,0,0.26)'; ctx.fillRect(x + Math.round(w * 0.7), y, Math.ceil(w * 0.3), hh);
  }
  // a split, holed leaf for the foreground
  function bigLeaf(v) {
    const key = 'L' + v; if (cache[key]) return cache[key];
    const S = [1, 1.3, 1.6][v % 3], w = Math.round(64 * S), hh = Math.round(46 * S), c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d');
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
      const dx = (x / S - 34) / 30, dy = (y / S - 23) / 21, rr = dx * dx + dy * dy; if (rr > 1) continue;
      const a = Math.atan2(dy, dx), rad = Math.sqrt(rr), wave = Math.sin(a * (6 + v) + v * 1.7);
      if (rad > 0.42 && wave > 0.72) continue;
      if (x / S < 12 && Math.abs(y / S - 23) < 1 + (12 - x / S) * 0.35) continue;
      g.fillStyle = (Math.abs(y - hh / 2) < 1 && x / S > 10) || (rad > 0.25 && Math.abs(wave + 0.72) < 0.06) ? '#0c2e1a' : '#020a06'; g.fillRect(x, y, 1, 1);
    }
    g.fillStyle = '#020a06'; g.fillRect(0, Math.round(hh / 2) - 1, Math.round(14 * S), 2);
    return cache[key] = c;
  }
  // ---- the effects layer: everything that sparks, glows or bursts is plotted pixel by pixel ----
  // Effects are drawn into a small buffer at 2 screen pixels per dot, finer than the scenery,
  // with ordered dithering instead of smooth fades, then laid over the scene with hard edges.
  const FP = 2, BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  let fxc = null, fxg = null, fxi = null, fbuf = null, flev = null, fw = 0, fh = 0;
  function fxInit() { fw = Math.max(1, Math.ceil(W / FP) || 1); fh = Math.max(1, Math.ceil(H / FP) || 1); fxc = document.createElement('canvas'); fxc.width = fw; fxc.height = fh; fxg = fxc.getContext('2d'); fxi = fxg.createImageData(fw, fh); fbuf = new Uint32Array(fxi.data.buffer); flev = new Uint8Array(fw * fh); }
  const pack = (r, g, b) => ((255 << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0;
  const ramps = {};
  // five steps for any colour: dim, soft, pure, light, white
  function rampOf(c) {
    let r = ramps[c]; if (r) return r;
    let v; if (c[0] === '#') { const n = parseInt(c.slice(1, 7), 16); v = [n >> 16, (n >> 8) & 255, n & 255]; } else v = (c.match(/\d+/g) || [255, 255, 255]).slice(0, 3).map(Number);
    const m = (t, f) => pack(v[0] + (t - v[0]) * f, v[1] + (t - v[1]) * f, v[2] + (t - v[2]) * f);
    return ramps[c] = [m(0, 0.55), m(0, 0.25), m(0, 0), m(255, 0.5), pack(255, 255, 255)];
  }
  const DARK = [pack(18, 4, 12), pack(38, 8, 24), pack(64, 12, 36), pack(90, 20, 50), pack(120, 30, 70)];
  function pset(x, y, col, lv) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= fw || y >= fh) return; const i = y * fw + x; if (lv < flev[i]) return; flev[i] = lv; fbuf[i] = col; }
  function prect(x, y, w, hh, col, lv) { for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) pset(x + i, y + j, col, lv); }
  function pline(x0, y0, x1, y1, col, lv) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy, n = 0;
    while (n++ < 1500) { pset(x0, y0, col, lv); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  }
  // a dithered glow: bands from white at the heart to dim at the rim
  function pglow(cx, cy, r, a, ramp, top) {
    cx |= 0; cy |= 0; r = Math.max(1, r); top = top || 5;
    const x0 = Math.max(0, cx - r | 0), x1 = Math.min(fw - 1, cx + r | 0), y0 = Math.max(0, cy - r | 0), y1 = Math.min(fh - 1, cy + r | 0), ir = 1 / r;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy) * ir; if (d >= 1) continue;
      const v = (1 - d) * (1 - d) * a * top; let b = v | 0; if (v - b > BAYER[(x & 3) + ((y & 3) << 2)]) b++;
      if (b <= 0) continue; if (b > top) b = top;
      const i = y * fw + x; if (b >= flev[i]) { flev[i] = b; fbuf[i] = ramp[b - 1]; }
    }
  }
  // a shockwave: a bright leading edge with a dithered wake, breaking into arcs as it fades
  function pring(cx, cy, r, th, a, ramp, spin) {
    const n = Math.max(24, Math.ceil(r * 6.4));
    for (let k = 0; k < n; k++) {
      const ang = k / n * 6.2832; if (a < 0.6 && Math.sin(ang * 7 + spin) > a * 1.6) continue;
      const c = Math.cos(ang), s2 = Math.sin(ang);
      for (let t = 0; t < th; t++) { const x = cx + c * (r - t) | 0, y = cy + s2 * (r - t) | 0, edge = t / th; if (t > 0 && BAYER[(x & 3) + ((y & 3) << 2)] < edge * (1.3 - a)) continue; pset(x, y, ramp[t === 0 ? 4 : edge < 0.4 ? 3 : 2], t === 0 ? 6 : 5); }
    }
  }
  function fxFlush() {
    fxg.putImageData(fxi, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(fxc, 0, 0, fw * FP, fh * FP);
    if (!window.__low) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.4; ctx.drawImage(fxc, 0, 0, fw * FP, fh * FP); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    fbuf.fill(0); flev.fill(0);
  }
  const F = v => v / FP;
  function halo(x, y, r, color, alpha) { pglow(F(x), F(y), F(r), Math.min(1, alpha), rampOf(color), alpha > 0.6 ? 4 : 3); }
  function spr(art, color, x, y, size, flipX, rot) {
    const im = img(art, color); if (!im.complete) return;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (flipX) ctx.scale(-1, 1);
    ctx.drawImage(im, -size / 2, -size / 2, size, size); ctx.restore();
  }
  const fx = {
    // sparks: fly out, slow down, drift upward as you fall away from them
    burst(x, y, color, n, pow) { for (let i = 0; i < n && parts.length < 320; i++) { const a = R() * 6.283, sp = (30 + 130 * R()) * pow; parts.push({ x, m: toM(y), vx: Math.cos(a) * sp, vm: Math.sin(a) * sp * mpp * 0.5, r: 1.5 + 2.5 * R(), life: 0.6 + 0.8 * R(), t: 0, color }); } },
    // drifting motes: pollen and torn leaf, left behind above you
    bubble(x, y, r, color) { if (parts.length < 360) parts.push({ x, m: toM(y), vx: D(-8, 8), vm: -(14 + 18 * R()) * mpp, r, life: 2.2 + R() * 1.6, t: 0, mote: 1, ph: R() * 9, color: 'rgb(' + (color || '214,240,170') + ')' }); },
    // torn leaves: thrown outward, then they flutter and fall
    leaves(x, y, n, pow) { for (let i = 0; i < n && parts.length < 360; i++) { const a = R() * 6.283, sp = (60 + 220 * R()) * pow; parts.push({ x, m: toM(y), vx: Math.cos(a) * sp, vm: (Math.sin(a) * sp - 60) * mpp, r: 3 + R() * 4, life: 1.6 + R() * 1.4, t: 0, leaf: 1, rot: R() * 6.283, spin: D(4, 11) * (R() < 0.5 ? -1 : 1), ph: R() * 9, color: ['#6fbf58', '#9bd66a', '#d9c24a', '#3f8f45', '#c98a3a'][R() * 5 | 0] }); } },
    // a soft dark puff of spores
    puff(x, y, n) { for (let i = 0; i < n && puffs.length < 30; i++) { const a = R() * 6.283, sp = D(6, 60); puffs.push({ x, m: toM(y), vx: Math.cos(a) * sp, vm: Math.sin(a) * sp * mpp * 0.5, r: D(12, 44), life: D(1.2, 2.2), t: 0 }); } },
    flash(color, times, ms) { const el = $('flash'); if (!el || reduce) return; let i = 0; const go = () => { el.style.transition = 'none'; el.style.background = 'radial-gradient(circle at 50% ' + Math.round(AY) + 'px, ' + color + ' 0, ' + color + ' 12%, rgba(0,0,0,0) 78%)'; el.style.opacity = '.7'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = 'opacity ' + ms + 'ms ease-out'; el.style.opacity = '0'; })); if (++i < times) setTimeout(go, ms * 2.1); }; go(); },
    shake() { restart(app, 'shake'); },
    zap() { restart($('crt'), 'zap'); },
    // a bubble rises from the caret itself (measured, not guessed), with a tap that never machine-guns on a held key
    type(el, ev) {
      const del = ev && /^delete/.test(ev.inputType || ''), now = performance.now();
      if (now - (fx._tk || 0) > 32) { fx._tk = now; snd(del ? 'erase' : 'type', el.value.length); }
      if (del) return;
      const rc = el.getBoundingClientRect(), cs = getComputedStyle(el), m = fx._mc || (fx._mc = document.createElement('canvas').getContext('2d'));
      m.font = cs.fontSize + ' ' + cs.fontFamily;
      const upto = el.value.slice(0, el.selectionStart == null ? el.value.length : el.selectionStart), ls = parseFloat(cs.letterSpacing) || 0;
      const x = rc.left + Math.max(10, Math.min(rc.width - 14, parseFloat(cs.paddingLeft) + 2 + m.measureText(upto).width + ls * upto.length - el.scrollLeft)); fx.bubble(x + D(-3, 3), rc.top + D(4, 12), 1 + 2 * R()); if (R() < 0.3) fx.bubble(x + D(-8, 8), rc.top + D(2, 10), 1 + 1.6 * R()); },
    submit(rc, text) {
      if (false && text && !reduce) { const g = h('div', { class: 'launch', 'aria-hidden': 'true', text: text }); g.style.left = Math.round(rc.left + 16) + 'px'; g.style.top = Math.round(rc.top + rc.height / 2 - 14) + 'px'; document.body.append(g);
        const dx = W / 2 - (rc.left + 16 + g.offsetWidth / 2), dy = (AY - 24) - (rc.top + rc.height / 2 - 14);
        g.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * 0.6 + 'px,' + dy * 0.6 + 'px) scale(1.12)', opacity: 1, offset: 0.55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.7)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.3,.0,.6,1)' }).onfinish = () => g.remove(); }
      fx.zap(); snd('submit'); for (let i = 0; i < 12; i++) fx.bubble(rc.left + D(0, rc.width), rc.top + D(0, rc.height), 2 + 3 * R()); fx.burst(W / 2, AY + 60, '#7dffb0', 12, 0.6); },
    reject() { fx.zap(); snd('reject'); fx.bubble(W / 2 + D(-40, 40), H - 120, 1.2 + 1.8 * R(), '150,170,150'); fx.bubble(W / 2 + D(-40, 40), H - 130, 1.2 + 1.8 * R(), '150,170,150'); },
    miss() { fx.shake(); fx.zap(); snd('miss'); fx.flash('rgba(60,80,62,.5)', 1, 200); },
  };
  window.__fx = fx;
  function build() {
    W = innerWidth; H = innerHeight; DPR = window.__low ? 1 : Math.min(2, devicePixelRatio || 1); if (W * H * DPR * DPR > 3.4e6) DPR = Math.max(1, Math.sqrt(3.4e6 / (W * H))); mpp = MPS / H; barkP = null; fxInit();
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    const mk = (n, par) => Array.from({ length: n }, () => ({ x: R() * W, y: R() * H, par: par * (0.6 + R() * 0.8), a: 0.25 + R() * 0.5, r: 2 + R() * 3, ph: R() * 9, c: ['#6fbf58', '#9bd66a', '#d9c24a', '#3f8f45', '#c98a3a'][R() * 5 | 0] }));
    leavesA = mk(Math.round(W * H / 22000), 0.55); leavesB = mk(Math.round(W * H / 40000), 1.25);
    roam = Array.from({ length: 2 }, () => ({ x: R() * W, off: D(-180, 180), sp: D(14, 34) * (R() < 0.5 ? -1 : 1), ph: R() * 9, c: ['#ffb347', '#6fd6ff', '#ff8fd0', '#fff07a'][R() * 4 | 0] }));
    clouds = Array.from({ length: 7 }, () => ({ x: R() * (W + 200) - 100, f: 0.12 + R() * 0.5, w: 8 + Math.round(R() * 14), v: 4 + R() * 6 }));
  }
  function ensureOverlay() {
    if (!over || over.childElementCount) return;
    TIERS.forEach((t, i) => over.append(h('div', { class: 'tline t-' + t.key }, h('span', { class: 'lab' }, tierIcon(i, 16), h('span', { text: (i === 4 ? 'Pure Obscura' : t.name) + ' · ' + t.pts })))));
    over.append(h('div', { class: 'chip2' }, h('span')));
  }
  // one parallax layer of trunks: fixed columns with bark that slides past
  function trunks(z, n, w0, w1, k, dark) {
    for (let i = 0; i < n; i++) {
      const x = sn((i + 0.15 + hsh(i, k) * 0.7) / n * W), w = Math.round((w0 + hsh(i, k + 3) * w1) / AP) * AP;
      const top = Math.max(0, AY + (0 - camS * z) / mpp - 30 - hsh(i, k + 5) * 60), bot = Math.min(H, AY + (FLOOR - camS) * z / mpp + 40); // far trunks end where the forest does
      if (bot < 0 || top > H) continue;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, css(lerp3(air(camS - H * mpp * 0.3), [2, 8, 5], dark))); g.addColorStop(1, css(lerp3(air(camS + H * mpp * 0.7), [2, 8, 5], dark)));
      fillBark(x, top, w, bot - top, camS * z / mpp, g, i + k);
    }
  }
  // branches (or rock ledges, below the forest floor) reaching in from the sides
  function limbs(z, SP, k, dark, big) {
    const cz = camS * z, i0 = Math.floor((cz - AY * mpp - 120) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 120) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      const r1 = hsh(i, k), r2 = hsh(i, k + 4), r3 = hsh(i, k + 8), dep = (i + r1 * 0.6) * SP, y = sn(AY + (dep - cz) / mpp);
      const real = dep / z, under = real > FLOOR, light = Math.max(0, 1 - real / 1300), left = r2 < 0.5, bio = biomeOf(real);
      const base = lerp3(air(real), under ? rockAt(real) : [2, 8, 5], dark), col = css(base), len = (0.16 + r3 * 0.3) * W * big, th = Math.round((7 + r1 * 9) * big / AP) * AP;
      const x0 = left ? 0 : W - len, tip = left ? len : W - len;
      if (under) {
        // a ledge of rock with stalactites and hanging roots
        ctx.fillStyle = col; ctx.fillRect(x0, y, len, th * 2);
        for (let q = 0; q < 6; q++) { const sx = x0 + hsh(i * 9 + q, k) * (len - 12), sl = (8 + hsh(i * 9 + q, k + 2) * 34) * big; ctx.beginPath(); ctx.moveTo(sx, y + th * 2 - 1); ctx.lineTo(sx + 9 * big, y + th * 2 - 1); ctx.lineTo(sx + 4.5 * big, y + th * 2 + sl); ctx.closePath(); ctx.fill(); }
        const glow = 0.45 + 0.35 * Math.sin(time * 1.6 + i);
        ledgeDecor(bio.kind, x0, y, len, th, big, i, k, dark, base);
        for (let q = 0; q < 5; q++) { const gx = x0 + hsh(i * 5 + q, k + 6) * len, c = q % 2 ? bio.glow.join(',') : lerp3(bio.glow, [255, 255, 255], 0.4).map(v => v | 0).join(','); halo(sn(gx) + 1, y - 5, 20, 'rgb(' + c + ')', glow * 0.55); ctx.fillStyle = 'rgba(' + c + ',' + glow.toFixed(3) + ')'; ctx.fillRect(sn(gx), y - AP * 2, AP, AP * 2); ctx.fillRect(sn(gx) - AP, y - AP * 3, AP * 3, AP); }
      } else {
        // the limb, drooping a little toward its tip
        ctx.fillStyle = col;
        for (let q = 0; q < 6; q++) { const sx = left ? len * q / 6 : W - len * (q + 1) / 6, dy = Math.round((left ? q : 5 - q) * (r3 - 0.4) * 5 / AP) * AP; ctx.fillRect(sn(sx), y + dy, len / 6 + 1, Math.max(AP, th - (left ? q : 5 - q) * AP * 0.5)); }
        // epiphyte
        ctx.fillStyle = css(lerp3(base, [220, 90, 60], 0.35 * light + 0.05));
        const ex = left ? len * 0.45 : W - len * 0.45; for (let f = -2; f <= 2; f++) ctx.fillRect(sn(ex + f * AP * 2), y - AP * (3 - Math.abs(f)), AP, AP * (3 - Math.abs(f)));
        // leaves along it
        const sway = Math.sin(time * 0.6 + i) * 3;
        for (let q = 0; q < 5; q++) { const lx = left ? len * (0.18 + q * 0.2) : W - len * (0.18 + q * 0.2); drawClump((i * 3 + q) % 6, real, dark, lx + sway * (0.6 + q * 0.15), y + (q % 2) * 6 - 2, big < 0.7 ? 1.5 : big < 1 ? 2 : AP); }
      }
      // vines (or roots) hanging from it
      ctx.fillStyle = css(lerp3(base, under ? [40, 30, 22] : [12, 46, 24], 0.5));
      for (let v = 0; v < 2; v++) {
        if (hsh(i * 2 + v, k + 12) < 0.35) continue;
        const vx0 = left ? len * (0.3 + v * 0.45) : W - len * (0.3 + v * 0.45), n = Math.round((30 + hsh(i * 2 + v, k + 14) * 150) * big / (AP * 2));
        for (let q = 0; q < n; q++) { const vx = sn(vx0 + Math.sin(time * 0.8 + i + v + q * 0.22) * q * 0.4); ctx.fillRect(vx, y + th + q * AP * 2, AP, AP * 2 + 1); if (!under && q % 4 === 2) ctx.fillRect(vx + (q % 8 === 2 ? -AP * 2 : AP), y + th + q * AP * 2, AP * 2, AP); }
      }
    }
  }
  // lianas sagging across the gap, with a leaf here and there
  function lianas(z, SP, k, dark) {
    const cz = camS * z, i0 = Math.floor((cz - AY * mpp - 160) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 60) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      const dep = (i + hsh(i, k) * 0.7) * SP, real = dep / z; if (real > FLOOR - 60 || hsh(i, k + 1) < 0.25) continue;
      const y0 = AY + (dep - cz) / mpp, xa = hsh(i, k + 2) * W * 0.35, xb = W * (0.65 + hsh(i, k + 3) * 0.35), sag = (50 + hsh(i, k + 4) * 110) * z, tilt = (hsh(i, k + 5) - 0.5) * 120;
      const base = lerp3(air(real), [2, 8, 5], dark), leaf = css(lerp3(base, [40, 140, 64], 0.4 * Math.max(0, 1 - real / 1500) + 0.05));
      ctx.fillStyle = css(lerp3(base, [10, 40, 20], 0.5));
      const n = Math.ceil((xb - xa) / (AP * 2)), sw = Math.sin(time * 0.6 + i) * 4 * z;
      for (let q = 0; q <= n; q++) {
        const u = q / n, x = xa + (xb - xa) * u, y = y0 + tilt * u + sag * 4 * u * (1 - u) + sw * Math.sin(u * Math.PI);
        ctx.fillRect(sn(x), sn(y), AP * 2 + 1, z > 0.7 ? AP + 1 : AP);
        if (q % 9 === 4) { ctx.fillStyle = leaf; ctx.fillRect(sn(x), sn(y) + AP, AP * 2, AP * 2); ctx.fillRect(sn(x) + AP, sn(y) + AP * 3, AP, AP); ctx.fillStyle = css(lerp3(base, [10, 40, 20], 0.5)); }
      }
    }
  }
  function leafLayer(list, dt) {
    const push = (camS - (leafLayer.prev == null ? camS : leafLayer.prev)) / mpp;
    for (const p of list) {
      p.y -= push * p.par - 9 * dt; p.x += 12 * Math.sin(0.6 * time + p.ph) * dt;
      if (p.y > H + 12) p.y -= H + 24; if (p.y < -12) p.y += H + 24; if (p.x > W + 12) p.x = -12; if (p.x < -12) p.x = W + 12;
      const streak = Math.min(9, Math.abs(vel * p.par / mpp) * 0.035), deep = Math.min(1, Math.max(0, (camS - 700) / 900)), lit = deep > 0 && p.ph < 2.4;
      if (yOf(0) > p.y) continue;
      ctx.fillStyle = lit ? (p.ph < 1.2 ? '#e8ff7a' : '#7dffb0') : camS > FLOOR ? '#8a9a94' : p.c;
      ctx.globalAlpha = lit ? deep * Math.max(0.1, Math.sin(time * 2.2 + p.ph * 4)) + p.a * (1 - deep) * 0.6 : p.a * (camS > 1500 ? 0.45 : 1);
      if (lit && streak <= 5) halo(p.x + 1, p.y + 1, 10, ctx.fillStyle, ctx.globalAlpha * 0.6);
      if (streak > 5 || lit || camS > FLOOR) ctx.fillRect(sn(p.x), sn(p.y), lit ? 3 : 2, Math.max(lit ? 3 : p.r, streak));
      else { const lw = Math.max(2, Math.abs(Math.cos(time * 2.6 + p.ph)) * (p.r + 4)), x = sn(p.x - lw / 2), y = sn(p.y); ctx.fillRect(x, y, lw, 2); ctx.fillRect(x + lw * 0.25, y - 2, lw * 0.5, 2); ctx.fillRect(x + lw * 0.25, y + 2, lw * 0.5, 2); }
    }
    ctx.globalAlpha = 1;
  }
  // ---- the far background: things between the distant trunks, so the gaps are never an empty wash ----
  // masses of leaves hanging in the distance, hazed by the air and thinning out as the light goes
  function farFoliage(z, SP, k, dark, scale, haze) {
    const top = camS * z - AY * mpp, bot = top + H * mpp;
    ctx.globalAlpha = haze;
    for (let i = Math.floor((top - 90) / SP); i <= Math.ceil((bot + 90) / SP); i++) {
      if (i < 0) continue;
      const dep = (i + hsh(i, k) * 0.7) * SP, trueD = dep / z; if (trueD > FLOOR - 200) continue;
      if (hsh(i, k + 1) < Math.min(0.8, trueD / 3200)) continue;
      const x = hsh(i, k + 2) * (W + 120) - 60, y = AY + (dep - camS * z) / mpp, sway = Math.sin(time * 0.45 + i * 1.7) * 1.5;
      drawClump((i * 7 + k) % 6, trueD, dark, x + sway, y, scale);
      drawClump((i * 3 + k + 2) % 6, trueD, dark, x + sway + 22 * scale, y + 5 * scale, scale);
      ctx.globalAlpha = haze;
    }
    ctx.globalAlpha = 1;
  }
  // low cloud caught between the trees: lumpy bands of blocks that drift sideways
  function mist(z, SP, k, a) {
    if (a < 0.012) return;
    const top = camS * z - AY * mpp, bot = top + H * mpp, c = camS > FLOOR ? lerp3(air(camS), biomeOf(camS).glow, 0.42) : lerp3(air(camS), [206, 238, 212], 0.6), B = AP * 2;
    const cols = [1, 0.72, 0.45].map(f => css(c, (a * f).toFixed(3)));
    for (let i = Math.floor((top - 60) / SP); i <= Math.ceil((bot + 60) / SP); i++) {
      if (i < 1) continue;
      const dep = (i + hsh(i, k) * 0.6) * SP, y0 = AY + (dep - camS * z) / mpp, th = 3 + (hsh(i, k + 1) * 5 | 0), drift = time * (5 + hsh(i, k + 2) * 9) * (i % 2 ? 1 : -1), ph = hsh(i, k + 3) * 40;
      for (let x = 0, q = 0; x < W; x += B, q++) {
        const u = (x + drift) / 70 + ph, n = 0.5 + 0.5 * Math.sin(u) * Math.sin(u * 0.37 + i), hgt = Math.round(th * n * n * 1.7); if (hgt < 1) continue;
        ctx.fillStyle = cols[n > 0.75 ? 0 : n > 0.5 ? 1 : 2];
        ctx.fillRect(x, sn(y0 - hgt * B / 2), B, hgt * B);
        ctx.fillStyle = cols[2];
        if (q % 2) ctx.fillRect(x, sn(y0 - hgt * B / 2) - B, B, B); else ctx.fillRect(x, sn(y0 - hgt * B / 2) + hgt * B, B, B);
      }
    }
  }
  // a thin waterfall dropping through the far trees, with spray where it lands
  function waterfall() {
    if (camS > FLOOR + 100) return;
    const z = 0.3, x = sn(W * 0.63), w = AP * 6, yTop = AY + (130 - camS * z) / mpp, yBot = AY + (960 - camS * z) / mpp;
    if (yBot < -40 || yTop > H + 40) return;
    const lit = Math.max(0, 1 - camS / 1500), a = lerp3(air(camS), [222, 246, 240], 0.2 + 0.5 * lit), b = lerp3(air(camS), [150, 214, 214], 0.14 + 0.42 * lit), d = lerp3(air(camS), [2, 8, 5], 0.55), S2 = AP * 2;
    ctx.fillStyle = css(d); ctx.fillRect(x - AP * 14, sn(yTop) - AP * 3, AP * 34, AP * 4); ctx.fillRect(x - AP * 8, sn(yTop) + AP, AP * 22, AP * 2);
    const from = Math.max(yTop, -S2), to = Math.min(yBot, H + S2), scroll = time * 150;
    for (let y = from; y < to; y += S2) {
      const row = Math.floor((y - yTop - scroll) / S2), spread = Math.min(AP * 3, (y - yTop) / 60);
      for (let cI = 0; cI < 3; cI++) { const r = hsh(row, 60 + cI); ctx.fillStyle = css(r > 0.55 ? a : b, r > 0.2 ? 0.85 : 0.45); ctx.fillRect(sn(x + cI * AP * 2 + (cI - 1) * spread), sn(y), AP * 2, S2); }
    }
    if (yBot > -40 && yBot < H + 40) {
      ctx.fillStyle = css(d); ctx.fillRect(x - AP * 20, sn(yBot), AP * 46, AP * 3);
      for (let q = 0; q < 9; q++) { const u = mod(time * 0.9 + q / 9, 1), ang = -Math.PI * (0.15 + 0.7 * hsh(q, 71)), rr = 8 + u * 34; halo(x + w / 2 + Math.cos(ang) * rr, yBot + Math.sin(ang) * rr * 0.7, 5 + u * 5, 'rgb(220,246,240)', (0.15 + 0.4 * lit) * (1 - u)); }
    }
  }
  // glowing fungi on the far trunks, once it is dark enough for them to show
  function glowers(z, SP, k) {
    if (camS < 700) return;
    const top = camS * z - AY * mpp, bot = top + H * mpp, on = Math.min(1, (camS - 700) / 500);
    for (let i = Math.floor((top - 30) / SP); i <= Math.ceil((bot + 30) / SP); i++) {
      if (i < 0 || hsh(i, k) < 0.35) continue;
      const dep = (i + hsh(i, k + 1) * 0.8) * SP, x = sn(hsh(i, k + 2) * W), y = sn(AY + (dep - camS * z) / mpp), n = 2 + (hsh(i, k + 3) * 3 | 0);
      const col = dep / z > FLOOR ? biomeOf(dep / z).glow : [125, 255, 190], pulse = 0.55 + 0.45 * Math.sin(time * (1.1 + hsh(i, k + 4)) + i);
      for (let m = 0; m < n; m++) {
        const mx = x + (m - n / 2) * AP * 4, my = y + ((m * 7) % 3) * AP * 2;
        ctx.fillStyle = css(col, (on * (0.25 + 0.3 * pulse)).toFixed(3)); ctx.fillRect(mx + AP, my + AP, AP, AP * 2);
        ctx.fillStyle = css(col, (on * (0.55 + 0.45 * pulse)).toFixed(3)); ctx.fillRect(mx, my, AP * 3, AP); ctx.fillRect(mx + AP, my - AP, AP, AP);
      }
      halo(x, y, 16 + n * 3, css(col), on * 0.32 * pulse);
    }
  }
  // ---- below the forest: one world after another, each with its own rock, light and life ----
  const BIOMES = [
    { at: 0, kind: 'floor', rock: [26, 22, 16], glow: [125, 255, 176], mote: '232,255,122' },
    { at: 2000, kind: 'roots', rock: [34, 24, 15], glow: [255, 190, 110], mote: '255,214,150' },
    { at: 2800, kind: 'river', rock: [18, 30, 38], glow: [110, 214, 255], mote: '170,230,255' },
    { at: 3700, kind: 'grotto', rock: [12, 22, 30], glow: [125, 240, 255], mote: '140,255,240' },
    { at: 4700, kind: 'crystal', rock: [28, 18, 42], glow: [200, 140, 255], mote: '220,190,255' },
    { at: 5800, kind: 'temple', rock: [42, 37, 25], glow: [255, 209, 102], mote: '255,226,150' },
    { at: 7000, kind: 'fungal', rock: [32, 16, 30], glow: [255, 120, 200], mote: '255,170,220' },
    { at: 8400, kind: 'magma', rock: [44, 14, 10], glow: [255, 110, 50], mote: '255,160,80' },
    { at: 10000, kind: 'obscura', rock: [36, 28, 12], glow: [255, 230, 140], mote: '255,240,180' },
  ];
  function biomeOf(m) { let b = BIOMES[0]; for (const x of BIOMES) if (m >= x.at) b = x; return b; }
  // the rock blends into the next world's over the last 300 m, so nothing changes with a hard cut
  function rockAt(m) {
    let i = 0; for (let j = 0; j < BIOMES.length; j++) if (m >= BIOMES[j].at) i = j;
    const a = BIOMES[i], b = BIOMES[i + 1]; if (!b) return a.rock;
    const f = Math.max(0, (m - (b.at - 300)) / 300); return f > 0 ? lerp3(a.rock, b.rock, f) : a.rock;
  }
  // what grows on a rock ledge in each world
  function ledgeDecor(kind, x0, y, len, th, big, i, k, dark, base) {
    const g = biomeOf(FLOOR + 1).glow, b = BIOMES.find(q => q.kind === kind) || BIOMES[0], gl = b.glow, pulse = 0.6 + 0.4 * Math.sin(time * 1.4 + i);
    if (kind === 'crystal') for (let q = 0; q < 4; q++) {
      const cx = x0 + (0.15 + hsh(i * 4 + q, k + 21) * 0.7) * len, ch = (10 + hsh(i * 4 + q, k + 22) * 22) * big, cw = (5 + hsh(i * 4 + q, k + 23) * 5) * big;
      ctx.fillStyle = css(lerp3(gl, [12, 6, 22], 0.45 + dark * 0.4)); ctx.beginPath(); ctx.moveTo(cx - cw / 2, y); ctx.lineTo(cx - cw / 2, y - ch * 0.75); ctx.lineTo(cx, y - ch); ctx.lineTo(cx + cw / 2, y - ch * 0.75); ctx.lineTo(cx + cw / 2, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(lerp3(gl, [255, 255, 255], 0.4), 0.8 * (1 - dark * 0.6)); ctx.fillRect(sn(cx - cw / 2), sn(y - ch * 0.75), Math.max(1, cw / 3), ch * 0.75);
      halo(cx, y - ch * 0.6, 10 + ch * 0.4, css(gl), 0.22 * pulse);
    }
    else if (kind === 'fungal') for (let q = 0; q < 3; q++) {
      const cx = x0 + (0.15 + hsh(i * 3 + q, k + 24) * 0.7) * len, sh = (6 + hsh(i * 3 + q, k + 25) * 12) * big, cr = (6 + hsh(i * 3 + q, k + 26) * 9) * big;
      ctx.fillStyle = css(base); ctx.fillRect(sn(cx - AP / 2), y - sh, AP, sh);
      ctx.fillStyle = css(lerp3(gl, [24, 6, 20], 0.4 + dark * 0.4)); ctx.beginPath(); ctx.ellipse(cx, y - sh, cr, cr * 0.55, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(gl, 0.75 * pulse); ctx.fillRect(sn(cx - cr * 0.8), sn(y - sh), cr * 1.6, 2);
      halo(cx, y - sh, cr * 1.4, css(gl), 0.2 * pulse);
    }
    else if (kind === 'temple') {
      // dressed stone: block seams and a carved glyph picked out in gold
      ctx.fillStyle = css(lerp3(base, [0, 0, 0], 0.45));
      for (let sx = x0 + 22 * big; sx < x0 + len; sx += 30 * big) ctx.fillRect(sn(sx), y, 2, th * 2);
      ctx.fillRect(x0, y + th, len, 2);
      const gx = x0 + len * (0.3 + hsh(i, k + 27) * 0.4);
      ctx.fillStyle = css(gl, 0.5 + 0.35 * pulse); ctx.fillRect(sn(gx), y + 3, AP * 3, AP); ctx.fillRect(sn(gx + AP), y + 3, AP, AP * 3); ctx.fillRect(sn(gx), y + 3 + AP * 2, AP * 3, AP);
    }
    else if (kind === 'magma') {
      // a seam of molten rock glowing along the underside
      ctx.fillStyle = css([255, 140 + 60 * pulse, 50], 0.85);
      let yy = y + th * 2 - AP; for (let sx = x0; sx < x0 + len; sx += AP * 2) { yy += (hsh(i * 50 + sx, k + 28) - 0.5) * AP; ctx.fillRect(sn(sx), sn(Math.min(y + th * 2 - AP, Math.max(y + AP, yy))), AP * 2, AP); }
      halo(x0 + len / 2, y + th * 2, len * 0.3, 'rgb(255,110,50)', 0.18 * pulse);
    }
    else if (kind === 'river') {
      // drips falling from the stalactite tips
      for (let q = 0; q < 3; q++) { const sx = x0 + hsh(i * 9 + q, k) * (len - 12) + 4.5 * big, u = mod(time * 0.7 + hsh(i, q + 40), 1); ctx.fillStyle = 'rgba(170,230,255,' + (0.8 * (1 - u)).toFixed(2) + ')'; ctx.fillRect(sn(sx), sn(y + th * 2 + 30 * big + u * 160), 2, 4); }
    }
    else if (kind === 'grotto') {
      // glowworm threads beaded with light
      for (let q = 0; q < 5; q++) { const tx = x0 + hsh(i * 5 + q, k + 29) * len, tl = (16 + hsh(i * 5 + q, k + 30) * 60) * big, a = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 1.6 + q * 2 + i));
        ctx.fillStyle = css(gl, 0.2 * a); ctx.fillRect(sn(tx), y + th * 2, 1, tl); ctx.fillStyle = css([220, 255, 255], a); ctx.fillRect(sn(tx) - 1, sn(y + th * 2 + tl), 3, 3); }
    }
    void g;
  }
  // right in front of the lens in the deep worlds: huge dark shapes sweep past, rim-lit by the world's own glow
  function foreDeep() {
    if (camS < FLOOR - 100) return;
    const z = 1.9, SP = 260, cz = camS * z, i0 = Math.floor((cz - AY * mpp - 700) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 200) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      if (hsh(i, 801) < 0.35) continue;
      const dep = (i + hsh(i, 802) * 0.5) * SP, real = dep / z; if (real < FLOOR + 80) continue;
      const b = biomeOf(real), y = AY + (dep - cz) / mpp, left = hsh(i, 803) < 0.5, x0 = left ? 0 : W, dir = left ? 1 : -1;
      const reach = Math.min(W * 0.42, 90 + hsh(i, 804) * 220), len = 240 + hsh(i, 805) * 420, kind = b.kind;
      const pts = [];
      if (kind === 'crystal') { // a cluster of crystal spears jutting in from the side
        pts.push([x0, y - len * 0.4], [x0 + dir * reach * 0.55, y - len * 0.15], [x0 + dir * reach, y - len * 0.05], [x0 + dir * reach * 0.6, y + len * 0.05], [x0 + dir * reach * 0.8, y + len * 0.22], [x0, y + len * 0.4]);
      } else if (kind === 'fungal') { // a giant mushroom cap seen from below
        for (let a = 0; a <= 12; a++) { const t = a / 12; pts.push([x0 + dir * reach * Math.sin(t * Math.PI), y - len * 0.18 + t * len * 0.36 + Math.sin(t * 9 + i) * 6]); }
      } else { // a ragged spur of rock, root or ruin
        const n = 9; for (let a = 0; a <= n; a++) { const t = a / n, bulge = Math.sin(t * Math.PI), jag = (hsh(i * 13 + a, 806) - 0.5) * 34; pts.push([x0 + dir * (reach * bulge * (0.6 + 0.4 * hsh(i * 7 + a, 807)) + jag * bulge), y - len / 2 + t * len]); }
      }
      ctx.fillStyle = css(lerp3(air(real), [0, 0, 0], 0.82));
      ctx.beginPath(); pts.forEach(([px, py], k) => k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fill();
      // rim light along the edge that faces the open shaft
      ctx.strokeStyle = css(b.glow, (0.28 + 0.18 * Math.sin(time * 1.3 + i)).toFixed(3)); ctx.lineWidth = AP;
      ctx.beginPath(); pts.slice(1, -1).forEach(([px, py], k) => k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke();
      if (kind === 'magma' || kind === 'crystal' || kind === 'grotto' || kind === 'fungal' || kind === 'obscura') { const [tx, ty] = pts[Math.floor(pts.length / 2)]; halo(tx, ty, 26, css(b.glow), 0.35); }
    }
  }
  // the far wall of the cavern: giant stalactites and columns, faint with distance, so the space feels huge
  function caveFar() {
    if (camS < FLOOR - 200) return;
    const z = 0.16, SP = 46, cz = camS * z, i0 = Math.floor((cz - AY * mpp - 120) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 120) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      const dep = (i + hsh(i, 701) * 0.5) * SP, real = dep / z; if (real < FLOOR) continue;
      const b = biomeOf(real), y = AY + (dep - cz) / mpp, x = hsh(i, 702) * W, w = (60 + hsh(i, 703) * 140), hgt = 200 + hsh(i, 704) * 420, kind = hsh(i, 705);
      ctx.fillStyle = css(lerp3(air(camS), [b.rock[0] * 0.5, b.rock[1] * 0.5, b.rock[2] * 0.5], 0.32));
      ctx.beginPath();
      if (kind < 0.4) { ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w * 0.06, y + hgt); ctx.lineTo(x - w * 0.04, y + hgt * 0.92); }
      else if (kind < 0.75) { ctx.moveTo(x - w / 2, y + hgt); ctx.lineTo(x + w / 2, y + hgt); ctx.lineTo(x + w * 0.05, y); ctx.lineTo(x - w * 0.08, y + hgt * 0.1); }
      else { ctx.moveTo(x - w * 0.5, y - hgt * 0.5); ctx.lineTo(x + w * 0.5, y - hgt * 0.5); ctx.lineTo(x + w * 0.22, y); ctx.lineTo(x + w * 0.5, y + hgt * 0.5); ctx.lineTo(x - w * 0.5, y + hgt * 0.5); ctx.lineTo(x - w * 0.2, y); }
      ctx.closePath(); ctx.fill();
    }
  }
  // the big shapes of each world, placed down the shaft at one parallax depth
  function deepFeatures(z, SP, k, dark) {
    if (camS < FLOOR - 400) return;
    const cz = camS * z, i0 = Math.floor((cz - AY * mpp - 500) / SP), i1 = Math.ceil((cz + (H - AY) * mpp + 200) / SP);
    for (let i = Math.max(0, i0); i <= i1; i++) {
      const dep = (i + hsh(i, k) * 0.6) * SP, real = dep / z; if (real < FLOOR + 150 || real > MAX_DEPTH + 300) continue;
      const b = biomeOf(real), y = sn(AY + (dep - cz) / mpp), side = hsh(i, k + 1) < 0.5, x = sn((side ? 0.1 + hsh(i, k + 2) * 0.28 : 0.62 + hsh(i, k + 2) * 0.28) * W), r = hsh(i, k + 3);
      const rockC = lerp3(lerp3(air(real), [b.rock[0] * 0.45, b.rock[1] * 0.45, b.rock[2] * 0.45], 0.75), [0, 0, 0], dark * 0.6), rock = css(rockC), g = b.glow, pulse = 0.6 + 0.4 * Math.sin(time * (0.9 + r) + i), s = (0.7 + r * 0.7) * (z < 0.5 ? 0.75 : 1.15), dim = 1 - dark * 0.5;
      ctx.fillStyle = rock;
      if (b.kind === 'floor' || b.kind === 'roots') {
        // a bundle of roots hanging out of the dark, some carrying glowing bulbs
        const n = 3 + (r * 4 | 0), len = (110 + r * 240) * s;
        const lit = css(lerp3(rockC, [190, 140, 90], 0.22 * dim));
        for (let q = 0; q < n; q++) { let px = x + (q - n / 2) * AP * 4 * s; const ql = len * (0.55 + 0.45 * hsh(i * 7 + q, k + 15)); for (let t = 0; t < ql; t += AP * 2) { px += Math.sin(t * 0.025 + q * 1.7 + i) * 1.4; const w = Math.max(AP, Math.round((1 - t / ql) * 5 * s) * AP); ctx.fillStyle = rock; ctx.fillRect(sn(px), y + t, w, AP * 2 + 1); if (q % 2 === 0) { ctx.fillStyle = lit; ctx.fillRect(sn(px), y + t, AP, AP * 2); } }
          if (b.kind === 'roots' && hsh(i * 7 + q, k + 4) > 0.45) { const by = y + ql * (0.5 + hsh(q, i) * 0.45); ctx.fillStyle = css(g, 0.7 * pulse * dim); ctx.fillRect(sn(px) - AP, sn(by), AP * 3, AP * 3); halo(px, by + 3, 12, css(g), 0.3 * pulse * dim); ctx.fillStyle = rock; } }
      } else if (b.kind === 'river') {
        // water pouring out of a crack in the rock
        const len = (180 + r * 280) * s, w = AP * (2 + (r * 3 | 0)), scroll = time * 150;
        ctx.fillRect(x - AP * 7, y - AP * 3, w + AP * 14, AP * 4);
        for (let t = 0; t < len; t += AP * 2) { const row = Math.floor((t - scroll) / (AP * 2)), h2 = hsh(row, k + 9); ctx.fillStyle = css(lerp3(rockC, [160, 225, 245], (0.3 + 0.35 * h2) * dim), 0.85 * (1 - (t / len) * 0.6)); ctx.fillRect(sn(x + (h2 > 0.5 ? AP : 0)), y + t, w, AP * 2); }
        halo(x + w / 2, y + len, 10 + w, css(g), 0.22 * dim);
      } else if (b.kind === 'grotto') {
        // threads of glowworms hanging from the ceiling like strings of stars
        const n = 6 + (r * 6 | 0);
        for (let q = 0; q < n; q++) {
          const tx = x + (hsh(i * 13 + q, k + 5) - 0.5) * 180 * s, tl = (40 + hsh(i * 13 + q, k + 6) * 170) * s, a = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 1.3 + q * 1.9 + i))) * dim;
          ctx.fillStyle = css(g, 0.16 * a); ctx.fillRect(sn(tx), y, 1, tl);
          ctx.fillStyle = css(g, 0.55 * a); for (let d2 = 12; d2 < tl; d2 += 15 + (q % 3) * 7) ctx.fillRect(sn(tx) - 1, sn(y + d2), 2, 2);
          ctx.fillStyle = css([225, 255, 255], a); ctx.fillRect(sn(tx) - 1, sn(y + tl), 3, 4); if (q % 2) halo(tx, y + tl, 9, css(g), a * 0.45);
        }
      } else if (b.kind === 'crystal') {
        // a cluster of crystals growing up from a shelf, or down from the roof
        const n = 3 + (r * 3 | 0), up = r < 0.5 ? -1 : 1;
        ctx.fillRect(x - 46 * s, y - AP * 2, 92 * s, AP * 4);
        for (let q = 0; q < n; q++) {
          const cx = x + (q - (n - 1) / 2) * 17 * s, ch = (34 + hsh(i * 7 + q, k + 7) * 80) * s, cw = (9 + hsh(i * 7 + q, k + 8) * 9) * s, lean = (q - (n - 1) / 2) * 7 * s;
          ctx.fillStyle = css(lerp3(g, [10, 6, 22], 0.35 + dark * 0.5)); ctx.beginPath(); ctx.moveTo(cx - cw / 2, y); ctx.lineTo(cx + lean - cw / 2, y + up * ch * 0.8); ctx.lineTo(cx + lean, y + up * ch); ctx.lineTo(cx + lean + cw / 2, y + up * ch * 0.8); ctx.lineTo(cx + cw / 2, y); ctx.closePath(); ctx.fill();
          ctx.fillStyle = css(lerp3(g, [255, 255, 255], 0.4), 0.8 * dim); ctx.beginPath(); ctx.moveTo(cx - cw / 2, y); ctx.lineTo(cx + lean - cw / 2, y + up * ch * 0.8); ctx.lineTo(cx + lean, y + up * ch); ctx.lineTo(cx + lean - cw * 0.15, y); ctx.closePath(); ctx.fill();
          if (Math.sin(time * 1.7 + i * 3 + q * 5) > 0.97) halo(cx + lean, y + up * ch, 6, 'rgb(255,255,255)', 0.9);
        }
        halo(x, y + up * 40 * s, 34 * s, css(g), 0.3 * pulse * dim);
      } else if (b.kind === 'temple') {
        // a pillar of the old temple, cracked, wrapped in vine, some still watching
        const ph = (150 + r * 230) * s, pw = (26 + r * 16) * s, broken = hsh(i, k + 9) < 0.35;
        if (!broken) ctx.fillRect(x - pw / 2 - AP * 2, y - AP * 3, pw + AP * 4, AP * 3);
        ctx.beginPath(); ctx.moveTo(x - pw / 2, y + ph); ctx.lineTo(x - pw / 2, broken ? y + 10 * s : y); ctx.lineTo(x - pw * 0.1, broken ? y - 6 * s : y); ctx.lineTo(x + pw * 0.15, broken ? y + 14 * s : y); ctx.lineTo(x + pw / 2, broken ? y + 4 * s : y); ctx.lineTo(x + pw / 2, y + ph); ctx.closePath(); ctx.fill();
        ctx.fillRect(x - pw / 2 - AP * 3, y + ph, pw + AP * 6, AP * 4);
        ctx.fillStyle = css(lerp3(rockC, [0, 0, 0], 0.4)); for (let q = 1; q < 4; q++) ctx.fillRect(sn(x - pw / 2 + q * pw / 4), y + 16 * s, 2, ph - 20 * s);
        if (r > 0.5) { const fy = y + ph * 0.32; ctx.fillStyle = css(g, (0.45 + 0.45 * pulse) * dim); ctx.fillRect(sn(x - pw * 0.28), sn(fy), AP * 2, AP); ctx.fillRect(sn(x + pw * 0.28 - AP * 2), sn(fy), AP * 2, AP); halo(x, fy, pw * 0.7, css(g), 0.18 * pulse * dim); }
        ctx.fillStyle = css(lerp3(rockC, [40, 110, 50], 0.45)); for (let t = 0; t < ph * 0.7; t += AP * 2) ctx.fillRect(sn(x - pw / 2 + pw * 0.5 * (0.5 + 0.5 * Math.sin(t * 0.045 + i))), y + t, AP, AP * 2);
      } else if (b.kind === 'fungal') {
        // a giant mushroom with a glowing underside
        const sh = (70 + r * 170) * s, cw2 = (42 + r * 54) * s;
        ctx.fillRect(sn(x - 5 * s), y, 10 * s, sh); ctx.fillRect(sn(x - 9 * s), y + sh - 6, 18 * s, 6);
        ctx.fillStyle = css(lerp3(g, [20, 6, 18], 0.5 + dark * 0.4)); ctx.beginPath(); ctx.ellipse(x, y, cw2, cw2 * 0.46, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = css(g, (0.45 + 0.4 * pulse) * dim); ctx.fillRect(sn(x - cw2 * 0.9), y - 1, cw2 * 1.8, AP);
        ctx.fillStyle = css(lerp3(g, [255, 255, 255], 0.55), 0.65 * dim); for (let q = 0; q < 5; q++) ctx.fillRect(sn(x + (hsh(i * 5 + q, k + 10) - 0.5) * cw2 * 1.3), sn(y - 4 - hsh(i * 5 + q, k + 11) * cw2 * 0.32), AP * 2, AP * 2);
        halo(x, y + 6, cw2 * 0.9, css(g), 0.28 * pulse * dim);
      } else if (b.kind === 'magma') {
        // a dark spire with a vein of molten rock running down it
        const len = (130 + r * 260) * s, hot = (0.55 + 0.45 * pulse) * (1 - dark * 0.4);
        ctx.beginPath(); ctx.moveTo(x - 30 * s, y + len); ctx.lineTo(x - 6 * s, y - 50 * s); ctx.lineTo(x + 4 * s, y - 70 * s); ctx.lineTo(x + 30 * s, y + len); ctx.closePath(); ctx.fill();
        let px = x; for (let t = -40 * s; t < len; t += AP * 2) { px += (hsh(i * 31 + (t | 0), k + 12) - 0.5) * AP * 1.6; px = Math.max(x - 12 * s, Math.min(x + 12 * s, px)); ctx.fillStyle = css([255, 110 + 120 * hsh((t | 0) + i, k + 13), 40], hot); ctx.fillRect(sn(px), y + t, AP * (r > 0.6 ? 2 : 1), AP * 2); }
        halo(x, y + len * 0.4, 30 * s, 'rgb(255,110,50)', 0.24 * hot);
      } else if (b.kind === 'obscura') {
        // golden roots all leaning toward the heart below
        const len = 300 * s, dir = x < W / 2 ? 1 : -1;
        for (let t = 0; t < len; t += AP * 2) { const u = t / len, px = x + dir * u * u * W * 0.22, a = (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(time * 2 - t * 0.04 + i))) * dim; ctx.fillStyle = css(rockC); ctx.fillRect(sn(px) - AP, y + t, AP * 4, AP * 2); ctx.fillStyle = css(g, a); ctx.fillRect(sn(px), y + t, AP * 2, AP * 2); }
      }
    }
  }
  // the moments you pass through: a river, the temple gate, and the heart at the bottom of everything
  function deepLandmarks() {
    // the underground river: you break its surface and sink through it
    if (camS > 2500 && camS < 3400) {
      const y = yOf(2800), yb = yOf(3080);
      if (yb > -40 && y < H + 40) {
        const t0 = Math.max(-10, y), t1 = Math.min(H + 10, yb);
        ctx.fillStyle = 'rgba(30,96,128,0.32)'; ctx.fillRect(0, t0, W, t1 - t0);
        for (let b2 = 0; b2 < 4; b2++) { ctx.fillStyle = 'rgba(' + (b2 % 2 ? '120,210,235' : '70,160,200') + ',' + (0.55 - b2 * 0.1) + ')'; for (let x = 0; x <= W; x += AP * 2) ctx.fillRect(x, sn(y + b2 * 12 + 4 * Math.sin(0.02 * x + time * (1.4 + b2 * 0.3))), AP * 2, AP); }
        for (let q = 0; q < 26; q++) { const u = mod(hsh(q, 501) - time * (0.04 + hsh(q, 502) * 0.05), 1), by = y + (yb - y) * u; if (by < -4 || by > H + 4) continue; ctx.fillStyle = 'rgba(190,240,255,0.55)'; ctx.fillRect(sn(hsh(q, 503) * W + Math.sin(time * 2 + q) * 4), sn(by), 2, 2); }
        if (yb > 0 && yb < H) { ctx.fillStyle = 'rgba(70,160,200,0.4)'; for (let x = 0; x <= W; x += AP * 2) ctx.fillRect(x, sn(yb + 3 * Math.sin(0.03 * x + time)), AP * 2, AP); }
      }
    }
    // the temple gate: a stepped arch with a great carved face over the way down
    if (near(5800, 320)) {
      const y = yOf(5800), cx = W / 2, rockC = lerp3(air(5800), BIOMES[5].rock, 0.75), gw = Math.min(W * 0.9, 760), pulse = 0.6 + 0.4 * Math.sin(time * 1.2);
      ctx.fillStyle = css(rockC);
      for (let st = 0; st < 4; st++) { const w = gw * (1 - st * 0.14); ctx.fillRect(sn(cx - w / 2), sn(y - 120 + st * 22), w, 24); }
      ctx.fillRect(sn(cx - gw / 2), y - 30, gw * 0.18, 260); ctx.fillRect(sn(cx + gw / 2 - gw * 0.18), y - 30, gw * 0.18, 260);
      ctx.fillStyle = css(lerp3(rockC, [0, 0, 0], 0.45)); for (let q = 0; q < 6; q++) ctx.fillRect(sn(cx - gw / 2 + q * gw * 0.036), y - 30, 2, 260), ctx.fillRect(sn(cx + gw / 2 - q * gw * 0.036), y - 30, 2, 260);
      ctx.fillStyle = css(BIOMES[5].glow, 0.55 + 0.4 * pulse); ctx.fillRect(sn(cx - 46), sn(y - 94), 22, 8); ctx.fillRect(sn(cx + 24), sn(y - 94), 22, 8); ctx.fillRect(sn(cx - 18), sn(y - 64), 36, 5);
      halo(cx - 35, y - 90, 30, 'rgb(255,209,102)', 0.35 * pulse); halo(cx + 35, y - 90, 30, 'rgb(255,209,102)', 0.35 * pulse);
    }
    // the heart of the Obscura: something vast and old, beating slowly in the dark
    if (near(11400, 600)) {
      const y = yOf(11400), cx = W / 2, beat = Math.pow(Math.max(0, Math.sin(time * 2.2)), 8) + 0.6 * Math.pow(Math.max(0, Math.sin(time * 2.2 - 0.5)), 8), R0 = Math.min(W, 700) * 0.16 * (1 + beat * 0.06);
      halo(cx, y, R0 * 2.4, 'rgb(255,214,120)', 0.3 + beat * 0.25);
      ctx.fillStyle = 'rgb(58,40,14)'; ctx.beginPath(); ctx.moveTo(cx, y - R0 * 1.35); ctx.lineTo(cx + R0, y); ctx.lineTo(cx, y + R0 * 1.35); ctx.lineTo(cx - R0, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,214,120,' + (0.55 + beat * 0.4).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(cx, y - R0 * 1.05); ctx.lineTo(cx + R0 * 0.72, y); ctx.lineTo(cx, y + R0 * 1.05); ctx.lineTo(cx - R0 * 0.72, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,248,220,' + (0.6 + beat * 0.4).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(cx, y - R0 * 0.5); ctx.lineTo(cx + R0 * 0.3, y); ctx.lineTo(cx, y + R0 * 0.5); ctx.lineTo(cx - R0 * 0.3, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgb(46,32,12)'; for (let q = 0; q < 10; q++) { const a = (q / 10) * Math.PI * 2 + 0.3, len = R0 * (2 + hsh(q, 601) * 2.5); for (let t = R0 * 0.9; t < len; t += AP * 2) ctx.fillRect(sn(cx + Math.cos(a + Math.sin(t * 0.01 + q) * 0.25) * t), sn(y + Math.sin(a + Math.sin(t * 0.01 + q) * 0.25) * t * 0.8), AP * 2 + (len - t) / len * AP * 3, AP * 2); }
    }
  }
  function draw(dt) {
    const pz = 1 + punch * punch * 0.04;
    ctx.setTransform(DPR * pz, 0, 0, DPR * pz, -W * (pz - 1) / 2 * DPR, -AY * (pz - 1) * DPR);
    ctx.imageSmoothingEnabled = false; ctx.globalCompositeOperation = 'source-over';
    const bc = document.body.classList, dive = bc.contains('dive'), sy = yOf(0), light = Math.max(0, 1 - camS / 1100);
    // air
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, css(air(camS - H * mpp * 0.3))); bg.addColorStop(0.5, css(air(camS + H * mpp * 0.2))); bg.addColorStop(1, css(air(camS + H * mpp * 0.7)));
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // sky above the treetops
    if (sy > -60) {
      const g = ctx.createLinearGradient(0, 0, 0, Math.max(1, sy));
      g.addColorStop(0, '#b6dcf0'); g.addColorStop(1, '#eaf6e2');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, sy + 4);
      const sun = ctx.createRadialGradient(W * 0.82, sy * 0.3, 0, W * 0.82, sy * 0.3, 130);
      sun.addColorStop(0, 'rgba(255,240,180,0.9)'); sun.addColorStop(0.35, 'rgba(255,232,150,0.35)'); sun.addColorStop(1, 'rgba(255,232,150,0)');
      ctx.fillStyle = sun; ctx.fillRect(0, 0, W, sy + 4);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      for (const c of clouds) { const x = sn(mod(c.x + time * c.v, W + 200) - 100), y = sn(sy * c.f); ctx.fillRect(x, y, c.w * AP, AP * 2); ctx.fillRect(x + AP * 2, y - AP * 2, (c.w - 5) * AP, AP * 2); ctx.fillRect(x + AP * 4, y - AP * 3, (c.w - 10) * AP, AP); }
      // far hills of treetops
      ctx.fillStyle = '#6fb88a'; ctx.beginPath(); ctx.moveTo(0, sy + 4);
      for (let x = 0; x <= W + 40; x += 40) ctx.arc(x, sy - 6 + hsh(x, 2) * 10, 34 + hsh(x, 3) * 18, Math.PI, 0);
      ctx.lineTo(W, sy + 4); ctx.closePath(); ctx.fill();
    }
    const low = !!window.__low;
    const fog = camS > FLOOR ? 0.75 : Math.min(1, camS / 220) * Math.max(0.25, 1 - camS / 5200);
    if (!low) trunks(0.2, Math.max(5, Math.round(W / 110)), 8, 10, 31, 0.12);
    if (!low) { farFoliage(0.24, 70, 201, 0.18, AP * 0.67, 0.5); mist(0.27, 62, 211, 0.2 * fog); waterfall(); }
    trunks(0.35, Math.max(4, Math.round(W / 150)), 14, 22, 1, 0.3);
    if (!low) limbs(0.42, 120, 40, 0.3, 0.6);
    if (!low) { caveFar(); deepFeatures(0.4, 80, 301, 0.5); glowers(0.38, 46, 231); mist(0.46, 96, 221, 0.15 * fog); }
    // shafts of light
    const ra = 0.12 * Math.max(0, 1 - camS / 1400);
    if (ra > 0.004) for (let k = 0; k < 5; k++) {
      const a = ra * (0.6 + 0.4 * Math.sin(time * 0.6 + k * 2.1)), x0 = W * (0.1 + k * 0.2) + Math.sin(time * 0.2 + k * 1.7) * 18, top = Math.max(sy, -40), len = H * 1.15, w0 = 24 + k * 8, sl = len * 0.24;
      const g = ctx.createLinearGradient(0, top, 0, top + len);
      g.addColorStop(0, 'rgba(255,250,200,' + a.toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,250,200,0)');
      ctx.fillStyle = g; ctx.globalCompositeOperation = 'lighter';
      for (const f of [1, 0.62, 0.3]) { const c0 = x0 + w0 / 2, c1 = x0 + w0 + sl; ctx.beginPath(); ctx.moveTo(c0 - w0 * f / 2, top); ctx.lineTo(c0 + w0 * f / 2, top); ctx.lineTo(c1 + w0 * 2 * f, top + len); ctx.lineTo(c1 - w0 * 2 * f, top + len); ctx.closePath(); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over';
      // dust catching the light
      for (let q = 0; q < 5; q++) { const u = mod(hsh(k * 9 + q, 55) + time * 0.02 * (1 + q * 0.3), 1), dx = x0 + w0 / 2 + (sl + w0) * u + Math.sin(time + q * 2) * w0 * 0.5, dy = top + len * u; halo(dx, dy, 5, 'rgb(255,250,210)', a * 5 * (0.5 + 0.5 * Math.sin(time * 2.4 + q * 1.9 + k)) * (1 - u)); }
    }
    // deep down, shafts of the world's own light pour through the cavern
    if (!low && camS > FLOOR - 200) {
      const g = biomeOf(camS + H * mpp * 0.2).glow, on = Math.min(1, (camS - FLOOR + 200) / 600);
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 4; k++) {
        const a = 0.075 * on * (0.55 + 0.45 * Math.sin(time * 0.45 + k * 1.9)), x0 = W * (0.08 + k * 0.26) + Math.sin(time * 0.17 + k * 2.3) * 30, w0 = 30 + k * 14, sl = H * (0.18 + 0.1 * (k % 2)), len = H * 1.2;
        const gr = ctx.createLinearGradient(0, -20, 0, len); gr.addColorStop(0, css(g, a.toFixed(3))); gr.addColorStop(1, css(g, 0));
        ctx.fillStyle = gr;
        for (const f of [1, 0.55]) { ctx.beginPath(); ctx.moveTo(x0 - w0 * f / 2, -20); ctx.lineTo(x0 + w0 * f / 2, -20); ctx.lineTo(x0 + sl + w0 * 2.2 * f, len); ctx.lineTo(x0 + sl - w0 * 2.2 * f, len); ctx.closePath(); ctx.fill(); }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (!low) lianas(0.5, 210, 51, 0.4);
    limbs(0.6, 150, 20, 0.45, 0.8);
    deepFeatures(0.72, 150, 331, 0.18);
    // things that live at particular depths
    if (near(85, 90)) for (let r = 0; r < 9; r++) spr('macaw', ['#ff5d5d', '#4d9bff', '#ffd34d'][r % 3], mod(34 * time + 52 * r + r * r * 7, W + 360) - 180, yOf(85) + 12 * Math.sin(2 * time + r) + (r % 3) * 16, 30, true, 0.12 * Math.sin(6 * time + r));
    if (near(260, 120)) for (let r = 0; r < 10; r++) { const x = W * (0.1 + 0.085 * r) + 20 * Math.sin(time * 0.9 + r * 2), y = yOf(260) + 40 * Math.sin(time * 0.7 + r * 1.3), fl = Math.abs(Math.sin(time * 13 + r)), ww = 2 + fl * 6; ctx.fillStyle = ['#ffb347', '#6fd6ff', '#ff8fd0', '#fff07a'][r % 4]; ctx.fillRect(sn(x - ww), sn(y - 3), ww, 5); ctx.fillRect(sn(x + 1.5), sn(y - 3), ww, 5); }
    if (near(420, 120)) { const y = yOf(420), x = W * 0.22; ctx.fillStyle = css(lerp3(air(420), [2, 8, 5], 0.6)); ctx.fillRect(0, y - 40, x + 60, 9); spr('sloth', '#b9a184', x, y - 6 + Math.sin(time * 0.8) * 2, 64, false, Math.sin(time * 0.8) * 0.04); }
    if (near(680, 140)) for (let r = 0; r < 22; r++) { ctx.fillStyle = 'rgba(232,255,122,' + Math.max(0.06, 0.3 + 0.25 * Math.sin(3 * time + r)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(W * (0.12 + 0.034 * r), yOf(680) + 22 * Math.sin(0.7 * time + 0.55 * r), 2.2, 0, 7); ctx.fill(); }
    if (near(780, 90)) for (let r = 0; r < 4; r++) spr('toucan', '#ffc04d', mod(-22 * time + 150 * r, W + 220) - 110, yOf(780) + 18 * Math.sin(time + 2 * r) + 9 * r, 34, false, 0);
    if (near(900, 120)) { const y = yOf(900), x = W * 0.74, blink = Math.sin(time * 1.9) > 0.94 ? 0 : 1; ctx.fillStyle = css(lerp3(air(900), [2, 8, 5], 0.7)); ctx.fillRect(x - 90, y + 8, W, 10); if (blink) { ctx.fillStyle = '#e4ff6a'; ctx.fillRect(x, y - 6, 6, 4); ctx.fillRect(x + 18, y - 6, 6, 4); ctx.fillStyle = '#0a1a08'; ctx.fillRect(x + 2, y - 6, 2, 4); ctx.fillRect(x + 20, y - 6, 2, 4); } }
    if (near(2250, 100)) for (let r = 0; r < 7; r++) { const x = mod(60 * time + 90 * r, W + 200) - 100, y = yOf(2250) + 26 * Math.sin(1.4 * time + r), f = Math.sin(time * 16 + r) * 6; ctx.fillStyle = 'rgba(3,8,5,0.9)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 11, y - 4 - f); ctx.lineTo(x - 6, y + 2); ctx.lineTo(x, y + 4); ctx.lineTo(x + 6, y + 2); ctx.lineTo(x + 11, y - 4 - f); ctx.closePath(); ctx.fill(); }
    if (near(1320, 220)) {
      // an overgrown stone idol, long forgotten
      const y = yOf(1320), x = W * 0.5; ctx.fillStyle = css(lerp3(air(1320), [3, 9, 6], 0.72));
      ctx.fillRect(x - 54, y - 60, 108, 150); ctx.fillRect(x - 72, y + 90, 144, 20); ctx.fillRect(x - 66, y - 78, 132, 20);
      ctx.fillStyle = css(air(1320)); ctx.fillRect(x - 32, y - 30, 20, 12); ctx.fillRect(x + 12, y - 30, 20, 12); ctx.fillRect(x - 22, y + 20, 44, 10);
      ctx.fillStyle = 'rgba(125,255,176,' + (0.35 + 0.25 * Math.sin(time * 1.3)).toFixed(3) + ')'; ctx.fillRect(x - 26, y - 27, 8, 6); ctx.fillRect(x + 18, y - 27, 8, 6);
    }
    if (near(FLOOR, 160)) {
      const y = yOf(FLOOR); ctx.fillStyle = css(lerp3(air(FLOOR), [18, 14, 10], 0.75));
      ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= W + 30; x += 30) ctx.lineTo(x, y + hsh(x, 9) * 10); ctx.lineTo(W, y + 70); ctx.lineTo(W * 0.62, y + 46); ctx.lineTo(W * 0.56, y + 90); ctx.lineTo(W * 0.44, y + 90); ctx.lineTo(W * 0.38, y + 46); ctx.lineTo(0, y + 70); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(lerp3(air(FLOOR), [34, 110, 52], 0.3));
      for (let i = 0; i < W / 70; i++) { const fx0 = i * 70 + hsh(i, 41) * 40; if (Math.abs(fx0 - W / 2) < W * 0.1) continue; for (let f = -3; f <= 3; f++) for (let q = 1; q < 8; q++) ctx.fillRect(sn(fx0 + f * q * AP * 0.9), y - q * AP * (2.2 - Math.abs(f) * 0.4), AP * 2, AP); }
    }
    if (near(1750, 100)) for (let r = 0; r < 8; r++) { ctx.fillStyle = 'rgba(125,255,176,' + (0.2 + 0.25 * Math.sin(4 * time + 3 * r)).toFixed(3) + ')'; ctx.fillRect(sn((0.13 * r + 0.05) * W + 14 * Math.sin(0.8 * time + 2 * r)), sn(yOf(1750) + 18 * Math.sin(1.3 * time + r) + (r % 3) * 10), 3, 3); }
    deepLandmarks();
    // butterflies (moths, deeper) that keep you company
    for (const b of roam) {
      b.x += b.sp * dt; if (b.sp > 0 && b.x > W + 60) { b.x = -60; b.off = D(-200, 200); } if (b.sp < 0 && b.x < -60) { b.x = W + 60; b.off = D(-200, 200); }
      if (camS + b.off < 20) continue;
      const y = yOf(camS + b.off) + 12 * Math.sin(time * 2 + b.ph), fl = Math.abs(Math.sin(time * 13 + b.ph)), ww = 2 + fl * 6;
      ctx.globalAlpha = 0.45 + 0.5 * light; ctx.fillStyle = light > 0.15 ? b.c : '#cfd8c8';
      ctx.fillRect(sn(b.x - ww), sn(y - 3), ww, 5); ctx.fillRect(sn(b.x + 1.5), sn(y - 3), ww, 5); ctx.fillStyle = '#1a1208'; ctx.fillRect(sn(b.x), sn(y - 3), 1.5, 6);
    }
    ctx.globalAlpha = 1;
    leafLayer(leavesA, dt);
    // the canopy roof, and the walkway you set off from
    if (sy > -80) {
      for (let x = -40, q = 0; x <= W + 90; x += 78, q++) drawClump((q * 5 + 2) % 6, 0, 0.2, x + 39 + Math.sin(time * 0.6 + q) * 2, sy + 44 + (q % 2) * 8, AP);
      for (let x = -40, q = 0; x <= W + 90; x += 78, q++) drawClump(q % 6, 0, 0.2, x + Math.sin(time * 0.7 + q) * 2, sy + 16 + (q % 3) * 6, AP);
      const px = sn(W * 0.3), py = sy - 4 + Math.sin(time * 1.1) * 1.5;
      ctx.fillStyle = '#3b2a1a'; ctx.fillRect(px - 60, py, 120, 5); for (let q = 0; q < 8; q++) ctx.fillRect(px - 58 + q * 15, py + 5, 3, 5);
      ctx.fillRect(px - 58, py - 26, 3, 26); ctx.fillRect(px + 55, py - 26, 3, 26); ctx.fillStyle = 'rgba(59,42,26,0.8)'; ctx.fillRect(px - 58, py - 20, 116, 2);
      ctx.fillStyle = '#3b2a1a'; ctx.fillRect(px - 10, py - 52, 3, 52);
      ctx.fillStyle = '#ff7a45'; const fl = Math.round(Math.sin(time * 3) * 1.2); ctx.fillRect(px - 7, py - 52 + fl, 15, 9); ctx.fillRect(px + 8, py - 49 + fl, 6, 3);
    }
    if (!low) { lianas(0.85, 330, 57, 0.7); mist(0.9, 260, 241, 0.09 * fog); }
    limbs(1, 310, 60, 0.82, 1.35);
    if (!low) foreDeep();
    // depth haze over everything behind the lens: the deep forest becomes quiet silhouettes, so the answer and the text stand out
    const haze = Math.min(camS > FLOOR + 200 ? 0.22 : 0.3, Math.max(0, (camS - 80) / 1400));
    if (haze > 0.01) { ctx.fillStyle = css(air(camS + H * mpp * 0.1), haze.toFixed(3)); ctx.fillRect(-W, -H, W * 3, H * 3); }
    // spores and dust hanging in the still air: tiny, sparse, drifting up past you as you fall
    if (!low) { const n = Math.round(W * H / 9000), drift = camS / mpp; for (let q = 0; q < n; q++) { const x = mod(hsh(q, 401) * W + Math.sin(time * 0.3 + q) * 6, W), y = mod(hsh(q, 402) * (H + 40) - drift * (0.6 + hsh(q, 403) * 0.5) - time * (3 + hsh(q, 404) * 5), H + 40) - 20, big = hsh(q, 405) > 0.85, warm = hsh(q, 406) > 0.9; ctx.fillStyle = (camS > FLOOR ? 'rgba(' + (warm ? '255,255,255' : biomeOf(camS).mote) + ',' : warm ? 'rgba(232,255,122,' : 'rgba(190,236,210,') + ((big ? 0.5 : 0.28) * (0.6 + 0.4 * Math.sin(time * 1.7 + q))).toFixed(2) + ')'; ctx.fillRect(sn(x), sn(y), big ? 2 : 1, big ? 2 : 1); } }
    // the trunks you are climbing down between
    for (const side of [0, 1]) {
      const w = Math.max(26, Math.min(70, W * 0.06)), x = side ? W - w : 0, top = Math.max(0, sy - 20), bot = Math.min(H, yOf(FLOOR) + 30);
      if (bot > 0 && top < H) {
        fillBark(x, top, w, bot - top, camS / mpp, css(lerp3(air(camS + H * mpp * 0.2), [2, 7, 4], 0.86)), 90 + side);
      }
      if (camS > FLOOR - 200) { ctx.fillStyle = css(lerp3(air(camS + H * mpp * 0.3), rockAt(camS + H * mpp * 0.3), 0.85)); const t2 = Math.max(0, yOf(FLOOR) + 20); ctx.beginPath(); ctx.moveTo(side ? W : 0, t2); for (let y = t2; y <= H + 30; y += 30) ctx.lineTo(side ? W - w * (0.7 + hsh((y + camS / mpp) / 30 | 0, 80 + side) * 0.9) : w * (0.7 + hsh((y + camS / mpp) / 30 | 0, 80 + side) * 0.9), y); ctx.lineTo(side ? W : 0, H + 30); ctx.closePath(); ctx.fill(); }
    }
    leafLayer(leavesB, dt); leafLayer.prev = camS;
    // big leaves right in front of the lens: they whip past as you fall
    if (camS < FLOOR + 100) {
      ctx.fillStyle = css(lerp3(air(camS), [1, 5, 3], 0.9));
      const cz = camS * 1.6;
      for (let i = Math.max(0, Math.floor((cz - AY * mpp - 200) / 1100)); i <= Math.ceil((cz + (H - AY) * mpp + 200) / 1100); i++) {
        const dep = (i + hsh(i, 91) * 0.6) * 1100; if (dep / 1.6 > FLOOR) continue;
        const y = AY + (dep - cz) / mpp, left = hsh(i, 92) < 0.5, im = bigLeaf(i % 3), sc = AP, w = im.width * sc, hh2 = im.height * sc;
        ctx.save(); ctx.translate(left ? -w * 0.22 : W + w * 0.22, sn(y)); ctx.rotate((left ? 1 : -1) * (0.22 + Math.sin(time * 0.7 + i) * 0.05 + (hsh(i, 94) - 0.5) * 0.5));
        if (!left) ctx.scale(-1, 1); ctx.drawImage(im, 0, -hh2 / 2, w, hh2); ctx.restore();
      }
    }
    // spore puffs, motes and sparks
    for (const q of puffs) { const i = q.t / q.life; pglow(F(q.x), F(yOf(q.m)), F(q.r * (0.5 + i)), 0.9 * (1 - i), DARK, 3); }
    // speed: thin dashed streaks up the edges of the frame while you plunge
    const sp = Math.abs(vel) / mpp;
    if (false) {
      const rp = rampOf('#d2ffdc');
      for (let q = 0; q < 30; q++) {
        const e = hsh(q, 201) * fw * 0.22, x = hsh(q, 200) < 0.5 ? e : fw - e, len = Math.min(110, sp * 0.06) * (0.5 + hsh(q, 204)), y = mod(hsh(q, 202) * (fh + 160) - time * 520 * (0.6 + hsh(q, 203)) * Math.sign(vel), fh + 160) - 80;
        for (let k = 0; k < len; k++) { const u = k / len, edge = Math.min(u, 1 - u) * 2; if (edge < 0.5 && (k & 1)) continue; pset(x, y + k, rp[edge > 0.7 ? 3 : 1], 2); }
      }
    }
    // light racing out along a tier line as you break through it
    for (const w of sweeps) {
      const u = w.t / 0.7, e = 1 - Math.pow(1 - u, 3), y = F(yOf(w.m)) | 0, half = e * fw * 0.55, a = 1 - u, rp = rampOf(w.color), xa = Math.max(0, fw / 2 - half | 0), xb = Math.min(fw - 1, fw / 2 + half | 0);
      for (let x = xa; x <= xb; x++) {
        pset(x, y, rp[4], 6);
        for (let k = 1; k <= 7; k++) if (BAYER[(x & 3) + ((k & 3) << 2)] < a * (1 - k / 8)) { const c = rp[k < 2 ? 3 : k < 4 ? 2 : 1]; pset(x, y - k, c, 5 - (k >> 1)); pset(x, y + k, c, 5 - (k >> 1)); }
      }
      for (const tx of [xa, xb]) { pglow(tx, y, 10, a, rp, 4); prect(tx - 1, y - 1, 3, 3, rp[4], 6); }
    }
    for (const q of parts) {
      const x = F(q.x), y = F(yOf(q.m)), a = 1 - q.t / q.life;
      if (q.mote) {
        // a mote: one bright dot that twinkles into a tiny cross
        const f = Math.min(1, q.t * 4) * Math.min(1, a * 2.5); if (f < 0.1) continue;
        const rp = rampOf(q.color), ph = ((time * 6 + q.ph * 3) | 0) & 3, mx = x + 2 * Math.sin(2.4 * time + q.ph);
        pglow(mx, y, 2 + q.r * 0.8, f * 0.7, rp, 3); pset(mx, y, rp[ph === 3 ? 2 : 4], 5);
        if (ph === 1 && f > 0.5) { pset(mx - 1, y, rp[3], 4); pset(mx + 1, y, rp[3], 4); pset(mx, y - 1, rp[3], 4); pset(mx, y + 1, rp[3], 4); }
      } else if (q.leaf) {
        // a leaf: four drawn frames as it turns, lit on one edge
        if (a < 0.08) continue;
        const rp = rampOf(q.color), fr = (((q.rot / 0.7854) | 0) % 4 + 4) % 4, c0 = rp[2], c1 = rp[3];
        if (fr === 0) { pset(x - 1, y, c0, 4); pset(x, y, c1, 4); pset(x + 1, y, c1, 4); pset(x + 2, y, c0, 4); pset(x, y - 1, c1, 4); pset(x + 1, y + 1, c0, 4); }
        else if (fr === 1) { pset(x - 1, y - 1, c0, 4); pset(x, y, c1, 4); pset(x + 1, y + 1, c1, 4); pset(x, y - 1, c0, 4); pset(x + 1, y, c0, 4); }
        else if (fr === 2) { pset(x, y - 1, c0, 4); pset(x, y, c1, 4); pset(x, y + 1, c1, 4); pset(x, y + 2, c0, 4); }
        else { pset(x + 1, y - 1, c0, 4); pset(x, y, c1, 4); pset(x - 1, y + 1, c1, 4); pset(x, y + 1, c0, 4); pset(x - 1, y, c0, 4); }
      } else {
        // a spark: white-hot head, a tail that cools from light to dim, and a small glow
        const rp = rampOf(q.color), hot = a > 0.7 ? 4 : a > 0.45 ? 3 : a > 0.2 ? 2 : 1;
        if (q.h) for (let k = 0; k < q.h.length - 1; k++) { const p0 = q.h[k], p1 = q.h[k + 1], age = (q.h.length - 1 - k) / q.h.length; pline(F(p0[0]), F(yOf(p0[1])), F(p1[0]), F(yOf(p1[1])), rp[Math.max(0, hot - 1 - ((age * 3) | 0))], 3); }
        pglow(x, y, 2 + q.r, a * 0.8, rp, 3);
        if (a > 0.5) prect(x, y, 2, 2, rp[4], 6); else pset(x, y, rp[hot], 6);
      }
    }
    const L = window.__lines, sinking = !!window.__sink, p = window.__sinkP == null ? 1 : window.__sinkP;
    const cx = W / 2 + (sinking && L ? wobble(p, L.tier) : 0);
    if (L && sinking) {
      // a soft glow around the falling answer
      const tc = TIERS[L.tier].color, rp = rampOf(SPARK[L.tier]), tl = 0, bx = F(cx), by = F(AY - 30), tk = (time * 30) | 0;
      // embers streaming up off the answer, thinning as they rise
      for (let k = 0; k < tl; k++) {
        const u = k / tl, half = 16 * (1 - u) * (1 - u) + 1, dens = (1 - u) * 0.22, wob = Math.sin((k + time * 40) * 0.2) * 2 * u, Y = (by - k) | 0;
        for (let x = -half | 0; x <= half; x++) { const X = (bx + x + wob) | 0; if (BAYER[(X & 3) + (((Y + tk) & 3) << 2)] < dens * (1 - Math.abs(x) / (half + 1))) pset(X, Y, rp[u < 0.15 ? 3 : u < 0.5 ? 2 : 1], 2); }
      }
      // toucan-tier answers come down with an escort
      if (L.tier === 1) [[-64, -26], [-88, 10], [64, -18], [88, 18], [-40, 34], [44, 38]].forEach((o, i) => spr('toucan', TIERS[1].color, cx + o[0] * 1.6, AY + o[1] + 6 * Math.sin(4 * time + i), 32, o[0] > 0, 0));
      if (L.tier === 3) { const sp = ctx.createRadialGradient(cx, AY, 66, cx, AY, 330); sp.addColorStop(0, 'rgba(2,8,4,0)'); sp.addColorStop(0.34, 'rgba(2,8,4,0.72)'); sp.addColorStop(1, 'rgba(2,8,4,0.96)'); ctx.fillStyle = sp; ctx.fillRect(0, 0, W, H); }
    }
    // moths circle an Obscura, then scatter when it lands
    if (orbit) {
      const hold = sinking ? 1 : 0.62;
      for (const n of orbit) {
        const rad = n.rad * hold * (1 + 7 * burstT), a = n.ang + time * n.w, ox = (sinking ? cx : W / 2) + Math.cos(a) * rad * 1.5, oy = AY + Math.sin(a) * rad * 0.62 + 4 * Math.sin(2.2 * time + n.ph);
        ctx.globalAlpha = Math.max(0, 0.92 - 1.15 * burstT); spr('moth', '#ffe08a', ox, oy, n.s, -Math.sin(a) * n.w > 0, 0);
      }
      ctx.globalAlpha = 1;
    }
    // (shockwave rings removed: the landing is carried by the burst, the flash and the card)
    if (flash > 0) {
      const rp = rampOf(flashC), cx0 = fw / 2, cy0 = F(AY);
      pglow(cx0, cy0, F(60 + (1 - flash) * 30), flash * 0.6, rp, 4);
      // a starburst: rays plotted as pixel lines, every fourth one long
      for (let q = 0; q < 0; q++) { const ang = q * 0.3927 + 0.2, r0 = F(30 + (1 - flash) * 120), r1 = r0 + F((q % 4 === 0 ? 150 : 70) * flash * (0.6 + hsh(q, 300) * 0.6)); pline(cx0 + Math.cos(ang) * r0, cy0 + Math.sin(ang) * r0, cx0 + Math.cos(ang) * r1, cy0 + Math.sin(ang) * r1, rp[flash > 0.5 ? 4 : 3], 6); }
      // and a thin horizontal flare through the middle
      const arm = F(W * 0.34 * flash);
      for (let x = -arm | 0; x <= arm; x++) { const edge = 1 - Math.abs(x) / (arm + 1); if (edge < 0.4 && (x & 1)) continue; pset(cx0 + x, cy0, rp[edge > 0.5 ? 4 : 3], 6); if (edge > 0.6) { pset(cx0 + x, cy0 - 1, rp[3], 5); pset(cx0 + x, cy0 + 1, rp[3], 5); } }
    }
    // the frog: sits by the dock, dives beside the answer, perches by the result
    const stage = bc.contains('sinking') ? 'sink' : bc.contains('quiet') ? 'landed' : bc.contains('trek') ? 'ask' : dive ? 'idle' : 'home';
    const tgt = stage === 'sink' ? { x: Math.min(cx + 150, W - 44), y: AY - 14, rot: 0.42 } : stage === 'landed' ? { x: W * 0.16, y: H * 0.28, rot: -0.14 } : stage === 'ask' ? { x: 48, y: H - 168, rot: 0 } : stage === 'home' ? { x: W * 0.72, y: sy + 70, rot: 0 } : { x: W * 0.72, y: H * 0.4, rot: 0.1 };
    const fk = 1 - Math.exp(-(stage === 'sink' ? 4.6 : 2.6) * dt);
    frog.x += (tgt.x - frog.x) * fk; frog.y += (tgt.y - frog.y) * fk; frog.rot += (tgt.rot - frog.rot) * fk;
    frog.hop = Math.max(0, frog.hop - dt * 2.2);
    const pal = window.__pal || { art: 'krill', color: '#ff7a45' }, gold = !!window.__gold;
    if (frog.moodT > 0) frog.moodT -= dt; else frog.mood = null;
    const sad = frog.mood === 'sad', loop = frog.mood === 'loop' ? 1 - Math.max(0, frog.moodT) / 1.25 : 0;
    const bob = (sad ? Math.sin(2.2 * time) * 3 + 8 : Math.sin(1.7 * time) * 6) - Math.sin(frog.hop * Math.PI) * 46 - Math.sin(loop * Math.PI) * 40;
    if (window.__perched && document.querySelector('.landed .perch')) { /* the companion is up on the result card */ } else {
    if (gold) halo(frog.x, frog.y + bob, 46, '#ffd166', 0.5 + 0.2 * Math.sin(time * 2.4));
    spr(pal.art, gold ? '#ffc23a' : pal.color, frog.x, frog.y + bob, 48, false, frog.rot + (sad ? 0.5 : 0) + Math.sin(1.1 * time) * 0.07 + frog.hop * frog.hop * 6.283 - loop * 6.283);
    if (gold && !reduce && time - (frog.gs || 0) > 0.55) { frog.gs = time; fx.burst(frog.x + D(-10, 10), frog.y + bob + D(-6, 10), R() < 0.5 ? '#ffd166' : '#ffe9a8', 1, 0.15); }
    }
    if (!reduce && time - frog.emit > 2.2 + R()) { frog.emit = time; fx.bubble(frog.x + 20, frog.y + bob - 8, 1.5 + 2 * R()); }
    // depth ruler, notes, vignette
    const trek = bc.contains('trek');
    if (vig) { const o = Math.min(0.4, 0.25 + Math.max(0, camS) / 8000).toFixed(2); if (vig.style.opacity !== o) vig.style.opacity = o; }
    if (ruler) ruler.hidden = !trek;
    if (notes) notes.hidden = !trek || bc.contains('quiet');
    if (trek) {
      const rx = W - 16;
      ctx.strokeStyle = 'rgba(190,214,184,.55)'; ctx.fillStyle = 'rgba(190,214,184,.55)'; ctx.lineWidth = 2;
      ctx.fillRect(rx, Math.max(0, sy), 2, H);
      let n = 0;
      for (let m = Math.max(0, Math.floor((camS - AY * mpp) / 10) * 10); ; m += 10) {
        const y = yOf(m); if (y > H + 4) break; if (y < -4) continue;
        const t = m % 100 === 0 ? 16 : m % 50 === 0 ? 10 : 5;
        ctx.fillRect(rx - t, sn(y), t, 2);
        if (m % 100 === 0 && ruler && n < ruler.children.length) { const el = ruler.children[n++]; el.textContent = m ? '-' + m.toLocaleString('en-US') + 'm' : '0m'; el.style.transform = 'translateY(' + sn(y - 9) + 'px)'; el.hidden = false; }
      }
      if (ruler) for (; n < ruler.children.length; n++) ruler.children[n].hidden = true;
      // where you are on it
      ctx.fillStyle = '#ff7a45'; ctx.beginPath(); ctx.moveTo(rx + 4, AY); ctx.lineTo(rx + 12, AY - 5); ctx.lineTo(rx + 12, AY + 5); ctx.closePath(); ctx.fill(); ctx.fillRect(rx - 20, AY - 1, 22, 2); ctx.font = '13px VT323, monospace'; ctx.textAlign = 'right'; ctx.fillText('YOU', rx - 24, AY + 4);
      if (notes) for (let i = 0; i < NOTES.length; i++) { const y = yOf(NOTES[i][0]), el = notes.children[i]; if (y < 90 || y > H - 150) { if (!el.hidden) el.hidden = true; } else { el.hidden = false; el.style.transform = 'translateY(' + sn(y - 10) + 'px)'; } }
      const hd = $('hud-depth'), txt = fmt(Math.round(Math.max(0, cam))) + 'm';
      if (hd && hd.textContent !== txt) { hd.textContent = txt; if (time - lastCrank > 0.11) { lastCrank = time; restart(hd, 'crank'); } }
    }
    // tier lines and the falling answer
    if (over) {
      over.classList.toggle('on', !!L);
      if (L) {
        ensureOverlay();
        const kids = over.children;
        if (linesId !== L.id) { linesId = L.id; for (let i = 0; i < 5; i++) kids[i].classList.remove('passed', 'flash'); kids[5].lastChild.textContent = L.label.replace(' ▼', ''); kids[5].style.setProperty('--cc', TIERS[L.tier].color); kids[5].classList.remove('bump'); kids[5].classList.toggle('gold', L.tier === 4); }
        for (let i = 0; i < 5; i++) {
          const d = L.base + TIERS[i].pts * M_PER_PT, el = kids[i];
          el.style.transform = 'translateY(' + sn(yOf(d)) + 'px)';
          if (i <= L.tier && cam >= d - 4 && !el.classList.contains('passed')) {
            el.classList.add('passed', 'flash'); snd('line', i); if (i !== L.tier) fx.burst(W / 2, yOf(d), SPARK[i], 7, 0.5);
          }
        }
        const wx = sinking ? wobble(p, L.tier) : 0;
        kids[5].style.transform = 'translate3d(calc(-50% + ' + wx.toFixed(1) + 'px), ' + sn(AY - 24) + 'px, 0) rotate(' + (wx * (L.tier === 0 ? 0.55 : L.tier === 4 ? 0.5 : 0.4)).toFixed(2) + 'deg)';
        kids[5].style.opacity = sinking ? '1' : '0';
      }
    }
    fxFlush();
  }
  const easeIO = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, easeSine = p => -(Math.cos(Math.PI * p) - 1) / 2;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    if (hold > 0) { hold -= dt; draw(0); return; }
    if (!reduce) time += dt;
    const dive = document.body.classList.contains('dive'), prevS = camS, sk = window.__sink;
    const at = H * (dive ? 0.3 : 0.36); AY = AY ? AY + (at - AY) * (1 - Math.exp(-dt * 5)) : at;
    if (sk && sk.rise) {
      // the climb back out: straight up to the canopy, no fanfare
      if (sk.from == null) sk.from = cam;
      const p = reduce ? 1 : Math.min(1, (now - sk.start) / (sk.dur * 1000));
      cam = sk.from + (sk.to - sk.from) * easeIO(p); window.__sinkP = 1;
      if (p >= 1) window.__sink = null;
    } else if (sk) {
      const tr = window.__lines ? window.__lines.tier : 1;
      if (sk.from == null) sk.from = cam;
      const p = reduce ? 1 : Math.min(1, (now - sk.start) / (sk.dur * 1000));
      cam = sk.from + (sk.to - sk.from) * (tr === 0 ? easeSine(p) : easeIO(p));
      window.__sinkP = p;
      const cx = W / 2 + wobble(p, tr);
      if (!sk.began) {
        sk.began = true; orbit = null; burstT = 0; snd('sink', { tier: tr, dur: sk.dur });
        if (tr === 0) { frog.mood = 'sad'; frog.moodT = sk.dur + 0.8; }
        if (tr === 2) { fx.flash('rgba(255,82,82,.4)', 1, 220); fx.puff(cx, AY, 10); }
        // the Obscura brings company, as Krillion's rarest tier does: moths circling the falling answer
        if (tr === 4) { fx.flash('rgba(255,209,102,.45)', 1, 180); orbit = Array.from({ length: W < 700 ? 14 : 20 }, () => ({ ang: R() * 6.283, rad: 30 + 48 * R(), w: (0.7 + 1.5 * R()) * (R() < 0.5 ? -1 : 1), ph: 9 * R(), s: 15 + 13 * R() })); }
      }
      if (!reduce && p < 1) {
        if (tr === 0) { if (R() < 0.25) fx.bubble(cx + D(-30, 30), AY, 1.2 + 1.8 * R(), '160,176,160'); }
        else if (tr === 2) { if (R() < 0.09) fx.puff(cx + D(-20, 20), AY - 10, 3); }
        else if (tr === 3) { if (R() < 0.3) fx.bubble(cx + D(-20, 20), AY, 1 + 2 * R()); }
        else if (tr === 4) { if (R() < 0.5) fx.bubble(cx + D(-30, 30), AY, 1.5 + 2 * R(), '255,224,138'); }
        else if (R() < 0.6) fx.bubble(cx + D(-34, 34), AY + D(-8, 4), 1.5 + 2.5 * R());
      }
      if (p >= 1) {
        window.__sink = null; window.__sinkP = 1;
        // landing, rarity by rarity as Krillion does it: no freeze-frame, no zoom jolt, no glow disc
        flash = 0; punch = 0; hold = 0; snd('impact', tr); snd('land', tr);
        if (tr === 0) fx.burst(W / 2, AY, '#8fa3c4', 8, 0.4);
        else if (tr === 1) fx.burst(W / 2, AY, SPARK[1], 22, 0.8);
        else if (tr === 2) { fx.puff(W / 2, AY, 22); fx.burst(W / 2, AY, SPARK[2], 26, 0.9); fx.shake(); fx.flash('rgba(255,82,82,.45)', 1, 240); }
        else if (tr === 3) fx.burst(W / 2, AY, SPARK[3], 18, 0.7);
        else {
          frog.mood = 'loop'; frog.moodT = 1.25; fx.flash('rgba(255,209,102,.35)', 1, 220); if (orbit) orbit.keep = true;
          if (window.__obscura) window.__obscura(AY);
          // a burst of gold as each letter of the name slams down
          if (!reduce) for (let q = 0; q < 7; q++) setTimeout(() => { fx.burst(W / 2 + (q - 3) * Math.min(64, W * 0.12), AY + 118, ['#ffd166', '#ffe9a8', '#fff6d8'][q % 3], 9, 0.55); if (q === 0 || q === 6) fx.shake(); }, 640 + q * 90);
          setTimeout(() => { window.__gold = true; burstT = 0.0001; fx.burst(W / 2, AY, '#ffd166', 16, 0.7); for (let k = 0; k < 12; k++) fx.burst(W / 2 + D(-18, 18), AY + D(-18, 18), ['#ffd166', '#ffe9a8', '#ff7a45', '#7dffb0'][k % 4], 1, 0.2); }, 1000);
        }
      }
    } else {
      const target = dive ? (window.__depth || 0) : 0;
      cam = reduce ? target : cam + (target - cam) * (1 - Math.exp(-dt * 2));
      if (Math.abs(target - cam) < 0.05) cam = target;
    }
    if (time - ambT > 0.5) { ambT = time; if (window.__amb) window.__amb(camS < 300 ? 'canopy' : camS < FLOOR ? 'forest' : biomeOf(camS).kind); }
    // the view trails the camera slightly and breathes when idle
    camS += (cam - camS) * (reduce ? 1 : 1 - Math.exp(-6 * dt)); if (Math.abs(cam - camS) < 0.02) camS = cam;
    camS += reduce ? 0 : 0.012 * Math.sin(0.45 * time);
    vel = dt ? (camS - prevS) / dt : 0;
    { let z = -1; for (let i = 0; i < NOTES.length; i++) if (NOTES[i][2] && cam >= NOTES[i][0]) z = i;
      if (zoneAt === -1 && !document.body.classList.contains('trek')) zoneAt = z;
      else if (z > zoneAt && document.body.classList.contains('trek')) { zoneAt = z; const el = $('zone'); if (el) { el.firstChild.textContent = ''; el.lastChild.textContent = '── ' + NOTES[z][1]; restart(el, 'show'); } snd('zone'); }
      else if (z < zoneAt) zoneAt = z; }
    for (const q of parts) {
      q.t += dt; q.px = q.x; q.pm = q.m; q.x += q.vx * dt; q.m += q.vm * dt;
      if (q.leaf) { q.rot += q.spin * dt; q.vx = q.vx * (1 - 2.2 * dt) + Math.sin(time * 3 + q.ph) * 40 * dt; q.vm = q.vm * (1 - 2.2 * dt) + 70 * mpp * dt; }
      else if (q.mote) { q.vx *= 1 - 1.2 * dt; }
      else { q.vx *= 1 - 2.4 * dt; q.vm = q.vm * (1 - 2.4 * dt) + 26 * mpp * dt; (q.h || (q.h = [])).push([q.x, q.m]); if (q.h.length > 6) q.h.shift(); }
    }
    for (const rg of rings) rg.t += dt; if (rings.length && rings[0].t >= rings[0].life) rings = rings.filter(rg => rg.t < rg.life);
    for (const w of sweeps) w.t += dt; if (sweeps.length && sweeps[0].t >= 0.7) sweeps = sweeps.filter(w => w.t < 0.7);
    punch = Math.max(0, punch - dt * 3.2);
    if (parts.length && parts.some(q => q.t >= q.life)) parts = parts.filter(q => q.t < q.life);
    for (const q of puffs) { q.t += dt; q.vx *= 1 - 1.6 * dt; q.vm *= 1 - 1.6 * dt; q.x += q.vx * dt; q.m += q.vm * dt; }
    if (puffs.length && puffs.some(q => q.t >= q.life)) puffs = puffs.filter(q => q.t < q.life);
    flash = Math.max(0, flash - dt * 1.5);
    if (burstT > 0) { burstT += dt / 1.5; if (burstT >= 1) { burstT = 0; orbit = null; } }
    if (orbit && !orbit.keep && !window.__sink && !window.__lines && burstT === 0) orbit = null;
    draw(dt);
    if (bloomX && !window.__low && cv.width > 0 && cv.height > 0 && W > 0 && H > 0 && (bloomN++ & 1) === 0) { const bw = Math.max(1, Math.ceil(W / 4)), bh = Math.max(1, Math.ceil(H / 4)); if (bloomC.width !== bw || bloomC.height !== bh) { bloomC.width = bw; bloomC.height = bh; } bloomX.drawImage(cv, 0, 0, bw, bh); const bo = (camS > FLOOR ? 0.78 : 0.5).toFixed(2); if (bloomC.style.opacity !== bo) bloomC.style.opacity = bo; }
  }
  addEventListener('pointerdown', e => { if (frog.hop > 0 || Math.hypot(e.clientX - frog.x, e.clientY - frog.y) > 36 || (e.target.closest && e.target.closest('button, input, select'))) return; frog.hop = 1; snd('ribbit'); { const pop = h('span', { class: 'ribbit', 'aria-hidden': 'true', text: (window.__pal && window.__pal.id !== 'frog') ? 'hey!' : 'ribbit!', style: 'left:' + Math.round(frog.x) + 'px;top:' + Math.round(frog.y - 34) + 'px' }); document.body.append(pop); setTimeout(() => pop.remove(), 1000); } for (let q = 0; q < 6; q++) fx.bubble(frog.x + D(-16, 26), frog.y - 16, 1 + 3 * R()); fx.burst(frog.x, frog.y, '#ff7a45', 10, 0.5); });
  // deep down, the pointer leaves a trail of sparks
  addEventListener('pointermove', e => { const now = performance.now(); if (reduce || camS < 550 || now - lastTrail < 50 || parts.length > 250) return; lastTrail = now; parts.push({ x: e.clientX + D(-6, 6), m: toM(e.clientY) + D(-4, 4) * mpp, vx: D(-14, 14), vm: D(-10, 10) * mpp * 0.5, r: 1.6, life: 0.9, t: 0, color: '#e8ff7a' }); });
  if (ruler) for (let i = 0; i < 10; i++) ruler.append(h('span'));
  if (notes) NOTES.forEach(([, label, major], i) => notes.append(h('span', { class: (major ? 'major' : '') + (i % 2 ? ' r' : ''), text: i % 2 ? label + ' ──' : '── ' + label })));
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(build, 150); });
  build();
  window.__rebuild = () => { for (const k2 in tinted) delete tinted[k2]; build(); };
  window.__sea = () => {};
  window.__jump = d => { window.__depth = d; cam = camS = d; };
  requestAnimationFrame(frame);
})();

/* ---------- boot ---------- */
render();
(async () => {
  const c = window.claude;
  if (!c || !c.use) { S.dbState = 'none'; return render(); }
  try {
    const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
    if (user) {
      const uid = await user.id();
      if (uid) S.me.id = uid;
      S.canWrite = await user.can('data.write');
    }
    S.db = db; S.dbState = db ? 'ready' : 'none';
  } catch (e) { S.dbState = 'none'; }
  render();
  const last = ls.get('code');
  if (S.db && last && !S.mode && S.me.name && S.canWrite !== false) joinRoom(last, true);
})();
})();
