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
// (runs of i are kept, so Henry VI and Henry VIII stay apart)
const loose = k => k.replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/z/g, 's').replace(/y/g, 'i').replace(/([^i])\1+/g, '$1').replace(/e$/, '');
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
// Near-duplicate prompts are folded into their twin: the answers move over, one tier deeper at the top
for (const [from, to] of Object.entries(window.FOLD || {})) {
  const a = window.BANK.find(x => x && x.id === from), b = window.BANK.find(x => x && x.id === to);
  if (!a || !b || a === b) continue;
  const add = ['', [a.t[0], a.t[1]].filter(Boolean).join(', '), a.t[2] || '', [a.t[3], a.t[4]].filter(Boolean).join(', '), ''];
  b.t = b.t.map((s, i) => add[i] ? (s ? s + ', ' : '') + add[i] : s);
}
// A few joke answers that would only spoil a round are taken out wherever they appear
// ("prompt id::Answer" takes it out of just that prompt).
{
  const ban = new Set((window.BAN || []).filter(x => !x.includes('::')).map(norm)), banIn = {};
  for (const x of window.BAN || []) if (x.includes('::')) { const [id, n] = x.split('::'); (banIn[id] = banIn[id] || new Set()).add(norm(n)); }
  for (const t of window.BANK) {
    if (!t || !Array.isArray(t.t)) continue;
    const bad = f => ban.has(norm(f)) || (banIn[t.id] && banIn[t.id].has(norm(f)));
    t.t = t.t.map(str => String(str || '').split(',').map(raw => {
      const forms = raw.split('|').map(x => x.trim()).filter(Boolean);
      // a banned joke takes its whole entry with it; a spelling wrong for one prompt ("Czech Republic" for a
      // country ending in a vowel) leaves the entry's other spellings ("Czechia") standing
      if (!forms.length || ban.has(norm(forms[0]))) return '';
      return forms.filter(f => !bad(f)).join('|');
    }).filter(Boolean).join(', '));
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
      // shown with a capital ("teacher" → "Teacher"), but brand styles like iPhone or eBay stay as written
      if (!e) { e = { name: /^[a-z](?![A-Z])/.test(forms[0]) ? forms[0][0].toUpperCase() + forms[0].slice(1) : forms[0], tier, toks: [], forms: [] }; list.push(e); }
      for (const f of forms) if (!e.forms.includes(f)) e.forms.push(f);
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
  // An answer that repeats the prompt's own words ("Deep-fried Oreos" for a deep-fried food, "Banana bread" for a
  // bread) also works without them: "Oreo", "banana". Only when that leftover points at one answer alone.
  const PW_SKIP = new Set(['name', 'that', 'this', 'with', 'from', 'have', 'has', 'the', 'and', 'for', 'who', 'was', 'are', 'you', 'your', 'its', 'not', 'can', 'one', 'some', 'something', 'thing', 'things', 'famous', 'type', 'kind', 'word', 'words', 'often', 'usually', 'might', 'would', 'could', 'been', 'their', 'than', 'into', 'out', 'any', 'all', 'more', 'less']);
  const pw = new Set(String(t.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 2 && !PW_SKIP.has(w)));
  if (pw.size) {
    const isPw = w => { w = w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); return !!w && (pw.has(w) || pw.has(w.replace(/s$/, '')) || pw.has(w + 's')); };
    const cand = new Map();
    for (const e of list) for (const f of e.forms) {
      const toks = f.split(/[\s\-]+/).filter(Boolean); let a = 0, b = toks.length;
      while (a < b && isPw(toks[a])) a++;
      while (b > a && isPw(toks[b - 1])) b--;
      if (a >= b || (a === 0 && b === toks.length)) continue;
      const k = norm(toks.slice(a, b).join(' '));
      if (k.length < 3 || map.has(k)) continue;
      if (!cand.has(k)) cand.set(k, new Set()); cand.get(k).add(e);
    }
    for (const [k, s] of cand) if (s.size === 1) { const e = [...s][0]; map.set(k, e); if (!lmap.has(loose(k))) lmap.set(loose(k), e); }
  }
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
// On the live site the answers are split into shards and fetched per prompt (see tools/shard.js): the page
// only carries a catalog of names. In the local editor every bank is loaded up front and this does nothing.
const CAT = window.CATALOG || {};
for (const id in CAT) { const c = CAT[id]; RAW[id] = { id, name: c[0], blurb: c[1], pack: c[2] || undefined, n: c[3], s: c[4], t: null }; }
for (const t of window.BANK || []) if (t && t.id && Array.isArray(t.t) && t.t.some(x => x && String(x).trim()) && (!RAW[t.id] || !RAW[t.id].t)) RAW[t.id] = t;
const shardWant = new Map(); let shardTick = null;
const stubTopic = (id, name, blurb) => ({ id, name: name || '…', blurb: blurb || '', map: new Map(), words: new Map(), lmap: new Map(), list: [], star: { name: '', tier: 4, toks: [], fact: '' }, stub: true });
function needIds(ids) {
  const out = [];
  for (const id of ids) { if (!id) continue; const dv = !RAW[id] && DERIVED_BY && DERIVED_BY[id]; const src = dv ? dv.from : [id];
    for (const s of src) { const R = RAW[s]; if (!R || R.t || R.s == null) continue; let p = shardWant.get(R.s);
      if (!p) { p = new Promise(res => { const el = document.createElement('script'); el.src = 'shards/s' + String(R.s).padStart(2, '0') + '.js'; el.async = true; el.onload = res; el.onerror = () => { shardWant.delete(R.s); res(); }; document.head.append(el); }); shardWant.set(R.s, p); }
      out.push(p); } }
  return Promise.all(out);
}
window.__shard = data => {
  for (const id in data) { const R = RAW[id]; if (!R || R.t) continue; const d = data[id]; if (Array.isArray(d)) R.t = d; else { R.t = d.t; if (d.k) R.k = d.k; if (d.ob) R.ob = d.ob; } }
  // re-draw anything that was showing a placeholder (never mid-answer, so typing is not disturbed)
  clearTimeout(shardTick); shardTick = setTimeout(() => { try { if (S.room && !(S.room.phase === 'play' && diveState().stage === 'ask')) render(); } catch (e) { /* not ready yet */ } }, 60);
};
for (const id in RAW) Object.defineProperty(TOPICS, id, { enumerable: true, configurable: true, get() { if (!RAW[id].t) { needIds([id]); return stubTopic(id, RAW[id].name, RAW[id].blurb); } const v = buildTopic(RAW[id]); Object.defineProperty(TOPICS, id, { value: v, enumerable: true }); return v; } });
// Broad school-quiz categories make dull prompts. They stay in the bank as raw material
// for the oddly specific prompts below, but are never offered on their own.
const HIDDEN = new Set(['foods', 'u2_foodb', 'u2_foodc', 'u2_foodp', 'u2_foods', 'u2_foodt', 'q2_animalk', 'q2_animalp', 'q2_animalb', 'q2_animalg', 'q2_animalq', 'q2_animale', 'q2_animalo', 'q2_animali', 'q2_animalm', 'q2_animalw', 'q2_animalh', 'q2_animald', 'q2_animall', 'q2_animalt', 'q2_animalr', 'q2_animalz', 'v2_food_e', 'v2_food_ij', 'v2_food_k', 'v2_food_l', 'v2_food_n', 'v2_food_o', 'v2_food_w', 'v7_animala', 'v7_animalc', 'v7_animalf', 'v7_animals', 'v7_animaljn', 'v7_animaluvy', 'v7_animal3', 'v7_animalz', 'v7_animaldouble', 'v7_animalcolour', 'v7_fooda', 'v7_foodd', 'v7_foodf', 'v7_foodg', 'v7_foodh', 'v7_foodm', 'v7_foodr', 'v7_foodz', 'composers', 'philosophers', 'emperors', 'painters', 'authors', 'novels', 'battles', 'empires', 'monarchs', 'explorers', 'scientists', 'presidents', 'bible', 'phobias', 'greekmyth', 'constellations', 'bones', 'gems', 'grapes', 'dances', 'musicals', 'shakespeare', 'money', 'trees', 'languages', 'code', 'capitals', 'elements', 'tube', 'ukplaces', 'nationalparks', 'deserts', 'waters', 'mountains', 'rivers', 'islands', 'eurocities', 'asiacities', 'africacities', 'uscities', 'spaceobjects', 'illnesses', 'catbreeds', 'flowers', 'fish', 'reptiles', 'bestpicture', 'breads', 'beers', 'spices', 'instruments', 'cheese', 'genres', 'rockbands', 'popstars', 'rappers', 'birds', 'mammals', 'sea', 'insects', 'countries', 'states', 'cars', 'sports', 'dogs', 'vegetables', 'fruits', 'tools', 'clothing', 'desserts', 'dishes', 'cocktails', 'pasta', 'candy', 'gods', 'dinosaurs', 'bodyparts', 'sitcoms', 'cartoons', 'videogames']);
const COLOURS = /\b(red|blue|green|black|white|gold|golden|silver|grey|gray|yellow|orange|pink|purple|scarlet|crimson|violet|brown|ruby|emerald|amber|blond|blonde|rosy|rose|snowy|snow)\b/i;
const ANIMALS = ['mammals', 'birds', 'sea', 'reptiles', 'insects', 'fish'];
const CITIES = ['uscities', 'eurocities', 'asiacities', 'africacities', 'capitals'];
const one = n => !/[\s\-]/.test(n);
// Food answers for the letter prompts: every food bank plus the hand-written letter lists
const FOODS = ['foods', 'fruits', 'vegetables', 'cheese', 'pasta', 'spices', 'sandwiches', 'dumplings', 'cereals', 'candy', 'p1_soup', 'breakfast', 'n3_biscuit', 'p1_indian', 'p1_rice', 'p1_french', 'p1_chinese', 'p1_japanese', 'p1_mexican', 'p1_spanish', 'p1_korean', 'p1_thai', 'p1_greek', 'p1_british', 'p1_cake', 'p1_bread', 'p2_nuts', 'q7_italiannotpasta', 'u2_chocdessert', 'u2_moviesnack'];
const LETTER = (what, from, letters, extra) => letters.map(L => ({ id: 'x_' + what + L.toLowerCase().replace(/\W/g, ''), name: 'Name ' + (what === 'animal' ? 'an animal' : 'a food') + ' that starts with ' + L.split('').join(' or '), blurb: 'The name you type has to start with ' + L.split('').join(' or ') + (what === 'animal' ? '; any real animal, living or extinct' : ''), from: from.concat(extra.filter(x => x.slice(3).replace(/_/g, '').endsWith(what + L.toLowerCase()))), test: n => L.includes(n.replace(/^(the|a|an)\s+/i, '').normalize('NFD')[0].toUpperCase()), typed: true }));
// Each takes answers from existing prompts and keeps the ones that pass its test.
const DERIVED = [
  { id: 'x_and', name: 'Name a country with “an” in its name', from: ['countries'], test: n => /an/i.test(n) },
  { id: 'x_land', name: 'Name a country ending in “land” or “stan”', from: ['countries'], test: n => /(land|stan)$/i.test(n) },
  { id: 'x_short', name: 'Name a country with four or five letters', from: ['countries'], test: n => one(n) && n.length >= 4 && n.length <= 5 },
  { id: 'x_island', name: 'Name a country that is an island or islands', from: ['countries'], test: n => /^(Japan|Iceland|Ireland|United Kingdom|Cuba|Jamaica|Haiti|Dominican Republic|Bahamas|Barbados|Trinidad and Tobago|Madagascar|Sri Lanka|Singapore|Indonesia|Philippines|New Zealand|Australia|Fiji|Malta|Cyprus|Maldives|Mauritius|Seychelles|Samoa|Tonga|Papua New Guinea|Bahrain|Brunei|East Timor|Vanuatu|Solomon Islands|Grenada|Saint Lucia|Dominica|Antigua and Barbuda|Comoros|Sao Tome and Principe|Cape Verde|Saint Kitts and Nevis|Saint Vincent and the Grenadines|Kiribati|Tuvalu|Nauru|Palau|Marshall Islands|Micronesia)$/.test(n) },
  { id: 'x_newstate', name: 'Name a US state with two words in its name', from: ['states'], test: n => /\s/.test(n) },
  { id: 'x_stateA', name: 'Name a US state that ends in the letter A', from: ['states'], test: n => /a$/i.test(n) },
  { id: 'x_double', name: 'Name an animal with a double letter in its name', blurb: 'One-word names only, like giraffe', from: ANIMALS.concat(['v7_animaldouble']), test: n => one(n) && /([a-z])\1/i.test(n) },
  { id: 'x_three', name: 'Name an animal with a three-letter name', from: ANIMALS.concat(['v7_animal3']), test: n => one(n) && n.length === 3 },
  { id: 'x_colouranimal', name: 'Name an animal with a colour in its name', blurb: 'Like blue whale', from: ANIMALS.concat(['v7_animalcolour']), test: n => COLOURS.test(n) },
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
  ...LETTER('animal', ANIMALS.concat(['dogs', 'dinosaurs']), ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'JN', 'K', 'L', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'UVY', 'W'], ['v7_animala', 'v7_animalc', 'v7_animalf', 'v7_animals', 'v7_animaljn', 'v7_animaluvy', 'q2_animalk', 'q2_animalp', 'q2_animalb', 'q2_animalg', 'q2_animalq', 'q2_animale', 'q2_animalo', 'q2_animali', 'q2_animalm', 'q2_animalw', 'q2_animalh', 'q2_animald', 'q2_animall', 'q2_animalt', 'q2_animalr']),
  { id: 'x_animalz', name: 'Name an animal with a Z in its name', from: ANIMALS.concat(['dogs', 'dinosaurs', 'v7_animalz', 'q2_animalz']), test: n => /z/i.test(n), typed: true },
  ...LETTER('food', FOODS, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'IJ', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'W'], ['v7_fooda', 'v7_foodd', 'v7_foodf', 'v7_foodg', 'v7_foodh', 'v7_foodm', 'v7_foodr', 'v2_food_e', 'v2_food_ij', 'v2_food_k', 'v2_food_l', 'v2_food_n', 'v2_food_o', 'v2_food_w', 'u2_foodb', 'u2_foodc', 'u2_foodp', 'u2_foods', 'u2_foodt']),
  { id: 'x_foodz', name: 'Name a food with a Z in its name', from: FOODS.concat(['v7_foodz']), test: n => /z/i.test(n), typed: true },
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
var DERIVED_BY = {}; for (const dv of DERIVED) DERIVED_BY[dv.id] = dv;
for (const dv of DERIVED) {
  // on the live site these come prebuilt in the catalog and shards (tools/shard.js), so they load like any prompt
  if (RAW[dv.id] || !dv.from.some(id => RAW[id])) continue;
  Object.defineProperty(TOPICS, dv.id, { enumerable: true, configurable: true, get() { if (dv.from.some(id => RAW[id] && !RAW[id].t)) { needIds([dv.id]); return stubTopic(dv.id, dv.name, dv.blurb); } const v = buildDerived(dv); Object.defineProperty(TOPICS, dv.id, { value: v, enumerable: true }); return v; } });
}
const usable = id => { const R = RAW[id]; if (R && !R.t) return (R.n || 0) >= 12; if (!R && DERIVED_BY[id] && DERIVED_BY[id].from.some(s => RAW[s] && !RAW[s].t)) return true; try { return TOPICS[id].list.length >= 12; } catch (e) { return false; } };
const CUT = new Set(window.CUT || []);
const TOPIC_IDS = Object.keys(RAW).filter(id => !HIDDEN.has(id)).concat(DERIVED.filter(dv => !RAW[dv.id] && dv.from.some(id => RAW[id])).map(dv => dv.id)).filter(id => !CUT.has(id));
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
// The words a saying dropped ("lake", "river", "games"): if the prompt is about that kind of thing the
// answer is taken as typed, otherwise ("Lake Burton" for an NBA player) it's offered as a correction.
function droppedFits(T, input, v) {
  const ctx = (String(T.name) + ' ' + String(T.blurb || '')).toLowerCase();
  const a = String(input).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean), b = new Set(String(v).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/));
  for (const w of a) { if (b.has(w) || /^(?:the|st|saint|\d+(?:st|nd|rd|th)?|[ivx]+|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth)$/.test(w)) continue;
    const stem = w === 'mt' ? 'moun' : w === 'np' ? 'park' : w === 'dr' ? 'doc' : w === 'czar' ? 'tsar' : w.slice(0, 4);
    if (!ctx.includes(stem) && !(stem === 'king' || stem === 'quee' ? /monarch|royal|ruler|king|queen/.test(ctx) : false)) return false; }
  return true;
}
// Players often pad an answer with words from the prompt ("lori loud" for a Loud House character) or say
// where it's from ("neo from the matrix"). Only when nothing else matched, try again without that padding;
// whatever it finds is offered as a correction, so the player still confirms it.
const PROMPT_SKIP = new Set(['name', 'a', 'an', 'the', 'of', 'or', 'and', 'that', 'is', 'in', 'from', 'with', 'who', 'has', 'have', 'famous', 'something', 'thing', 'you', 'your', 'its', 'it', 'by', 'to', 'for', 'one', 'not', 'usually', 'can']);
function match(topicId, input) {
  // letter prompts: what was typed has to fit the rule too, so "tiger" can't become "Siberian tiger"
  const dv = DERIVED_BY[topicId];
  if (dv && dv.typed && !dv.test(String(input).trim())) { const m = matchCore(topicId, input); return m && !m.amb && norm(m.e.name) === norm(input) ? m : null; }
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
  // a mistyped 'the' ("teh", "thhe", "tha") in front of the answer
  const tht = raw.replace(/^(?:th|teh|tha|thee|thhe|te|tbe|tse|tho|thu|tte|rhe|yhe|hte|eth)\s+(?=\S{3})/i, ''); if (tht !== raw) tries.push(tht);
  if (/^the\S{5}/i.test(raw)) tries.push(raw.slice(3));
  const mine = raw.replace(/\b(?:my|your|his|her|their)\b/gi, 'the'); if (mine !== raw) tries.push(mine);
  if (kept.length > 1) { const tidy = kept.filter(w => !/^(?:the|a|an|my)$/i.test(w)); if (tidy.length && tidy.length < kept.length) tries.push(tidy.join(' ')); }
  for (const t of tries) { if (norm(t).length < 3) continue; const r2 = matchCore(topicId, t); if (r2 && !r2.amb) return Object.assign({}, r2, { fix: true }); }
  return r;
}
function matchCore(topicId, input) {
  const T = TOPICS[topicId], k = norm(input);
  if (!T || !k) return null;
  if (T.map.has(k)) return { e: T.map.get(k), fix: false };
  // "TheGrinch", "Th eBoondocks": a leading 'the' that the spaces didn't separate
  if (k.length > 5 && k.startsWith('the') && T.map.has(k.slice(3))) return { e: T.map.get(k.slice(3)), fix: false };
  if (k.length > 4 && k.startsWith('st') && T.map.has('saint' + k.slice(2))) return { e: T.map.get('saint' + k.slice(2)), fix: false };
  if (k.length >= 4) for (const x of [k + 's', k + 'es', k.replace(/s$/, ''), k.replace(/(s|x|z|ch|sh|o)es$/, '$1'), k.replace(/ies$/, 'y')]) if (x && x !== k && T.map.has(x)) return { e: T.map.get(x), fix: false };
  for (const v of sayings(input)) { const kv = norm(v); if (kv && kv !== k && T.map.has(kv)) return { e: T.map.get(kv), fix: !droppedFits(T, input, v) }; }
  if (k.length < 4) return null;
  const one = set => set.size === 1 ? { e: [...set][0], fix: true } : set.size ? { amb: true } : null;
  // A bare name or word shared by several answers is a lucky dip: it always resolves to the same
  // one for a given prompt, which may turn out common or very rare. The player still confirms it.
  // in a huge list a word shared by a crowd of answers ("bird" among 600 birds) is too vague to dip into: ask for more
  const crowd = set => set.size > 6 && T.list.length > 1500;
  const dip = set => { if (crowd(set)) return { amb: true }; const arr = [...set].sort((a, b) => a.name < b.name ? -1 : 1); let hsum = 7; for (const ch of topicId + ':' + k) hsum = (hsum * 31 + ch.charCodeAt(0)) >>> 0; return { e: arr[hsum % arr.length], fix: true, dip: arr.length > 1 }; };
  if (GIVEN.has(k)) return T.words.has(k) ? dip(T.words.get(k)) : null;
  // spelt the way it sounds
  const lk = loose(k);
  if (T.lmap.has(lk)) return { e: T.lmap.get(lk), fix: true };
  // typos: same first letter, a small number of slips, and one clear closest answer
  // the slip allowance is judged on the part that isn't the prompt's own words, so "deep fried lobster"
  // is not a near-miss of "Deep-fried butter" just because the long shared start makes them look alike
  if (!T._pw) T._pw = new Set(String(T.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 2 && !['name', 'that', 'with', 'from', 'have', 'something', 'thing', 'famous', 'type', 'kind'].includes(w)));
  const own = String(input).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(w => w && !T._pw.has(w) && !T._pw.has(w.replace(/s$/, ''))).join('');
  const max = own && own.length < k.length ? Math.min(typoBudget(k.length), Math.max(1, typoBudget(own.length))) : typoBudget(k.length);
  let best = max + 1, hits = new Set(), longer = new Set();
  for (const [key, e] of T.map) {
    if (key.length < 4 || (key[0] !== k[0] && loose(key)[0] !== lk[0])) continue;
    // a near miss as typed beats one that only works once the spelling is loosened
    let d = lev(k, key, max); if (d > max) { const d2 = lev(lk, loose(key), max); if (d2 <= max) d = d2 + 0.5; }
    if (d < best) { best = d; hits = new Set([e]); longer = new Set(); } else if (d === best && d <= max + 0.5) hits.add(e);
    if (d === best && d <= max + 0.5 && key.length > k.length) longer.add(e);
  }
  if (hits.size === 1) return { e: [...hits][0], fix: true };
  // on a tie, a dropped letter is the likelier slip than an extra one
  if (hits.size > 1 && longer.size === 1) return { e: [...longer][0], fix: true };
  // a distinctive word of the answer ("vader"): fine if only one answer has it
  // it has to be the word the answer is known by: its last word, not its first
  const byWord = T.words.get(k) || T.words.get(k + 's') || T.words.get(k + 'es') || (k.length > 4 ? T.words.get(k.replace(/s$/, '')) : null);
  if (byWord && crowd(byWord)) return { amb: true };
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
// for tools/shard.js: a derived prompt's answers and fact, so the live site can ship it ready-made
const derivedData = dv => { const T = TOPICS[dv.id]; if (!T || T.stub) return null; const t = ['', '', '', '', ''], fs = e => (e.forms && e.forms.length ? e.forms : [e.name]).join('|'); for (const e of T.list) { if (e === T.star) continue; const k = Math.min(3, e.tier); t[k] += (t[k] ? ', ' : '') + fs(e); } t[4] = fs(T.star); return { t, k: [T.star.name, T.star.fact || ''], n: T.list.length }; };
if (typeof document === 'undefined') { module.exports = { norm, match, TOPICS, DERIVED, derivedData }; return; }

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
    whistle() { tone({ type: 'square', f0: 2650, f1: 2700, dur: 0.16, peak: 0.05, lp: 4200 }); tone({ type: 'square', f0: 2650, f1: 2750, dur: 0.42, peak: 0.05, lp: 4200, delay: 0.2 }); },
    compass() { [C.G5, C.C6, C.E6].forEach((f, i) => bell(f, { peak: 0.08, dur: 1.2, delay: i * 0.09 })); },
    fanfare() { [C.C5, C.E5, C.G5, C.C6].forEach((f, i) => bell(f, { peak: 0.14, dur: 1.4, delay: i * 0.12 })); pad([C.C4, C.E4, C.G4], { dur: 1.8, peak: 0.035 }); tone({ f0: 98, dur: 1, peak: 0.16 }); },
  };
  // ambience: a quiet bed of filtered noise shaped to each place, and now and then the sound of something living there
  const AMB = { stadium: [520, 0.03, 'bandpass'], atlas: [900, 0.013, 'lowpass'], canopy: [1400, 0.014, 'lowpass'], forest: [700, 0.016, 'lowpass'], floor: [420, 0.02, 'lowpass'], roots: [260, 0.026, 'lowpass'], river: [1000, 0.034, 'bandpass'], grotto: [380, 0.015, 'lowpass'], crystal: [2400, 0.008, 'bandpass'], temple: [300, 0.02, 'lowpass'], fungal: [520, 0.015, 'lowpass'], magma: [140, 0.05, 'lowpass'], obscura: [190, 0.032, 'lowpass'] };
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
    // a crowd somewhere in the stands: a swell of cheering, now and then a whistle or a drum
    stadium() { const p = pan(), r = Math.random(); if (r < 0.55) noise({ dur: 1.4, bp: true, lp: 700 + Math.random() * 500, q: 0.8, peak: 0.05, pan: p, send: 0.6 }); else if (r < 0.8) { tone({ f0: 2900, f1: 3100, dur: 0.18, peak: 0.018, pan: p, send: 0.5 }); tone({ f0: 2900, f1: 3150, dur: 0.12, peak: 0.016, pan: p, delay: 0.24, send: 0.5 }); } else for (let i = 0; i < 3; i++) tone({ f0: 90, f1: 55, dur: 0.12, peak: 0.07, pan: p, delay: i * 0.22, send: 0.4 }); },
    // the open sea under an atlas: gulls, a ship's bell, rigging in the wind
    atlas() { const p = pan(), r = Math.random(); if (r < 0.45) { tone({ f0: 1700, f1: 1250, dur: 0.22, peak: 0.016, pan: p, send: 0.7 }); tone({ f0: 1650, f1: 1150, dur: 0.18, peak: 0.013, pan: p, delay: 0.28, send: 0.7 }); } else if (r < 0.7) bell(523.25 + Math.random() * 40, { peak: 0.02, dur: 2.4, pan: p, send: 0.95 }); else noise({ dur: 1.6, lp: 500, to: 1400, peak: 0.03, pan: p, send: 0.5 }); },
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
window.__dbg = { sprite, S: () => S, render: () => render(), run: k => startRun(k), topic: id => TOPICS[id], champ: name => moment(Math.round(innerHeight * 0.3), 'CHAMPION', name + ' · 1,240 pts', icon('krill', '#ffc23a', 128), 'champ'), lead: (name, kind) => leadSlam({ id: 'x', name }, kind), emote: e => showEmote(S.me.id, e), count: t => { const m = S.mode; S.mode = 'online'; bigCount(t); S.mode = m; }, rivalNews: name => { rivalToast([icon('moth', '#ffe08a', 28), h('span', { text: name + ' found an Obscura' }), h('b', { text: '+100' })], '#ffe08a', true); rivalGold(); } };
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
  if (TOPICS[r.topic] && TOPICS[r.topic].stub) { S.fb = { kind: 'fix', text: 'loading answers…', sub: 'one moment, then press enter again' }; renderFb(); needIds([r.topic]); return; }
  const m = match(r.topic, text), form = input.closest('form'), typed = '“' + text.slice(0, 30) + '”';
  const say2 = (fb) => { S.fb = fb; renderFb(); };
  // wrong guesses are kept for the rundown at the end
  const wrong = () => { if (S.mine.g !== r.g) S.mine = freshMine(r.g, S.mine.joinedAt); const rw = S.mine.rounds[r.round] || (S.mine.rounds[r.round] = { a: [], pts: 0 }); rw.tp = r.topic; rw.w = rw.w || []; if (rw.w.length < 20) rw.w.push(text.slice(0, 28)); };
  if (!m || m.amb) wrong();
  if ((!m || m.amb) && SET.clear) input.value = '';
  if (m && m.amb) { restart(form, 'jolt'); restart($('fb'), 'shake'); return say2({ kind: 'miss', text: typed + ' fits more than one answer', sub: 'be more specific' }); }
  if (!m) { restart(form, 'jolt'); if (window.__fx) window.__fx.reject(); say2({ kind: 'miss', text: typed + ': no trace of that. try again', report: canReport(r.topic, text) ? { topic: r.topic, text: text.slice(0, 60) } : null }); return restart($('fb'), 'shake'); }
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
// A player who knows a rejected answer is right can flag it; flagged answers are reviewed and added to the bank.
// The bank is already large, so reporting is deliberately strict: no junk, one report per prompt, ten a day,
// only after a finished game, and nothing is ever added unless several different players agree (see __review).
const BAD = /\b(fuck\w*|shit\w*|bitch\w*|cunts?|dicks?|cocks?|pussy|penis|vaginas?|porn\w*|sex|sexy|nigg\w*|fags?|faggots?|retards?|whores?|sluts?|rape\w*|nazis?|hitler|kys|cum|boobs?|anal|dildos?|nudes?|weed|cocaine|heroin|meth|vodka|beers?|wines?|drunk|ass|asshole|bastards?|damn|crap)\b/i;
function reportJunk(text) {
  const t = String(text || '').trim(), k = norm(t);
  if (k.length < 3 || t.length > 50) return true;
  if (BAD.test(t) || BAD.test(k)) return true;
  if (/(.)\1{3,}/i.test(k)) return true;                               // aaaaa
  if (/https?:|www\.|\.com\b|@/i.test(t)) return true;                 // links, handles
  if (/^\d+$/.test(k) && k.length > 4) return true;                    // long numbers
  if (/(asdf|qwer|zxcv|hjkl|uiop|sdfg|dfgh|fghj|ghjk|xcvb|cvbn|vbnm|qazwsx)/i.test(k)) return true;   // keyboard mash
  if (/^(lol+|xd+|test|testing|idk|dunno|nothing|anything|something|yes|no|ok|okay|hi|hello|bruh|wtf|lmao)$/i.test(k) || /^((ha){2,}h?|(he){2,}h?|l(ol)+|xd+)$/i.test(k)) return true;
  const letters = k.replace(/[^a-z]/g, ''); if (letters.length >= 5 && !/[aeiouy]/.test(letters)) return true;   // no vowels at all
  if (letters.length >= 8 && /[^aeiouy]{7,}/.test(letters)) return true;                                       // consonant mash
  const words = t.split(/\s+/); if (words.length > 7) return true;
  return false;
}
const reporterId = () => { let v = 2166136261; for (const ch of String(S.me.id || 'anon') + ':obscura') v = Math.imul(v ^ ch.charCodeAt(0), 16777619) >>> 0; return v.toString(36); };
function canReport(topic, text) {
  if (Number(ls.get('played') || 0) < 1) return false;
  if (reportJunk(text)) return false;
  let mine = []; try { mine = JSON.parse(ls.get('reported') || '[]'); } catch (e) { mine = []; }
  const day = Date.now() - 864e5;
  if (mine.filter(x => x.at > day).length >= 10) return false;
  if (mine.some(x => x.topic === topic && x.at > day)) return false;
  return true;
}
function reportAnswer(rp) {
  if (rp.sent || !canReport(rp.topic, rp.text)) return; rp.sent = true; renderFb(); snd('click');
  let mine = []; try { mine = JSON.parse(ls.get('reported') || '[]'); } catch (e) { mine = []; }
  mine.push({ topic: rp.topic, text: rp.text, at: Date.now() }); ls.set('reported', JSON.stringify(mine.slice(-200)));
  try { if (S.db) S.db.collection('reports').doc(Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)).set({ topic: rp.topic, text: rp.text, at: Date.now(), who: reporterId() }).catch(() => {}); } catch (e) { /* reporting is best-effort */ }
  const inp = $('answer'); if (inp) inp.focus();
}
// Reviewing reports (run by hand on an export): everything junk, inappropriate or already accepted goes,
// heavy reporters are ignored, duplicates merge, and only answers that several different players flagged survive.
// The survivors are a shortlist for a person to judge; nothing here adds anything to the bank.
window.__review = (reports, opts) => {
  const o = Object.assign({ minPlayers: 3, maxPerPlayer: 30 }, opts || {});
  const drop = { junk: 0, unknownPrompt: 0, alreadyCounts: 0, heavyReporter: 0, tooFewPlayers: 0 };
  const per = {}; for (const r of reports) if (r && r.who) per[r.who] = (per[r.who] || 0) + 1;
  const groups = new Map();
  for (const r of reports) {
    if (!r || typeof r.text !== 'string' || typeof r.topic !== 'string') { drop.junk++; continue; }
    if (reportJunk(r.text)) { drop.junk++; continue; }
    if (!r.who || per[r.who] > o.maxPerPlayer) { drop.heavyReporter++; continue; }
    let T; try { T = TOPICS[r.topic]; } catch (e) { T = null; }
    if (!T) { drop.unknownPrompt++; continue; }
    const m = match(r.topic, r.text); if (m && !m.amb) { drop.alreadyCounts++; continue; }
    const key = r.topic + '|' + loose(norm(r.text));
    const gp = groups.get(key) || { topic: r.topic, prompt: T.name, texts: {}, who: new Set() };
    gp.texts[r.text.trim()] = (gp.texts[r.text.trim()] || 0) + 1; gp.who.add(r.who); groups.set(key, gp);
  }
  const keep = [];
  for (const gp of groups.values()) { if (gp.who.size < o.minPlayers) { drop.tooFewPlayers += gp.who.size; continue; } keep.push({ topic: gp.topic, prompt: gp.prompt, answer: Object.entries(gp.texts).sort((a, b) => b[1] - a[1])[0][0], spellings: Object.keys(gp.texts), players: gp.who.size }); }
  keep.sort((a, b) => b.players - a.players);
  return { total: reports.length, dropped: drop, shortlist: keep };
};
function renderFb() {
  const fb = $('fb'); if (!fb) return;
  const rp = S.fb && S.fb.report;
  fb.replaceChildren(...(S.fb ? [h('p', { text: S.fb.text }), S.fb.sub && h('small', { text: S.fb.sub }),
    rp && h('button', { class: 'report', type: 'button', text: rp.sent ? '✓ reported, thanks' : 'that should count ↗', disabled: !!rp.sent, onmousedown: e => e.preventDefault(), onclick: () => reportAnswer(rp) })].filter(Boolean) : []));
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
    h('div', { class: 'tiles' }, Object.keys(PACKS).map(k => h('button', { class: 'tile pk-' + k + (dailyDone(k) ? ' on' : ''), type: 'button', disabled: packPool(k).length < 7, onclick: () => { goHome(); startRun(k, null, true); } }, h('i', { text: dailyDone(k) ? '✓' : '↓' }), h('span', { text: 'Daily ' + PACKS[k].label.toLowerCase() }), h('small', { text: dailyDone(k) ? 'see result' : 'same seven for everyone' })))),
    h('div', { class: 'ph' }, h('span', { text: 'Unlimited' })),
    h('div', { class: 'tiles' }, Object.keys(PACKS).map(k => { const n = packPool(k).length; return h('button', { class: 'tile pk-' + k, type: 'button', disabled: n < 7, onclick: () => { goHome(); startRun(k); } }, h('i', { text: k === 'geo' ? '◍' : '⚑' }), h('span', { text: PACKS[k].label }), h('small', { text: n < 7 ? 'being stocked' : n + ' prompts' })); })),
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
                  : h('p', { class: 'note', text: !rd.a.length && gone(p) ? 'Left the room.' : 'Found nothing.' }));
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
  if (S.room) needIds([S.room.topic].concat(S.room.options || [], S.room.fixed || [], (S.room.used || []).slice(-8)));
  const r = S.room;
  const key = !S.mode ? 'home' : [r.phase, r.g, r.round, S.code, isHost(), r.picker].join(':');
  if (key !== S.screen) {
    S.screen = key;
    if (S.mode && r.phase !== 'play') S.fb = null;
    const dive = !!S.mode && r.phase !== 'lobby';
    if (document.body.classList.contains('dive') !== dive) { document.body.classList.toggle('dive', dive); if (window.__sea) window.__sea(); }
    document.body.classList.toggle('trek', !!S.mode && r.phase === 'play');
    // the Geography and Sports packs dress the whole forest up as an atlas or a floodlit stadium
    const th = S.mode && r.fixed && (r.kind === 'geo' || r.kind === 'sports') ? r.kind : null;
    if (window.__theme !== th) { window.__theme = th; if (th) snd(th === 'sports' ? 'whistle' : 'compass'); }
    document.body.classList.toggle('th-geo', th === 'geo'); document.body.classList.toggle('th-sports', th === 'sports');
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
      const top = Math.max(0, yOf(0) + 10, AY + (0 - camS * z) / mpp - 30 - hsh(i, k + 5) * 60), bot = Math.min(H, AY + (FLOOR - camS) * z / mpp + 40); // far trunks end where the forest does
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
        // blossoms on the limb while there is light to see them by
        if (light > 0.15) for (let f = 0; f < 3; f++) { if (hsh(i * 3 + f, k + 31) < 0.4) continue; const fx0 = sn((left ? len * (0.22 + f * 0.26) : W - len * (0.22 + f * 0.26)) + sway), by = y - AP * 2 - (f % 2) * AP * 3; ctx.fillStyle = css(lerp3(base, FO_FLOWER[(i + f) & 3], 0.3 + 0.6 * light)); ctx.fillRect(fx0 - AP, by, AP * 3, AP); ctx.fillRect(fx0, by - AP, AP, AP * 3); ctx.fillStyle = css(lerp3(base, [255, 240, 150], 0.3 + 0.6 * light)); ctx.fillRect(fx0, by, AP, AP); }
      }
      // vines (or roots) hanging from it
      const vineC = css(lerp3(base, under ? [40, 30, 22] : [12, 46, 24], 0.5)); ctx.fillStyle = vineC;
      for (let v = 0; v < 2; v++) {
        if (hsh(i * 2 + v, k + 12) < 0.35) continue;
        const vx0 = left ? len * (0.3 + v * 0.45) : W - len * (0.3 + v * 0.45), n = Math.round((30 + hsh(i * 2 + v, k + 14) * 150) * big / (AP * 2));
        for (let q = 0; q < n; q++) { const vx = sn(vx0 + Math.sin(time * 0.8 + i + v + q * 0.22) * q * 0.4); ctx.fillRect(vx, y + th + q * AP * 2, AP, AP * 2 + 1); if (!under && q % 4 === 2) ctx.fillRect(vx + (q % 8 === 2 ? -AP * 2 : AP), y + th + q * AP * 2, AP * 2, AP); }
        // in the shade the vine ends in a glowing bud
        if (!under && real > 650) { const gp = foCl((real - 650) / 400) * (0.5 + 0.5 * Math.sin(time * 1.7 + i + v * 2)), tx = sn(vx0 + Math.sin(time * 0.8 + i + v + n * 0.22) * n * 0.4), ty = y + th + n * AP * 2; ctx.fillStyle = 'rgba(170,255,200,' + (0.9 * gp).toFixed(3) + ')'; ctx.fillRect(tx - AP * 0.5, ty, AP * 2, AP * 2); halo(tx + AP * 0.5, ty + AP, 12, 'rgb(140,255,190)', 0.5 * gp); ctx.fillStyle = vineC; }
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
    foFall(W * 0.86, 0.3, 130, 960, 7, 1);
    foFall(W * 0.13, 0.42, 70, 540, 4, 2);
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

  // ==== the forest journey, dressed band by band (everything new here is named fo… / FO_…) ====
  const foCl = v => v < 0 ? 0 : v > 1 ? 1 : v;
  // 0..1 as the camera moves into [a0..a1] and back out over [b0..b1]
  const foOn = (a0, a1, b0, b1) => foCl((camS - a0) / (a1 - a0)) * foCl((b1 - camS) / (b1 - b0));
  const foY = (m, z) => AY + (m - camS) * z / mpp;
  // which repeats (spacing SP metres, parallax z) can be on screen
  const foI0 = (z, SP, pad) => Math.max(0, Math.floor((camS + (-pad - AY) * mpp / z) / SP));
  const foI1 = (z, SP, pad) => Math.ceil((camS + (H + pad - AY) * mpp / z) / SP);
  const foDi = (x, y) => BAYER[(x & 3) + ((y & 3) << 2)];
  const foPk = (r, g, b, a) => (((a == null ? 255 : a) << 24) | ((b < 0 ? 0 : b > 255 ? 255 : b) << 16) | ((g < 0 ? 0 : g > 255 ? 255 : g) << 8) | (r < 0 ? 0 : r > 255 ? 255 : r)) >>> 0;
  const foGrad = (S, f) => { if (f <= S[0][0]) return S[0][1]; for (let i = 1; i < S.length; i++) if (f <= S[i][0]) return lerp3(S[i - 1][1], S[i][1], (f - S[i - 1][0]) / (S[i][0] - S[i - 1][0])); return S[S.length - 1][1]; };
  // offscreen art, painted once per screen size
  const FO_C = {}; let foCK = '';
  function foCache(name, w, h, paint) {
    const k = W + 'x' + H; if (k !== foCK) { foCK = k; for (const n in FO_C) delete FO_C[n]; }
    let c = FO_C[name]; if (!c) { c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); const g = c.getContext('2d'); g.imageSmoothingEnabled = false; paint(g, c.width, c.height); FO_C[name] = c; }
    return c;
  }
  function foPix(g, w, h, fn) { const id = g.createImageData(w, h), b = new Uint32Array(id.data.buffer); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = fn(x, y); if (v) b[y * w + x] = v; } g.putImageData(id, 0, 0); }
  const FO_FLOWER = [[255, 70, 110], [255, 150, 40], [255, 90, 210], [255, 230, 80]];
  const FO_LAVA = ['#5a0e04', '#c22a0a', '#ff5a1a', '#ff9a2a', '#ffd34d', '#fff3b0'];
  const FO_SPORE = ['255,140,220', '200,150,255', '120,240,255', '255,200,240'], FO_SPORE_H = FO_SPORE.map(c => 'rgb(' + c + ')');
  const FO_RB = ['255,70,70', '255,160,50', '255,240,90', '90,255,120', '80,170,255', '170,100,255'];

  // ---- dawn over the canopy: a dithered sunrise sky, the sun and its rays, birds, and three ranges of treetops in the haze ----
  const FO_SKY = [[0, [30, 36, 92]], [0.26, [66, 82, 160]], [0.5, [158, 118, 176]], [0.7, [240, 150, 140]], [0.87, [255, 196, 140]], [1, [255, 232, 180]]];
  const foSkyArt = () => foCache('sky', W / AP, H * 0.4 / AP, (g, w, h) => foPix(g, w, h, (x, y) => {
    const N = 16, v = y / (h - 1) * N + foDi(x, y) - 0.5, c = foGrad(FO_SKY, Math.max(0, Math.min(N, Math.round(v))) / N);
    const st = y < h * 0.45 && hsh(x * 977 + y, 951) > 0.993 ? (1 - y / (h * 0.45)) * 0.85 : 0; // the last stars, fading
    return foPk(c[0] + (255 - c[0]) * st, c[1] + (255 - c[1]) * st, c[2] + (255 - c[2]) * st);
  }));
  const foSunArt = () => foCache('sun', 25, 25, (g, w, h) => foPix(g, w, h, (x, y) => { const d = Math.hypot(x - 12, y - 12) + (foDi(x, y) - 0.5) * 0.9; return d < 6 ? foPk(255, 253, 236) : d < 9 ? foPk(255, 238, 176) : d < 11 ? foPk(255, 208, 124) : d < 12.3 ? foPk(255, 168, 104, 170) : 0; }));
  const FO_HILL = [[[198, 158, 190], [255, 222, 204], 30, 5], [[126, 150, 158], [255, 210, 168], 22, 6], [[74, 140, 100], [222, 238, 160], 13, 8]]; // colour, sunlit rim, height and crown size in art pixels
  function foHillArt(i) {
    const L = FO_HILL[i];
    return foCache('hill' + i, W / AP, 40, (g, w, h) => {
      const cr = [];
      for (let x = -12, k = 0; x < w + 12; k++) { const r = L[3] * (0.6 + 0.8 * hsh(k, 960 + i)); cr.push([x, h - L[2] + r * 0.6 + hsh(k, 963 + i) * L[3] * 0.8, r, 0]); x += r * (0.8 + 0.6 * hsh(k, 966 + i)); }
      if (i === 1) for (let k = 0; k < 3; k++) cr.push([w * (0.12 + 0.3 * k + 0.12 * hsh(k, 970)), h - L[2] - 8 - hsh(k, 971) * 5, 8 + hsh(k, 972) * 3, 1]); // emergent giants with flat crowns
      const mist = [255, 214, 200];
      foPix(g, w, h, (x, y) => {
        let top = 1e9, dx0 = 0, emer = false;
        for (const q of cr) {
          const dx = x - q[0];
          if (q[3]) { // an emergent giant: a slim trunk under a flat, closed crown
            if (Math.abs(dx) < 1.2 && y > q[1]) { emer = true; if (top > q[1]) { top = q[1]; dx0 = -1; } continue; }
            if (dx * dx < q[2] * q[2]) { const hh = Math.sqrt(q[2] * q[2] - dx * dx), t = q[1] - hh * 0.4; if (y >= t && y <= q[1] + hh * 0.18) { emer = true; if (t < top) { top = t; dx0 = dx; } } }
            continue;
          }
          if (dx * dx >= q[2] * q[2]) continue; const t = q[1] - Math.sqrt(q[2] * q[2] - dx * dx) * 0.85; if (t < top) { top = t; dx0 = dx; }
        }
        if (!emer && y < top) return 0;
        const d = y - top; let c = d < 1 && dx0 > 0 ? L[1] : d < 2.2 && dx0 > 0 && foDi(x, y) < 0.5 ? lerp3(L[0], L[1], 0.5) : L[0];
        if (d > 2 && foDi(x, y) < 0.1 * (i + 1)) c = lerp3(c, [0, 0, 0], 0.14);
        c = lerp3(c, mist, Math.pow(y / h, 2) * 0.45);
        return foPk(c[0], c[1], c[2]);
      });
    });
  }
  function foSky(sy) {
    const sk = foSkyArt(), sh = sk.height * AP, top = sy + 4 - sh;
    if (top > 0) { ctx.fillStyle = css(FO_SKY[0][1]); ctx.fillRect(0, 0, W, top + 1); }
    ctx.drawImage(sk, 0, sn(top), sk.width * AP, sh);
    const sx = W * 0.78, syn = sy - Math.max(64, sy * 0.5);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, sy + 4); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createRadialGradient(sx, syn, 0, sx, syn, Math.max(W, H) * 0.6);
    gl.addColorStop(0, 'rgba(255,224,170,0.55)'); gl.addColorStop(0.12, 'rgba(255,180,120,0.22)'); gl.addColorStop(0.45, 'rgba(255,140,110,0.06)'); gl.addColorStop(1, 'rgba(255,140,110,0)');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, sy + 4);
    // rays fanning out from the sun, turning slowly
    const RR = Math.max(W, H), rg = ctx.createRadialGradient(sx, syn, 16, sx, syn, RR); rg.addColorStop(0, 'rgba(255,238,196,0.2)'); rg.addColorStop(1, 'rgba(255,238,196,0)'); ctx.fillStyle = rg;
    for (let k = 0; k < 12; k++) { const a0 = k / 12 * 6.283 + time * 0.012 + hsh(k, 981) * 0.2, wd = 0.035 + 0.05 * hsh(k, 982); ctx.globalAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.35 + k * 2.3)); ctx.beginPath(); ctx.moveTo(sx, syn); ctx.lineTo(sx + Math.cos(a0 - wd) * RR, syn + Math.sin(a0 - wd) * RR); ctx.lineTo(sx + Math.cos(a0 + wd) * RR, syn + Math.sin(a0 + wd) * RR); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const sun = foSunArt(); ctx.drawImage(sun, sn(sx - 12.5 * AP), sn(syn - 12.5 * AP), 25 * AP, 25 * AP);
    // clouds lit pink on top and gold underneath
    for (const c of clouds) {
      const x = sn(mod(c.x + time * c.v, W + 200) - 100), y = sn(sy * c.f * 0.85);
      ctx.fillStyle = 'rgba(255,232,226,0.88)'; ctx.fillRect(x + AP * 2, y - AP * 2, Math.max(0, c.w - 5) * AP, AP * 2); ctx.fillRect(x + AP * 4, y - AP * 3, Math.max(0, c.w - 10) * AP, AP);
      ctx.fillStyle = 'rgba(226,150,168,0.88)'; ctx.fillRect(x, y, c.w * AP, AP * 2);
      ctx.fillStyle = 'rgba(255,204,132,0.95)'; ctx.fillRect(x + AP, y + AP * 2 - 1, (c.w - 2) * AP, AP);
    }
    // two skeins of birds crossing the dawn
    ctx.fillStyle = '#3a2840';
    for (let g = 0; g < 2; g++) {
      const dir = g ? -1 : 1, gx = mod(hsh(g, 990) * W + dir * time * (15 + g * 6), W + 300) - 150, gy = sy * (0.2 + 0.18 * g) + Math.sin(time * 0.5 + g) * 6;
      for (let k = 0; k < 7; k++) { const o = Math.abs(k - 3), x = sn(gx - dir * o * 12), y = sn(gy + (k < 3 ? o : -o) * 5), up = ((time * 5 + k * 0.7) | 0) & 1; ctx.fillRect(x - 1, y, 3, 2); if (up) { ctx.fillRect(x - 4, y - 2, 3, 2); ctx.fillRect(x + 2, y - 2, 3, 2); } else { ctx.fillRect(x - 4, y + 1, 3, 2); ctx.fillRect(x + 2, y + 1, 3, 2); } }
    }
    // ranges of treetops fading into the morning haze
    for (let i = 0; i < 3; i++) {
      const im = foHillArt(i); ctx.drawImage(im, 0, sn(sy + 4 - im.height * AP), im.width * AP, im.height * AP);
      const t0 = sy - 34 + i * 10, mg = ctx.createLinearGradient(0, t0, 0, sy + 4); mg.addColorStop(0, 'rgba(255,214,200,0)'); mg.addColorStop(1, 'rgba(255,214,200,' + (0.45 - i * 0.13).toFixed(2) + ')'); ctx.fillStyle = mg; ctx.fillRect(0, t0, W, sy + 4 - t0);
      if (i < 2) { ctx.fillStyle = 'rgba(255,232,224,0.32)'; for (let q = 0; q < 4; q++) { const L = 60 + hsh(q + i * 4, 995) * 120, x = mod(hsh(q + i * 4, 996) * W + time * (3 + i * 2), W + L) - L; ctx.fillRect(sn(x), sn(sy - 18 - i * 14 - hsh(q, 997) * 14), L, AP * 2); } }
    }
    ctx.restore();
  }
  // blossoms dotted over the top of the canopy
  function foCanopyBloom(sy) {
    for (let q = 0; q < W / 24; q++) {
      if (hsh(q, 991) < 0.5) continue;
      const x = sn(q * 24 + hsh(q, 992) * 18), y = sn(sy + 6 + hsh(q, 993) * 46 + Math.sin(time * 0.7 + q) * 1.5), fc = FO_FLOWER[q & 3];
      ctx.fillStyle = css(fc); ctx.fillRect(x - AP, y, AP * 3, AP); ctx.fillRect(x, y - AP, AP, AP * 3); ctx.fillStyle = '#fff3a0'; ctx.fillRect(x, y, AP, AP);
    }
  }

  // ---- the green layers: waterfalls, rope bridges, monkeys, morphos, fireflies, and flowers on the great trunks ----
  // a waterfall pouring through the far trees, broken by a ledge halfway down, with a rainbow in the spray while the sun reaches it
  function foFall(xc, z, mTop, mBot, cols, seed) {
    const S2 = AP * 2, w = cols * S2, x = sn(xc - w / 2), yTop = AY + (mTop - camS * z) / mpp, yBot = AY + (mBot - camS * z) / mpp;
    if (yBot < -60 || yTop > H + 60) return;
    const lit = Math.max(0, 1 - camS / 1500), A = air(camS), ca = css(lerp3(A, [238, 252, 248], 0.25 + 0.55 * lit)), cb = css(lerp3(A, [150, 214, 222], 0.18 + 0.45 * lit)), cc = css(lerp3(A, [64, 130, 140], 0.2 + 0.3 * lit)), dk = css(lerp3(A, [2, 8, 5], 0.55));
    const yMid = yTop + (yBot - yTop) * 0.42;
    // the cliff lip it pours from, mossy on top
    ctx.fillStyle = dk; ctx.fillRect(x - AP * 14, sn(yTop) - AP * 4, w + AP * 28, AP * 5); ctx.fillRect(x - AP * 8, sn(yTop) + AP, w + AP * 16, AP * 2);
    ctx.fillStyle = css(lerp3(A, [70, 150, 70], 0.3 + 0.35 * lit)); ctx.fillRect(x - AP * 14, sn(yTop) - AP * 4, w + AP * 28, AP);
    const from = Math.max(yTop, -S2), to = Math.min(yBot, H + S2), sc = time * 170;
    if (to > from) { ctx.fillStyle = css(lerp3(A, [238, 252, 248], 0.4), (0.05 + 0.08 * lit).toFixed(3)); ctx.fillRect(x - S2 * 2, from, w + S2 * 4, to - from); }
    for (let y = yTop + Math.max(0, Math.floor((from - yTop) / S2)) * S2; y < to; y += S2) {
      const below = y > yMid, spread = below ? Math.min(AP * 4, (y - yMid) / 30) : Math.min(AP * 2, (y - yTop) / 60);
      for (let ci = 0; ci < cols; ci++) {
        const row = Math.floor((y - yTop - sc * (0.85 + 0.3 * hsh(ci, 77 + seed))) / S2), r = hsh(row * 13 + ci, 60 + seed), edge = ci === 0 || ci === cols - 1;
        ctx.fillStyle = r > 0.78 ? ca : r > 0.33 ? cb : cc; ctx.globalAlpha = edge ? 0.6 : 0.92;
        ctx.fillRect(sn(x + ci * S2 + (ci - (cols - 1) / 2) * spread * (below ? 1 : 0.5)), sn(y), S2, S2);
      }
    }
    ctx.globalAlpha = 1;
    if (yMid > -60 && yMid < H + 60) {
      ctx.fillStyle = dk; ctx.fillRect(x - AP * 10, sn(yMid) - AP, w + AP * 20, AP * 3);
      ctx.fillStyle = ca; for (let q = 0; q < 8; q++) { const u = mod(time * 1.3 + q / 8, 1); ctx.globalAlpha = 0.8 * (1 - u); ctx.fillRect(sn(x + w / 2 + (hsh(q, 72 + seed) - 0.5) * w * 2.4 * u), sn(yMid - u * 22 * (0.5 + hsh(q, 73 + seed))), AP, AP); }
      ctx.globalAlpha = 1;
      for (let q = 0; q < 6; q++) { const u = mod(time * 0.8 + q / 6, 1), ang = -Math.PI * (0.12 + 0.76 * hsh(q, 71 + seed)), rr = 10 + u * 40; halo(x + w / 2 + Math.cos(ang) * rr, yMid + Math.sin(ang) * rr * 0.6, 6 + u * 6, 'rgb(220,246,240)', (0.15 + 0.4 * lit) * (1 - u)); }
      if (lit > 0.3 && !window.__low) { // a rainbow standing in the spray
        const rx = x + w / 2, R0 = 46 + w;
        for (let c = 0; c < 6; c++) { ctx.fillStyle = 'rgba(' + FO_RB[c] + ',' + (0.4 * (lit - 0.3)).toFixed(3) + ')'; for (let ang = 3.4; ang < 6.0; ang += 0.05) ctx.fillRect(sn(rx + Math.cos(ang) * (R0 - c * AP)), sn(yMid + 10 + Math.sin(ang) * (R0 - c * AP) * 0.8), AP, AP); }
      }
    }
  }
  const FO_BRIDGE = [215, 400, 610, 850, 1120];
  function foBridges() {
    const z = 0.66, S = AP * 3;
    for (let b = 0; b < FO_BRIDGE.length; b++) {
      const m = FO_BRIDGE[b], y0 = foY(m, z); if (y0 < -120 || y0 > H + 80) continue;
      const A = air(camS + (y0 - AY) * mpp), rope = css(lerp3(A, [40, 26, 14], 0.7)), pl = css(lerp3(A, [116, 80, 44], 0.55)), pl2 = css(lerp3(A, [72, 50, 26], 0.6)), xa = W * 0.02, xb = W * 0.98, sag = 40 + 30 * hsh(b, 1901), n = Math.ceil((xb - xa) / S), dk = foCl((m - 250) / 600), sw0 = Math.sin(time * 0.8 + b * 2) * 4;
      for (let k = 0; k <= n; k++) {
        const u = k / n, x = sn(xa + (xb - xa) * u), s4 = 4 * u * (1 - u), yd = y0 + sag * s4 + sw0 * s4, yr = yd - 22 + 2 * s4;
        ctx.fillStyle = k & 1 ? pl : pl2; ctx.fillRect(x, sn(yd), S - 1, AP + 1);
        ctx.fillStyle = rope; ctx.fillRect(x, sn(yr), S, 2); ctx.fillRect(x, sn(yd + AP + 1), S, 1.5); if (k % 3 === 0) ctx.fillRect(x, sn(yr), 1.5, yd - yr);
      }
      // lanterns hung on the rail, brighter as the forest darkens
      for (let l = 0; l < 3; l++) {
        const u = 0.22 + l * 0.28, x = xa + (xb - xa) * u, s4 = 4 * u * (1 - u), yy = y0 + sag * s4 + sw0 * s4 - 20 + 2 * s4, fl = 0.75 + 0.25 * Math.sin(time * 7 + l * 3 + b);
        ctx.fillStyle = rope; ctx.fillRect(sn(x), sn(yy), 1.5, AP * 3);
        ctx.fillStyle = 'rgba(255,204,112,' + (0.55 + 0.45 * dk * fl).toFixed(3) + ')'; ctx.fillRect(sn(x - AP), sn(yy + AP * 3), AP * 3, AP * 3);
        ctx.fillStyle = rope; ctx.fillRect(sn(x - AP), sn(yy + AP * 3), AP * 3, 1.5);
        halo(x + AP * 0.5, yy + AP * 4.5, 14 + 12 * dk, 'rgb(255,190,100)', (0.2 + 0.6 * dk) * fl);
      }
    }
  }
  // spider monkeys hanging by their tails from the limbs, swinging
  function foMonkeys() {
    const z = 0.85, SP = 46, tw = Math.max(26, Math.min(70, W * 0.06));
    for (let i = foI0(z, SP, 140); i <= foI1(z, SP, 60); i++) {
      if (hsh(i, 921) < 0.25) continue;
      const m = i * SP + hsh(i, 922) * 20; if (m < 190 || m > 660) continue;
      const left = hsh(i, 923) < 0.5, ax = left ? tw + 16 + hsh(i, 924) * W * 0.1 : W - tw - 16 - hsh(i, 924) * W * 0.1, ay = foY(m, z) - 50;
      if (ay < -130 || ay > H + 40) continue;
      const A = air(m), dk = css(lerp3(A, [24, 15, 10], 0.84)), fur = css(lerp3(A, [74, 46, 28], 0.72)), face = css(lerp3(A, [200, 156, 116], 0.62)), s = AP * 0.95;
      ctx.fillStyle = css(lerp3(A, [2, 8, 5], 0.6)); const bx0 = left ? 0 : ax - 34, bx1 = left ? ax + 34 : W; ctx.fillRect(bx0, sn(ay - AP * 2), bx1 - bx0, AP * 3);
      drawClump(i % 6, m, 0.35, ax + (left ? 30 : -30), ay - AP * 3, AP * 0.8);
      const th = 0.5 * Math.sin(time * 1.25 + i * 2.3), arm = Math.sin(time * 2.5 + i) * 0.5;
      ctx.save(); ctx.translate(ax, ay); ctx.rotate(th);
      ctx.fillStyle = dk; ctx.fillRect(-s, -s * 2, s * 4, s); ctx.fillRect(-s, -s, s, s * 2); ctx.fillRect(-s * 0.5, 0, s, s * 14);
      ctx.fillStyle = fur; ctx.fillRect(-s * 3, s * 13, s * 6, s * 9);
      ctx.fillStyle = dk; ctx.fillRect(-s * 3, s * 11, s * 2, s * 4); ctx.fillRect(s, s * 11, s * 2, s * 4);
      ctx.fillStyle = fur; ctx.fillRect(-s * 3, s * 22, s * 6, s * 5);
      ctx.fillStyle = face; ctx.fillRect(-s * 2, s * 23, s * 4, s * 3);
      ctx.fillStyle = '#120a06'; ctx.fillRect(-s * 1.5, s * 24, s, s); ctx.fillRect(s * 0.5, s * 24, s, s);
      ctx.fillStyle = dk;
      ctx.save(); ctx.translate(-s * 3, s * 16); ctx.rotate(0.4 + arm); ctx.fillRect(-s, 0, s, s * 12); ctx.restore();
      ctx.save(); ctx.translate(s * 3, s * 16); ctx.rotate(-0.4 + arm * 0.7); ctx.fillRect(0, 0, s, s * 12); ctx.restore();
      ctx.restore();
    }
  }
  // blue morpho butterflies, flashing as their wings turn to the light
  function foMorphos(a, low) {
    ctx.globalAlpha = a;
    for (let q = 0; q < (low ? 3 : 6); q++) {
      const s = AP * 0.8 * (0.8 + hsh(q, 913) * 0.6), x = W * (0.5 + 0.48 * Math.sin(time * 0.11 * (1 + hsh(q, 911)) + q * 2.1)), y = H * (0.5 + 0.42 * Math.sin(time * 0.08 * (1 + hsh(q, 912)) + q * 1.3)) + 8 * Math.sin(time * 3 + q);
      const fl = Math.abs(Math.sin(time * (8 + q) + q)), ww = Math.max(1, Math.round(fl * 5)) * s, bright = fl > 0.55;
      ctx.fillStyle = '#081430'; ctx.fillRect(sn(x - ww - s), sn(y - 4 * s), ww + s, 4 * s); ctx.fillRect(sn(x + s), sn(y - 4 * s), ww + s, 4 * s);
      ctx.fillStyle = bright ? '#8ef0ff' : '#3a9cff'; ctx.fillRect(sn(x - ww), sn(y - 3 * s), ww, 3 * s); ctx.fillRect(sn(x + s), sn(y - 3 * s), ww, 3 * s);
      ctx.fillStyle = bright ? '#3a9cff' : '#1f5fd0'; ctx.fillRect(sn(x - ww * 0.7), sn(y), ww * 0.7, 3 * s); ctx.fillRect(sn(x + s), sn(y), ww * 0.7, 3 * s);
      ctx.fillStyle = '#0a0a14'; ctx.fillRect(sn(x - s * 0.5), sn(y - 4 * s), s * 1.5, 7 * s);
      if (bright) halo(x, y, 12, 'rgb(120,210,255)', 0.35 * a);
    }
    ctx.globalAlpha = 1;
  }
  // golden pollen drifting in the canopy light
  function foPollen(a, low) {
    const n = low ? 14 : 34, drift = camS / mpp;
    for (let q = 0; q < n; q++) {
      const x = mod(hsh(q, 901) * W + time * (5 + hsh(q, 902) * 9) + 16 * Math.sin(time * 0.6 + q), W + 20) - 10, y = mod(hsh(q, 903) * (H + 40) - drift * (0.5 + hsh(q, 904) * 0.5) + time * (3 + hsh(q, 905) * 5), H + 40) - 20, tw = 0.5 + 0.5 * Math.sin(time * 2.2 + q * 1.7), big = (q & 3) === 0;
      ctx.fillStyle = big ? 'rgba(255,255,236,' + (a * (0.5 + 0.5 * tw)).toFixed(3) + ')' : 'rgba(255,238,160,' + (a * (0.35 + 0.55 * tw)).toFixed(3) + ')';
      ctx.fillRect(sn(x), sn(y), big ? 3 : 2, big ? 3 : 2);
      if (big && tw > 0.5) halo(x + 1, y + 1, 9, 'rgb(255,232,150)', a * 0.55 * tw);
    }
  }
  // fireflies: they blink, slowly, everywhere the light has gone
  function foFireflies(a, low, warm) {
    const n = low ? 14 : 36, drift = camS / mpp;
    for (let q = 0; q < n; q++) {
      const par = 0.4 + hsh(q, 931) * 0.7, x = mod(hsh(q, 932) * W + 30 * Math.sin(time * (0.3 + hsh(q, 933) * 0.4) + q), W), y = mod(hsh(q, 934) * (H + 60) - drift * par + 20 * Math.sin(time * (0.25 + hsh(q, 935) * 0.3) + q * 2), H + 60) - 30;
      const bl = Math.pow(Math.max(0, Math.sin(time * (0.8 + hsh(q, 936) * 0.9) + q * 2.7)), 3) * a; if (bl < 0.04) continue;
      const green = q % 5 !== 0;
      halo(x, y, 8 + par * 8, warm ? (green ? 'rgb(255,190,110)' : 'rgb(255,230,150)') : green ? 'rgb(226,255,120)' : 'rgb(140,255,200)', bl * 0.85);
      ctx.fillStyle = (warm ? 'rgba(255,236,190,' : green ? 'rgba(244,255,180,' : 'rgba(196,255,228,') + bl.toFixed(3) + ')'; ctx.fillRect(sn(x), sn(y), 2, 2);
    }
  }
  // eyes in the deep shade, watching, blinking
  function foEyes(a) {
    const z = 0.55, SP = 40;
    for (let i = foI0(z, SP, 20); i <= foI1(z, SP, 20); i++) {
      const m = i * SP; if (m < 650 || m > 1520 || hsh(i, 941) < 0.5) continue;
      if (mod(time * (0.2 + hsh(i, 942) * 0.15) + hsh(i, 943), 1) < 0.04) continue;
      const x = W * (0.05 + hsh(i, 944) * 0.9), y = foY(m + hsh(i, 945) * SP, z), gap = 6 + hsh(i, 946) * 6, c = hsh(i, 947) < 0.6 ? '228,255,106' : '255,190,90';
      ctx.fillStyle = 'rgba(' + c + ',' + (0.85 * a).toFixed(3) + ')'; ctx.fillRect(sn(x), sn(y), 3, 2); ctx.fillRect(sn(x + gap), sn(y), 3, 2);
      halo(x + gap / 2, y, 10, 'rgb(' + c + ')', 0.22 * a);
    }
  }
  // what grows on the two great trunks: bromeliads, orchids, and (in the shade) glowing bracket fungi
  function foTrunkFlora(side, w) {
    const SP = 22, dir = side ? -1 : 1, ex = side ? W - w : w, o = side ? AP : 0;
    for (let i = foI0(1, SP, 60); i <= foI1(1, SP, 60); i++) {
      const m = i * SP + hsh(i, 1941 + side) * SP * 0.6; if (m < 15 || m > FLOOR - 10 || hsh(i, 1943 + side) < 0.3) continue;
      const y = sn(yOf(m)), k = hsh(i, 1945 + side), lit = foCl(1 - m / 1200), A = air(m);
      if (m > 650 && k < 0.5) {
        const teal = k < 0.25, on = foCl((m - 650) / 300), pul = 0.6 + 0.4 * Math.sin(time * 1.3 + i), gc = teal ? '120,255,210' : '190,255,120';
        for (let s = 0; s < 3; s++) { const ww = (5 - s) * AP * 2, yy = y + s * AP * 4; ctx.fillStyle = css(lerp3(A, [200, 190, 160], 0.35)); ctx.fillRect(side ? ex - ww : ex, yy, ww, AP * 2); ctx.fillStyle = 'rgba(' + gc + ',' + (0.75 * on * pul).toFixed(3) + ')'; ctx.fillRect(side ? ex - ww : ex, yy + AP * 2, ww, AP); }
        halo(ex + dir * AP * 5, y + AP * 6, 20, 'rgb(' + gc + ')', 0.45 * on * pul);
      } else if (k < 0.7) {
        const leaf = css(lerp3(A, [70, 160, 70], 0.3 + 0.35 * lit)), dark = css(lerp3(A, [10, 40, 20], 0.6));
        for (let f = 0; f < 5; f++) { const L = 4 + f, ang = 0.25 + f * 0.27; for (let t = 1; t <= L; t++) { ctx.fillStyle = t === L || !(f & 1) ? leaf : dark; ctx.fillRect(sn(ex + dir * Math.cos(ang) * t * AP * 1.2) - o, sn(y - Math.sin(ang) * t * AP * 1.2), AP, AP); } }
        const fc = FO_FLOWER[i % 3]; ctx.fillStyle = css(lerp3(A, fc, 0.4 + 0.55 * lit));
        ctx.fillRect(sn(ex + dir * AP * 3) - o, y - AP * 10, AP, AP * 6); ctx.fillRect(sn(ex + dir * AP * 2) - o, y - AP * 9, AP * 3, AP); ctx.fillRect(sn(ex + dir * AP * 2) - o, y - AP * 7, AP * 3, AP);
        if (lit > 0.3) { ctx.fillStyle = 'rgba(255,250,220,' + (0.6 * lit).toFixed(2) + ')'; ctx.fillRect(sn(ex + dir * AP * 3) - o, y - AP * 11, AP, AP); }
      } else {
        const st = css(lerp3(A, [30, 80, 40], 0.5)), pc = css(lerp3(A, i & 1 ? [255, 240, 250] : [255, 150, 214], 0.45 + 0.5 * lit)), cc = css(lerp3(A, [255, 210, 60], 0.45 + 0.5 * lit)), sw = Math.sin(time * 0.9 + i) * AP;
        ctx.fillStyle = st; for (let t = 0; t < 7; t++) ctx.fillRect(sn(ex + dir * t * AP * 1.5 + sw * t / 7) - o, sn(y + t * t * AP * 0.25), AP, AP);
        for (let b = 0; b < 3; b++) { const bx = sn(ex + dir * (3 + b * 3) * AP + sw * (0.4 + b * 0.3)) - o, by = sn(y + (2 + b * 2.4) * AP * 1.2); ctx.fillStyle = pc; ctx.fillRect(bx - AP, by, AP * 3, AP); ctx.fillRect(bx, by - AP, AP, AP * 3); ctx.fillStyle = cc; ctx.fillRect(bx, by, AP, AP); }
      }
    }
  }
  // the forest floor: buttress roots, a fallen log, red-capped and glowing mushrooms
  function foFloor() {
    if (!near(FLOOR, 280)) return;
    const y = yOf(FLOOR), tw = Math.max(26, Math.min(70, W * 0.06)), A = air(FLOOR), bark = css(lerp3(A, [2, 7, 4], 0.86)), bark2 = css(lerp3(A, [10, 16, 8], 0.8)), moss = css(lerp3(A, [80, 160, 60], 0.45));
    for (let side = 0; side < 2; side++) {
      const dir = side ? -1 : 1, o = side ? AP * 2 : 0;
      for (let f = 0; f < 2; f++) {
        const x0 = (side ? W - tw : tw) + dir * f * W * 0.035, reach = W * (0.13 - f * 0.04), hgt = 170 - f * 70;
        for (let t = 0; t < reach; t += AP * 2) { const u = t / reach, top = y - hgt * Math.pow(1 - u, 2.4) - 3; ctx.fillStyle = f ? bark2 : bark; ctx.fillRect(sn(x0 + dir * t) - o, sn(top), AP * 2, y - top + 8); ctx.fillStyle = moss; if (hsh(t + f * 7, 1951 + side) < 0.6) ctx.fillRect(sn(x0 + dir * t) - o, sn(top), AP * 2, AP); }
      }
    }
    // a fallen log, furred with moss, with a few glowing caps on it
    const lx0 = W * 0.1, lx1 = W * 0.32, ly = y - AP * 9;
    ctx.fillStyle = css(lerp3(A, [40, 26, 14], 0.75)); ctx.fillRect(sn(lx0), sn(ly), lx1 - lx0, AP * 8);
    ctx.fillStyle = css(lerp3(A, [10, 6, 4], 0.7)); ctx.fillRect(sn(lx0), sn(ly + AP * 6), lx1 - lx0, AP * 2);
    ctx.fillStyle = moss; for (let x = lx0; x < lx1; x += AP) if (hsh(x | 0, 1953) < 0.7) ctx.fillRect(sn(x), sn(ly - (hsh(x | 0, 1954) < 0.3 ? AP : 0)), AP, AP * 2);
    ctx.fillStyle = css(lerp3(A, [150, 110, 70], 0.5)); ctx.fillRect(sn(lx1), sn(ly), AP * 2, AP * 8); ctx.fillStyle = css(lerp3(A, [70, 46, 26], 0.6)); ctx.fillRect(sn(lx1), sn(ly + AP * 3), AP * 2, AP * 2);
    const pul = 0.6 + 0.4 * Math.sin(time * 1.4);
    for (let q = 0; q < 4; q++) { const mx = sn(lx0 + (lx1 - lx0) * (0.15 + q * 0.22)), my = sn(ly - AP * 2); ctx.fillStyle = 'rgba(140,255,220,' + (0.6 + 0.35 * pul).toFixed(3) + ')'; ctx.fillRect(mx - AP, my - AP, AP * 3, AP); ctx.fillRect(mx, my, AP, AP); halo(mx + AP / 2, my, 12, 'rgb(120,255,210)', 0.5 * pul); }
    // pools of the last daylight on the ground
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let q = 0; q < 3; q++) { const px = W * (0.18 + q * 0.32), pr = 70 + q * 20, pg = ctx.createRadialGradient(px, y, 0, px, y, pr); pg.addColorStop(0, 'rgba(220,255,160,' + (0.16 + 0.04 * Math.sin(time * 0.6 + q)).toFixed(3) + ')'); pg.addColorStop(1, 'rgba(220,255,160,0)'); ctx.fillStyle = pg; ctx.setTransform(DPR, 0, 0, DPR * 0.35, 0, y * DPR * 0.65); ctx.fillRect(px - pr, y - pr, pr * 2, pr * 2); }
    ctx.restore();
    // glowing caps scattered over the ground
    for (let q = 0; q < 14; q++) { const gx = W * (0.04 + 0.92 * hsh(q, 1957)), gy = y - AP - hsh(q, 1958) * AP * 3, pp = 0.55 + 0.45 * Math.sin(time * 1.2 + q * 2), blue = q % 3 === 0; ctx.fillStyle = blue ? 'rgba(140,200,255,' + (0.6 + 0.4 * pp).toFixed(3) + ')' : 'rgba(150,255,210,' + (0.6 + 0.4 * pp).toFixed(3) + ')'; ctx.fillRect(sn(gx) - AP, sn(gy) - AP, AP * 3, AP); ctx.fillRect(sn(gx), sn(gy), AP, AP * 2); halo(gx, gy, 12, blue ? 'rgb(120,190,255)' : 'rgb(120,255,210)', 0.5 * pp); }
    // red toadstools by the right-hand roots
    for (let q = 0; q < 5; q++) {
      const mx = sn(W * (0.7 + q * 0.035) + hsh(q, 1955) * 10), sz = (q & 1 ? 3 : 4) * AP, my = sn(y - sz * 1.6);
      ctx.fillStyle = css(lerp3(A, [236, 226, 200], 0.6)); ctx.fillRect(mx - AP / 2, my, AP, sz * 1.6);
      ctx.fillStyle = css(lerp3(A, [220, 40, 34], 0.6)); ctx.fillRect(mx - sz, my - AP, sz * 2 + AP, AP * 2); ctx.fillRect(mx - sz + AP, my - AP * 2, sz * 2 - AP, AP);
      ctx.fillStyle = css(lerp3(A, [255, 250, 230], 0.55)); ctx.fillRect(mx - sz + AP, my - AP, AP, AP); ctx.fillRect(mx + AP, my - AP * 2, AP, AP); ctx.fillRect(mx + sz - AP, my, AP, AP);
    }
  }
  function foFrondArt(v, b) {
    return foCache('fr' + v + '_' + b, 52, 34, (g, w, h) => {
      const A = air([60, 500, 1100][b]), base = lerp3(A, [2, 8, 5], 0.4 + b * 0.12), lt = [0.6, 0.32, 0.18][b];
      const c0 = css(lerp3(base, [8, 40, 20], 0.55)), c1 = css(lerp3(base, [46, 132, 58], 0.3 + lt * 0.5)), c2 = css(lerp3(base, [160, 226, 116], lt * 0.75));
      const rib = x => 7 + Math.pow(x / w, 1.6) * (13 + v * 4);
      for (let x = 0; x < w - 2; x += 2) {
        const L = Math.round(9 * Math.sin(Math.PI * Math.min(1, (x + 5) / w)) * (0.85 + 0.3 * hsh(x, 1961 + v))), y0 = rib(x);
        for (let t = 1; t <= L; t++) { g.fillStyle = t >= L - 1 ? c2 : c1; g.fillRect((x + t * 0.6) | 0, (y0 - t) | 0, 1, 1); g.fillStyle = t === L ? c1 : c0; g.fillRect((x + t * 0.7) | 0, (y0 + t * 0.8) | 0, 1, 1); }
      }
      g.fillStyle = c0; for (let x = 0; x < w; x++) g.fillRect(x, rib(x) | 0, 1, 1);
    });
  }
  function foFronds() {
    const z = 1.15, SP = 15, tw = Math.max(26, Math.min(70, W * 0.06));
    for (let i = foI0(z, SP, 120); i <= foI1(z, SP, 60); i++) {
      const m = i * SP + hsh(i, 1971) * 8; if (m < 30 || m > FLOOR - 40 || hsh(i, 1972) < 0.2) continue;
      const side = (i + (hsh(i, 1973) < 0.3 ? 1 : 0)) & 1, y = foY(m, z), im = foFrondArt(i % 3, m < 260 ? 0 : m < 800 ? 1 : 2), sc = AP * (0.9 + hsh(i, 1974) * 0.5) * Math.min(1, 0.45 + W / 1400), ww = im.width * sc, hh = im.height * sc;
      if (y < -hh || y > H + hh) continue;
      ctx.save(); ctx.translate(side ? W - tw + AP : tw - AP, sn(y)); if (side) ctx.scale(-1, 1); ctx.rotate(-0.25 + hsh(i, 1975) * 0.5 + Math.sin(time * 0.8 + i) * 0.04);
      ctx.drawImage(im, 0, -hh * 0.25, ww, hh); ctx.restore();
    }
  }
  // giant roots reaching across the shaft under the forest, beaded with glowing sap in the root caves
  function foRootArches() {
    const z = 0.9, SP = 40, S = AP * 2;
    for (let i = foI0(z, SP, 120); i <= foI1(z, SP, 80); i++) {
      const m = i * SP + hsh(i, 1521) * 16; if (m < FLOOR + 40 || m > 2900 || hsh(i, 1522) < 0.3) continue;
      const left = hsh(i, 1523) < 0.5, dir = left ? 1 : -1, x0 = left ? 0 : W, y = foY(m, z), reach = W * (0.16 + 0.2 * hsh(i, 1524)), sap = m > 1950, A = air(m);
      if (y < -90 || y > H + 150) continue;
      const dk = css(lerp3(A, [24, 15, 9], 0.85)), md = css(lerp3(A, [62, 42, 24], 0.7)), lt = css(lerp3(A, sap ? [220, 150, 80] : [150, 120, 70], 0.5));
      for (let t = 0, j = 0; t <= reach; t += S, j++) {
        const u = t / reach, th = Math.max(AP, Math.round((1 - u * 0.75) * 8) * AP), yy = sn(y - Math.sin(u * Math.PI) * 14 + u * u * 50 + Math.sin(u * 7 + i) * 4), xx = sn(x0 + dir * t - (left ? 0 : S)), hj = hsh(i * 50 + j, 1525);
        ctx.fillStyle = dk; ctx.fillRect(xx, yy, S + 1, th); ctx.fillStyle = md; ctx.fillRect(xx, yy + AP, S + 1, Math.max(0, th * 0.4 - AP)); ctx.fillStyle = lt; ctx.fillRect(xx, yy, S + 1, AP);
        if (hj < 0.18) { ctx.fillStyle = dk; const hl = 3 + hsh(i * 50 + j, 1526) * 8; for (let k = 0; k < hl; k++) ctx.fillRect(sn(xx + AP + Math.sin(k * 0.9 + time * 0.8 + i) * 2), yy + th + k * AP, 1.5, AP); }
        else if (hj > (sap ? 0.86 : 0.92)) {
          const pul = 0.6 + 0.4 * Math.sin(time * 1.7 + j + i), gc = sap ? '255,190,110' : '140,255,210', bx = xx + AP * 0.5, by = yy + th;
          ctx.fillStyle = 'rgba(' + gc + ',' + (0.9 * pul).toFixed(3) + ')'; ctx.fillRect(bx - AP * 0.5, by, AP * 2, AP * 2); ctx.fillStyle = 'rgba(255,255,230,' + (0.8 * pul).toFixed(3) + ')'; ctx.fillRect(bx, by, AP, AP);
          halo(bx + AP / 2, by + AP, sap ? 18 : 12, 'rgb(' + gc + ')', 0.55 * pul);
          if (sap) { const uu = mod(time * 0.5 + hj * 9, 1); ctx.fillStyle = 'rgba(255,200,120,' + (0.9 * (1 - uu)).toFixed(3) + ')'; ctx.fillRect(bx, sn(by + AP * 2 + uu * uu * 110), AP, AP * 2); }
        }
      }
    }
  }

  // great drops of amber sap hanging on root threads, lit from inside
  const FO_DROP = [1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 4, 3];
  function foSapDrops(a) {
    const z = 0.8, SP = 30;
    for (let i = foI0(z, SP, 360); i <= foI1(z, SP, 60); i++) {
      const m = i * SP + hsh(i, 1981) * 12; if (m < 1950 || m > 2850 || hsh(i, 1982) < 0.3) continue;
      const x = W * (hsh(i, 1983) < 0.5 ? 0.05 + hsh(i, 1984) * 0.24 : 0.71 + hsh(i, 1984) * 0.24), len = 70 + hsh(i, 1986) * 140, yTop = foY(m, z) - len, sw = Math.sin(time * 0.7 + i) * 5, yb = yTop + len, s = AP * (0.7 + hsh(i, 1987) * 0.5), pul = 0.65 + 0.35 * Math.sin(time * 1.3 + i * 2), dx = sn(x + sw);
      if (yb + 14 * s < -20 || yTop > H + 20) continue;
      ctx.fillStyle = 'rgb(30,19,10)'; for (let t = 0; t < len; t += AP * 2) ctx.fillRect(sn(x + sw * t / len + Math.sin(t * 0.05 + i) * 2), sn(yTop + t), AP, AP * 2 + 1);
      ctx.globalCompositeOperation = 'lighter'; const R = 34 * s / AP, lg = ctx.createRadialGradient(dx, yb + 8 * s, 0, dx, yb + 8 * s, R); lg.addColorStop(0, 'rgba(255,170,70,' + (0.3 * pul * a).toFixed(3) + ')'); lg.addColorStop(1, 'rgba(255,140,50,0)'); ctx.fillStyle = lg; ctx.fillRect(dx - R, yb + 8 * s - R, R * 2, R * 2); ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
      for (let r = 0; r < FO_DROP.length; r++) { const hw = FO_DROP[r] * s, yy = sn(yb + r * s); ctx.fillStyle = '#b4520c'; ctx.fillRect(dx - hw, yy, hw * 2, s); if (FO_DROP[r] > 1) { ctx.fillStyle = r > 6 ? '#ffcf6a' : '#ff9a2a'; ctx.fillRect(dx - hw + s, yy, hw * 2 - 2 * s, s); } }
      ctx.fillStyle = 'rgba(255,248,214,' + (0.7 + 0.3 * pul).toFixed(3) + ')'; ctx.fillRect(dx - 2 * s, sn(yb + 6 * s), s, 2 * s); ctx.fillRect(dx, sn(yb + 8 * s), 2 * s, 2 * s);
      ctx.globalAlpha = 1;
      halo(dx, yb + 8 * s, 18, 'rgb(255,180,90)', 0.65 * pul * a);
      const u = mod(time * 0.4 + hsh(i, 1988), 1); if (u < 0.8) { ctx.fillStyle = 'rgba(255,200,110,' + (a * (1 - u)).toFixed(3) + ')'; ctx.fillRect(dx - s * 0.5, sn(yb + 12 * s + u * u * 160), s, s * 2); }
    }
  }
  // ---- the underground river: caustic light, luminous fish, bubbles, and the great eel ----
  const foCausArt = () => foCache('caus', 96, 96, (g, w, h) => foPix(g, w, h, (x, y) => { const T = 6.2832 / 96, v = Math.sin(2 * T * x + 1.6 * Math.sin(T * y + 0.5)) + Math.sin(3 * T * y + 1.4 * Math.sin(2 * T * x)), e = Math.abs(v); return e < 0.22 ? foPk(150, 230, 255, e < 0.1 ? 255 : 140) : 0; }));
  function foCaustics(a) {
    const c = foCausArt(), s = AP * 2.4, T = 96 * s;
    ctx.globalCompositeOperation = 'lighter';
    for (let p = 0; p < 2; p++) {
      const ox = mod(time * (p ? -7 : 9), T), oy = mod(-camS / mpp * (p ? 0.35 : 0.5) + time * (p ? 3 : 5), T);
      ctx.globalAlpha = a * (p ? 0.04 : 0.065);
      for (let y = oy - T; y < H; y += T) for (let x = -ox - (p ? T * 0.5 : 0); x < W; x += T) ctx.drawImage(c, sn(x), sn(y), T, T);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  function foFish(low) {
    const z = 1, SP = 40;
    for (let i = foI0(z, SP, 60); i <= foI1(z, SP, 60); i++) {
      const m = i * SP + hsh(i, 1501) * 20; if (m < 2790 || m > 3760 || hsh(i, 1502) < 0.2) continue;
      const dir = hsh(i, 1503) < 0.5 ? 1 : -1, sp = 26 + hsh(i, 1504) * 30, cx = mod(hsh(i, 1505) * W + dir * time * sp, W + 260) - 130, cy = foY(m, z), n = low ? 4 : 7 + (hsh(i, 1506) * 5 | 0), pink = hsh(i, 1507) < 0.3;
      if (cy < -60 || cy > H + 60) continue;
      const stripe = pink ? 'rgba(255,156,224,0.95)' : 'rgba(156,244,255,0.95)', body = pink ? '#3a1840' : '#0e2c40', gc = pink ? 'rgb(255,130,210)' : 'rgb(110,214,255)', s = AP * 0.95;
      for (let k = 0; k < n; k++) {
        const fx0 = cx - dir * (k & 3) * 22 - dir * (k >> 2) * 11 + Math.sin(time * 1.7 + k * 1.3 + i) * 5, fy = cy + ((k * 37) % 7 - 3) * 9 + Math.sin(time * 2.1 + k) * 3, tl = ((time * 8 + k) | 0) & 1;
        ctx.fillStyle = body; ctx.fillRect(sn(fx0 - 4 * s), sn(fy - s), 8 * s, 3 * s); ctx.fillRect(sn(fx0 - 3 * s), sn(fy - 2 * s), 5 * s, s);
        ctx.fillRect(sn(dir > 0 ? fx0 - 5 * s : fx0 + 4 * s), sn(fy - 2 * s + tl * s), s, 3 * s);
        ctx.fillStyle = stripe; ctx.fillRect(sn(fx0 - 3 * s), sn(fy), 6 * s, s);
        ctx.fillStyle = '#eaffff'; ctx.fillRect(sn(dir > 0 ? fx0 + 2 * s : fx0 - 3 * s), sn(fy - s), s, s);
        if (k % 2 === 0) halo(fx0, fy, 14, gc, 0.5);
      }
    }
  }
  function foBubbles(a) {
    ctx.fillStyle = 'rgba(190,240,255,' + (0.55 * a).toFixed(3) + ')';
    for (let q = 0; q < 18; q++) {
      const x = sn(mod(hsh(q, 1531) * W + Math.sin(time * 1.3 + q) * 6, W)), y = sn(mod(hsh(q, 1532) * (H + 40) - time * (30 + hsh(q, 1533) * 40) - camS / mpp * 0.8, H + 40) - 20), s = q % 3 ? 2 : AP;
      if (q % 3) ctx.fillRect(x, y, 2, 2); else { ctx.fillRect(x - s, y, s, s); ctx.fillRect(x + s, y, s, s); ctx.fillRect(x, y - s, s, s); ctx.fillRect(x, y + s, s, s); }
    }
  }
  function foEel() {
    const cy = yOf(3250), hx = mod(time * 46, W + 700) - 350, n = 34;
    for (let k = n - 1; k >= 0; k--) {
      const x = hx - k * AP * 2.2, y = cy + Math.sin(time * 2.6 - k * 0.32) * 16 * Math.min(1, k / 6 + 0.3), th = AP * (k < 3 ? 3 + k * 0.5 : 4.5 * (1 - k / n) + 1.2);
      ctx.fillStyle = '#071820'; ctx.fillRect(sn(x), sn(y - th / 2), AP * 2.4, th);
      if (k % 4 === 2) { ctx.fillStyle = 'rgba(140,250,255,0.9)'; ctx.fillRect(sn(x), sn(y - AP / 2), AP, AP); if (k % 8 === 2) halo(x, y, 12, 'rgb(110,214,255)', 0.5); }
    }
    ctx.fillStyle = '#aef8ff'; ctx.fillRect(sn(hx + AP * 1.2), sn(cy + Math.sin(time * 2.6) * 4.8 - AP), AP, AP);
  }

  // ---- the glowworm grotto: a roof of living stars ----
  function foStarArt(k) {
    return foCache('st' + k, W, 512, (g, w, h) => {
      if (!k) for (let q = 0; q < 5; q++) { const r = 60 + hsh(q, 1123) * 80, x = hsh(q, 1121) * w, y = r + hsh(q, 1122) * (h - r * 2), gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, q & 1 ? 'rgba(60,140,210,0.12)' : 'rgba(60,210,190,0.1)'); gr.addColorStop(1, 'rgba(60,160,200,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
      const n = Math.round(w * h / (k ? 3600 : 300));
      for (let q = 0; q < n; q++) {
        let x = hsh(q, 1101 + k * 7) * w, y = hsh(q, 1102 + k * 7) * h;
        if (!k && q % 3 === 0) { const u = hsh(q, 1103); x = u * w; y = mod(h * (0.15 + 0.7 * u) + (hsh(q, 1104) - 0.5) * 70 * (1.2 + Math.sin(u * 11)), h); } // a river of light across the roof
        const b = hsh(q, 1105 + k), c = b > 0.88 ? '235,255,255' : b > 0.45 ? '125,240,255' : '70,190,205';
        x |= 0; y |= 0;
        if (k) { g.fillStyle = 'rgba(' + c + ',0.95)'; g.fillRect(x, y, 2, 2); g.fillStyle = 'rgba(' + c + ',0.4)'; g.fillRect(x - 2, y, 2, 2); g.fillRect(x + 2, y, 2, 2); g.fillRect(x, y - 2, 2, 2); g.fillRect(x, y + 2, 2, 2); }
        else { g.fillStyle = 'rgba(' + c + ',' + (0.4 + 0.6 * hsh(q, 1106)).toFixed(2) + ')'; const s = b > 0.7 ? 2 : 1; g.fillRect(x, y, s, s); if (b > 0.96) { g.fillStyle = 'rgba(' + c + ',0.35)'; g.fillRect(x - 1, y, 4, 2); g.fillRect(x, y - 1, 2, 4); } }
      }
    });
  }
  function foStars(a, low) {
    const T = 512, o0 = mod(camS / mpp * 0.1, T), base = foStarArt(0);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; for (let y = -o0; y < H; y += T) ctx.drawImage(base, 0, sn(y));
    if (!low) { const o1 = mod(camS / mpp * 0.14, T); for (let k = 1; k <= 2; k++) { const im = foStarArt(k); ctx.globalAlpha = a * (0.5 + 0.5 * Math.sin(time * 1.3 + k * 3.1)); for (let y = -o1; y < H; y += T) ctx.drawImage(im, 0, sn(y)); } }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  // the brightest of them flare into little crosses
  function foGlints(a, col, n, seed, par) {
    const rp = rampOf(col);
    for (let q = 0; q < n; q++) {
      const x = F(hsh(q, seed) * W), y = F(mod(hsh(q, seed + 1) * (H + 80) - camS / mpp * par * (0.6 + hsh(q, seed + 3) * 0.6), H + 80) - 40), tw = Math.pow(Math.max(0, Math.sin(time * (0.7 + hsh(q, seed + 2)) + q * 2)), 4) * a;
      if (tw < 0.12) continue;
      pglow(x, y, 5, tw * 0.8, rp, 4); const L = (1 + tw * 5) | 0;
      for (let k = 1; k <= L; k++) { const c = rp[k < 2 ? 4 : 3]; pset(x + k, y, c, 5); pset(x - k, y, c, 5); pset(x, y + k, c, 5); pset(x, y - k, c, 5); }
      pset(x, y, rp[4], 6);
    }
  }

  // ---- the crystal caverns: clusters of faceted crystal, and light split into colours ----
  function foXtalArt(v) {
    return foCache('xt' + v, 40, 56, (g, w, h) => {
      const P = [], n = 3 + (v % 3);
      for (let k = 0; k < n; k++) { const ang = -Math.PI / 2 + (k - (n - 1) / 2) * 0.32 + (hsh(k, 1201 + v) - 0.5) * 0.25, L = h * (0.45 + 0.5 * hsh(k, 1202 + v)) * (k === (n >> 1) ? 1.1 : 0.85); P.push([w / 2 + (k - (n - 1) / 2) * 4, h - 1, Math.cos(ang), Math.sin(ang), Math.min(L, h - 2), 5 + hsh(k, 1203 + v) * 5]); }
      const pal = [[[110, 56, 196], [186, 130, 255], [242, 224, 255]], [[56, 116, 206], [120, 200, 255], [226, 250, 255]], [[186, 56, 166], [255, 130, 220], [255, 226, 250]]][v % 3];
      foPix(g, w, h, (x, y) => {
        let col = 0;
        for (const p of P) {
          const dx = x - p[0], dy = y - p[1], u = dx * p[2] + dy * p[3], s = -dx * p[3] + dy * p[2]; if (u < 0 || u > p[4]) continue;
          const half = p[5] / 2 * Math.min(1, (p[4] - u) / (p[5] * 0.9)); if (Math.abs(s) > half) continue;
          const f = s / Math.max(0.5, half), edge = Math.abs(s) > half - 1;
          let c = f < -0.33 ? pal[0] : f < 0.33 ? pal[1] : pal[2]; c = lerp3(c, [255, 255, 255], (u / p[4]) * 0.25 + (edge ? 0.35 : 0));
          if (!edge && foDi(x, y) < 0.07) c = lerp3(c, pal[2], 0.6);
          col = foPk(c[0], c[1], c[2]);
        }
        return col;
      });
    });
  }
  function foXtalFar(a) {
    const z = 0.32, SP = 30;
    for (let i = foI0(z, SP, 220); i <= foI1(z, SP, 40); i++) {
      const m = i * SP; if (m < 4650 || m > 5900 || hsh(i, 1210) < 0.3) continue;
      const im = foXtalArt(i % 6), sc = AP * (0.6 + hsh(i, 1213) * 0.6), x = hsh(i, 1212) * W, y = foY(m + hsh(i, 1211) * SP, z), up = hsh(i, 1214) < 0.6, ww = im.width * sc, hh = im.height * sc;
      if (y < -hh - 20 || y > H + hh + 20) continue;
      ctx.globalAlpha = a * 0.5;
      if (up) ctx.drawImage(im, sn(x - ww / 2), sn(y - hh), ww, hh); else { ctx.save(); ctx.translate(sn(x), sn(y)); ctx.scale(1, -1); ctx.drawImage(im, -ww / 2, -hh, ww, hh); ctx.restore(); }
      halo(x, up ? y - hh * 0.6 : y + hh * 0.6, 14 + hh * 0.3, 'rgb(200,140,255)', 0.2 * a * (0.6 + 0.4 * Math.sin(time + i)));
    }
    ctx.globalAlpha = 1;
  }
  // beams of white light fall in, strike a floating crystal and fan out as a spectrum
  function foPrism(a) {
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++) {
      const px = W * (0.16 + 0.34 * k) + Math.sin(time * 0.13 + k * 2) * W * 0.05, py = H * (0.22 + 0.2 * ((k * 2) % 3)) + Math.sin(time * 0.1 + k) * 30, ang = 0.95 + 0.3 * Math.sin(time * 0.08 + k * 1.7), pul = a * (0.6 + 0.4 * Math.sin(time * 0.5 + k * 2.1));
      ctx.strokeStyle = 'rgba(255,250,255,' + (0.12 * pul).toFixed(3) + ')'; ctx.lineWidth = AP * 2; ctx.beginPath(); ctx.moveTo(px - Math.cos(ang) * H, py - Math.sin(ang) * H); ctx.lineTo(px, py); ctx.stroke();
      ctx.lineWidth = AP;
      for (let c = 0; c < 6; c++) { const an = ang + 0.12 + (c - 2.5) * 0.05; ctx.strokeStyle = 'rgba(' + FO_RB[c] + ',' + (0.18 * pul).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(an) * W * 1.3, py + Math.sin(an) * W * 1.3); ctx.stroke(); }
      ctx.globalCompositeOperation = 'source-over';
      const im = foXtalArt(k + 3), sc = AP * 0.45; ctx.globalAlpha = a; ctx.save(); ctx.translate(sn(px), sn(py)); ctx.rotate(Math.sin(time * 0.4 + k) * 0.3); ctx.drawImage(im, -im.width * sc / 2, -im.height * sc * 0.6, im.width * sc, im.height * sc); ctx.restore(); ctx.globalAlpha = 1;
      halo(px, py, 18, 'rgb(240,220,255)', 0.7 * pul);
      ctx.globalCompositeOperation = 'lighter';
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---- the sunken temple: carved walls, braziers, and guardians that still keep watch ----
  const FO_KEY = ['#######.', '#.....#.', '#.###.#.', '#.#.#.#.', '#.#...#.', '#.#####.', '#.......', '########'];
  const FO_GLYPH = [['..###..', '.#...#.', '#..#..#', '#.###.#', '#..#..#', '.#...#.', '..###..'], ['#..#..#', '.#.#.#.', '..###..', '###.###', '..###..', '.#.#.#.', '#..#..#'], ['......#', '.....##', '....#.#', '...#..#', '..#...#', '.#....#', '#######'], ['.#####.', '#.....#', '#.#.#.#', '#.....#', '#.###.#', '#.....#', '.#####.']];
  function foTempleArt(glow) {
    return foCache('tw' + glow, W / AP, 160, (g, w, h) => {
      const st = [];
      for (let r = 0; r < 20; r++) { const a = []; let x = -((hsh(r, 1311) * 12) | 0); while (x < w) { a.push(x); x += 10 + ((hsh(r * 131 + a.length, 1312) * 12) | 0); } a.push(x); st.push(a); }
      foPix(g, w, h, (x, y) => {
        const r = y >> 3, ly = y & 7, A = st[r]; let bi = 0; while (A[bi + 1] <= x) bi++;
        const x0 = A[bi], x1 = A[bi + 1], id = r * 131 + bi, frieze = r === 4 || r === 5;
        let mark = 0;
        if (frieze) { if (y > 33 && y < 46 && hsh(x >> 4, 1330) > 0.22 && FO_KEY[((y - 34) >> 1) & 7][(x >> 1) & 7] === '#') mark = hsh(x >> 4, 1331) < 0.2 ? 2 : 1; }
        else if (ly < 7 && x1 - x0 >= 10 && hsh(id, 1313) < 0.09) { const gx = x - x0 - (((x1 - x0) - 7) >> 1); if (gx >= 0 && gx < 7 && FO_GLYPH[(hsh(id, 1314) * 4) | 0][ly][gx] === '#') mark = hsh(id, 1315) < 0.45 ? 2 : 1; }
        if (glow) return mark === 2 ? foPk(255, 209, 102) : 0;
        if (frieze ? (y === 32 || y === 47) : (ly === 7 || x === x0)) return foPk(16, 13, 8);
        let c = frieze ? [84, 72, 46] : lerp3([62, 54, 34], [94, 82, 56], hsh(id, 1316));
        if (!frieze && (ly === 0 || x === x0 + 1)) c = lerp3(c, [150, 132, 92], 0.35);
        if (!frieze && (ly === 6 || x === x1 - 1)) c = lerp3(c, [0, 0, 0], 0.3);
        if (mark) c = mark === 2 ? [200, 160, 70] : lerp3(c, [0, 0, 0], 0.5);
        if (foDi(x, y) < 0.1 && hsh(x * 7 + y * 3, 1317) < 0.5) c = lerp3(c, [0, 0, 0], 0.18);
        if (hsh(x, 1318) < 0.025 && y < 10 + hsh(x, 1319) * 60 && foDi(x, y) < 0.75) c = lerp3([40, 90, 40], [70, 130, 50], hsh(y, x));
        else if (!frieze && ly === 0 && hsh(x * 13 + r, 1320) < 0.25) c = [64, 104, 44];
        return foPk(c[0], c[1], c[2]);
      });
    });
  }
  function foTempleWall(a, low) {
    const z = 0.3, base = foTempleArt(0), th = base.height * AP, off = mod((camS - 5800) / mpp * z, th);
    ctx.globalAlpha = a * 0.26; for (let y = -off; y < H; y += th) ctx.drawImage(base, 0, sn(y), base.width * AP, th);
    if (!low) { const gl = foTempleArt(1); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * (0.16 + 0.14 * Math.sin(time * 1.1)); for (let y = -off; y < H; y += th) ctx.drawImage(gl, 0, sn(y), gl.width * AP, th); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }
  // a stone brazier and its fire: rows of flame that flicker, embers rising, warm light thrown on the stone
  function foBrazier(x, y, s) {
    ctx.fillStyle = 'rgb(54,46,30)'; ctx.fillRect(sn(x - 3 * s), y, 6 * s, 16 * s); ctx.fillRect(sn(x - 5 * s), y + 14 * s, 10 * s, 3 * s); ctx.fillRect(sn(x - 7 * s), y - 3 * s, 14 * s, 4 * s);
    ctx.fillStyle = 'rgb(118,96,58)'; ctx.fillRect(sn(x - 7 * s), y - 3 * s, 14 * s, s); ctx.fillRect(sn(x - 3 * s), y, s, 16 * s);
    ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(x, y - 8 * s, 0, x, y - 8 * s, 34 * s); lg.addColorStop(0, 'rgba(255,170,80,' + (0.22 + 0.04 * Math.sin(time * 13 + x)).toFixed(3) + ')'); lg.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = lg; ctx.fillRect(x - 34 * s, y - 42 * s, 68 * s, 68 * s); ctx.globalCompositeOperation = 'source-over';
    const tk = (time * 11) | 0;
    for (let r = 0; r < 9; r++) {
      const wv = Math.round((9 - r) * 0.7 * (0.7 + 0.6 * hsh(tk * 13 + r + (x | 0), 1021))), off = Math.round((hsh(tk * 7 + r + (x | 0), 1022) - 0.5) * r * 0.35); if (wv <= 0) continue;
      const yy = y - 3 * s - (r + 1) * s;
      ctx.fillStyle = '#ff5a1a'; ctx.fillRect(sn(x + (off - wv) * s), yy, wv * 2 * s, s);
      if (wv > 2) { ctx.fillStyle = '#ffb12a'; ctx.fillRect(sn(x + (off - wv + 1.5) * s), yy, (wv * 2 - 3) * s, s); }
      if (wv > 4) { ctx.fillStyle = '#fff2b0'; ctx.fillRect(sn(x + (off - wv + 3) * s), yy, (wv * 2 - 6) * s, s); }
    }
    halo(x, y - 8 * s, 22 + 3 * Math.sin(time * 9 + x), 'rgb(255,170,70)', 0.6);
    for (let e = 0; e < 3; e++) { const u = mod(time * 0.7 + e / 3 + x * 0.013, 1); ctx.fillStyle = 'rgba(255,200,90,' + (1 - u).toFixed(2) + ')'; ctx.fillRect(sn(x + Math.sin(u * 8 + e) * 6 * s), sn(y - 12 * s - u * 40 * s), Math.max(1, s * 0.7), Math.max(1, s * 0.7)); }
  }
  function foGuardian(x, y, s, i) {
    const A = air(camS), st = css(lerp3(A, [44, 37, 24], 0.72)), hi = css(lerp3(A, [118, 102, 66], 0.5)), dk = css(lerp3(A, [8, 6, 3], 0.7)), pul = 0.55 + 0.45 * Math.sin(time * 1.2 + i);
    const R = (a, b, c, d, col) => { ctx.fillStyle = col; ctx.fillRect(sn(x + a * s), sn(y + b * s), c * s, d * s); };
    R(-3, -12, 6, 3, st); R(-7, -9, 14, 3, st); R(-9, -6, 18, 4, st); R(-9, -6, 18, 1, hi);
    R(-7, -2, 14, 14, st); R(-7, -2, 1, 14, hi); R(-5, 2, 3, 2, dk); R(2, 2, 3, 2, dk); R(-1, 4, 2, 4, hi); R(-3, 9, 6, 1, dk);
    R(-10, 12, 20, 4, st); R(-13, 16, 26, 22, st); R(-13, 16, 1, 22, hi); R(-6, 20, 12, 2, dk); R(-4, 24, 8, 8, dk); R(-3, 25, 6, 6, st);
    R(-17, 18, 5, 20, st); R(12, 18, 5, 20, st); R(-17, 18, 1, 20, hi);
    R(-18, 38, 36, 10, st); R(-18, 38, 36, 1, hi); R(-20, 48, 40, 6, hi); R(-20, 54, 40, 12, st);
    for (let q = 0; q < 5; q++) R(-16 + q * 7, 57, 4, 2, dk);
    const gold = 'rgba(255,209,102,' + (0.5 + 0.5 * pul).toFixed(3) + ')';
    R(-5, 2, 3, 2, gold); R(2, 2, 3, 2, gold); R(-3, 25, 6, 1, gold);
    halo(x - 3.5 * s, y + 3 * s, 12, 'rgb(255,209,102)', 0.6 * pul); halo(x + 3.5 * s, y + 3 * s, 12, 'rgb(255,209,102)', 0.6 * pul);
    foBrazier(x - 15 * s, y + 46 * s, s * 0.5); foBrazier(x + 15 * s, y + 46 * s, s * 0.5);
  }
  function foGuardians() {
    const z = 0.8, SP = 230;
    for (let i = foI0(z, SP, 500); i <= foI1(z, SP, 120); i++) {
      const m = i * SP + 60; if (m < 5950 || m > 6950) continue;
      const left = i % 2 === 0, s = AP * Math.max(0.8, Math.min(1.6, W / 760)), x = left ? W * 0.05 + 16 * s : W * 0.95 - 16 * s, y = foY(m, z);
      if (y < -70 * s || y > H + 20 * s) continue;
      foGuardian(x, y, s, i);
    }
  }

  // ---- the fungal deep: a forest of giant glowing mushrooms, drifting spores and floating spore-pods ----
  function foMushArt(v) {
    return foCache('mu' + v, 64, 72, (g, w, h) => {
      const cw = 15 + v * 3 + hsh(v, 1401) * 5, ch = cw * (0.42 + 0.12 * hsh(v, 1402)), cy = 22, sx = w / 2 + (hsh(v, 1403) - 0.5) * 8, sp = [[255, 150, 220], [180, 140, 255], [120, 230, 255], [255, 170, 140]][v % 4], spot = lerp3(sp, [255, 255, 255], 0.5);
      foPix(g, w, h, (x, y) => {
        if (y <= cy) {
          const dx = (x - sx) / cw, dy = (cy - y) / ch, rr = dx * dx + dy * dy; if (rr >= 1) return 0;
          if (rr > 0.86) return foPk(sp[0], sp[1], sp[2]);
          if (rr < 0.75 && hsh(((x / 3) | 0) * 31 + ((y / 3) | 0), 1404 + v) < 0.1) return foPk(spot[0], spot[1], spot[2]);
          const c = lerp3([40, 16, 52], [120, 58, 144], foCl(dy * 1.1 - dx * 0.3 + (foDi(x, y) - 0.5) * 0.25)); return foPk(c[0], c[1], c[2]);
        }
        if (y <= cy + 2 && Math.abs(x - sx) < cw * (0.95 - (y - cy) * 0.08)) return x & 1 ? foPk(sp[0] * 0.8, sp[1] * 0.8, sp[2] * 0.8) : foPk(30, 10, 40);
        const t = (y - cy) / (h - cy), scx = sx + (w / 2 - sx) * t + Math.sin(t * 3 + v) * 2, sw = 2 + t * 2 + v * 0.3;
        if (Math.abs(x - scx) < sw) { const c = lerp3([70, 50, 84], [150, 120, 160], x < scx ? 0.6 : 0.1); return foPk(c[0], c[1], c[2]); }
        return 0;
      });
    });
  }
  function foMushFar(a) {
    const z = 0.34, SP = 24;
    for (let i = foI0(z, SP, 280); i <= foI1(z, SP, 20); i++) {
      const m = i * SP + hsh(i, 1441) * 12; if (m < 6950 || m > 8500 || hsh(i, 1442) < 0.35) continue;
      const im = foMushArt(i & 3), sc = AP * (0.7 + hsh(i, 1443) * 0.8), x = hsh(i, 1444) * W, y = foY(m, z), hh = im.height * sc, pul = 0.6 + 0.4 * Math.sin(time * 1.1 + i);
      if (y < -20 || y - hh > H + 20) continue;
      ctx.globalAlpha = a * 0.62; ctx.drawImage(im, sn(x - im.width * sc / 2), sn(y - hh), im.width * sc, hh);
      halo(x, y - hh * 0.68, 12 + sc * 7, FO_SPORE_H[i & 3], 0.22 * a * pul);
    }
    ctx.globalAlpha = 1;
  }
  function foSpores(a, low) {
    const n = low ? 16 : 44;
    for (let q = 0; q < n; q++) {
      const par = 0.3 + hsh(q, 1431) * 0.9, x = mod(hsh(q, 1432) * W + Math.sin(time * 0.5 + q * 1.3) * 26, W), y = mod(hsh(q, 1433) * (H + 40) - camS / mpp * par - time * (4 + 6 * hsh(q, 1434)), H + 40) - 20, tw = 0.5 + 0.5 * Math.sin(time * 1.8 + q * 2.1), c = q & 3, s = par > 0.9 ? 3 : 2;
      ctx.fillStyle = 'rgba(' + FO_SPORE[c] + ',' + (a * (0.35 + 0.6 * tw)).toFixed(3) + ')'; ctx.fillRect(sn(x), sn(y), s, s);
      if (q % 3 === 0) halo(x + 1, y + 1, 6 + par * 6, FO_SPORE_H[c], a * 0.55 * tw);
    }
  }
  function foPods(a, low) {
    const s = AP;
    for (let q = 0; q < (low ? 2 : 5); q++) {
      const x = W * (0.07 + 0.215 * q) + Math.sin(time * 0.3 + q * 2) * 24, y = mod(hsh(q, 1451) * (H + 240) - camS / mpp * 0.75 - time * 7, H + 240) - 120, pul = 0.6 + 0.4 * Math.sin(time * 1.4 + q * 2), c = FO_SPORE[q & 3];
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(' + c + ',0.45)'; ctx.fillRect(sn(x - 3 * s), sn(y - 2 * s), 6 * s, 4 * s); ctx.fillRect(sn(x - 2 * s), sn(y - 3 * s), 4 * s, 6 * s);
      ctx.fillStyle = 'rgba(' + c + ',0.9)'; ctx.fillRect(sn(x - s), sn(y - s), 2 * s, 2 * s); ctx.fillStyle = 'rgba(255,255,255,' + (0.8 * pul).toFixed(3) + ')'; ctx.fillRect(sn(x - s), sn(y - s), s, s);
      ctx.fillStyle = 'rgba(' + c + ',0.5)'; for (let t = 0; t < 3; t++) for (let k = 1; k < 7; k++) ctx.fillRect(sn(x + (t - 1) * 2 * s + Math.sin(time * 2 + k * 0.6 + t + q) * k * 0.6), sn(y + 2 * s + k * s * 1.4), Math.max(1, s * 0.67), s);
      halo(x, y, 24, FO_SPORE_H[q & 3], 0.5 * a * pul);
    }
    ctx.globalAlpha = 1;
  }

  // ---- the magma veins: a wall of glowing cracks, falls of lava, embers and heat ----
  function foCrackArt() {
    return foCache('crk', W, 512, (g, w, h) => {
      const walk = (x, y, ang, n, wd, seed) => {
        for (let s = 0; s < n && y < h + 10; s++) {
          ang += (hsh(s * 7 + seed, 1603) - 0.5) * 0.7; ang = Math.max(0.4, Math.min(Math.PI - 0.4, ang)); x += Math.cos(ang) * 4; y += Math.sin(ang) * 4;
          g.fillStyle = 'rgba(255,80,20,0.3)'; g.fillRect((x - wd - 2) | 0, (y - 1) | 0, wd * 2 + 4, 6);
          g.fillStyle = wd > 1 ? '#ffb12a' : '#ff6a1a'; g.fillRect((x - wd / 2) | 0, y | 0, Math.max(1, wd), 4);
          if (wd > 1 && hsh(s, seed + 1604) < 0.05) walk(x, y, ang + (hsh(s, seed + 1605) < 0.5 ? -0.9 : 0.9), 26, 1, seed + s * 3 + 1);
        }
      };
      for (let k = 0; k < Math.max(6, w / 130); k++) walk(hsh(k, 1601) * w, -10, Math.PI / 2 + (hsh(k, 1602) - 0.5) * 0.8, 140, 2, k * 100);
    });
  }
  function foMagmaFar(a) {
    const T = 512, im = foCrackArt(), off = mod(camS / mpp * 0.22, T);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * (0.32 + 0.16 * Math.sin(time * 1.3));
    for (let y = -off; y < H; y += T) ctx.drawImage(im, 0, sn(y));
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  function foLavaFall(x, y0, len, cols, a, seed) {
    const S2 = AP * 2, w = cols * S2, xl = x - w / 2, t0 = Math.max(y0, -S2), t1 = Math.min(y0 + len, H + S2), sc = time * 110;
    if (t1 > t0) { ctx.globalCompositeOperation = 'lighter'; const gw = w * 3, gg = ctx.createLinearGradient(x - gw, 0, x + gw, 0); gg.addColorStop(0, 'rgba(255,80,20,0)'); gg.addColorStop(0.5, 'rgba(255,110,40,' + (0.2 * a).toFixed(3) + ')'); gg.addColorStop(1, 'rgba(255,80,20,0)'); ctx.fillStyle = gg; ctx.fillRect(x - gw, t0, gw * 2, t1 - t0); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = a;
    if (y0 > -20 && y0 < H + 20) { ctx.fillStyle = '#1a0806'; ctx.fillRect(sn(xl - AP * 8), sn(y0 - AP * 4), w + AP * 16, AP * 5); ctx.fillStyle = '#ff8a2a'; ctx.fillRect(sn(xl - AP * 4), sn(y0), w + AP * 8, AP); }
    for (let y = y0 + Math.max(0, Math.floor((t0 - y0) / S2)) * S2; y < t1; y += S2) {
      const u = (y - y0) / len, row = Math.floor((y - y0 - sc) / S2);
      for (let c = 0; c < cols; c++) { const hot = 1 - Math.abs(c - (cols - 1) / 2) / (cols / 2), v = 1.4 + hot * 3 + (hsh(row * 11 + c, 1620 + seed) - 0.5) * 2.6 - u * 1.2; ctx.fillStyle = FO_LAVA[Math.max(0, Math.min(5, Math.round(v)))]; ctx.fillRect(sn(xl + c * S2), sn(y), S2, S2); }
    }
    const yb = y0 + len;
    if (yb > -30 && yb < H + 60) {
      ctx.fillStyle = '#ff5a1a'; ctx.fillRect(sn(x - w * 1.6), sn(yb), w * 3.2, AP * 2); ctx.fillStyle = '#ffd34d'; ctx.fillRect(sn(x - w * 0.8), sn(yb), w * 1.6, AP);
      for (let q = 0; q < 6; q++) { const uu = mod(time * 1.6 + q / 6, 1); ctx.globalAlpha = a * (1 - uu); ctx.fillRect(sn(x + (hsh(q, 1630 + seed) - 0.5) * 60 * uu), sn(yb - Math.sin(uu * Math.PI) * 26 * (0.6 + hsh(q, 1631))), AP, AP); }
      halo(x, yb, 34, 'rgb(255,140,50)', 0.75 * a);
    }
    ctx.globalAlpha = 1;
  }
  function foLavaFalls(a) {
    const z = 0.62, SP = 110;
    for (let i = foI0(z, SP, 560); i <= foI1(z, SP, 60); i++) {
      const m = i * SP + hsh(i, 1611) * 40; if (m < 8450 || m > 10100) continue;
      const left = (i & 1) === 0, x = left ? W * (0.09 + hsh(i, 1612) * 0.08) : W * (0.83 + hsh(i, 1612) * 0.08), y0 = foY(m, z), len = 300 + hsh(i, 1613) * 260;
      if (y0 > H + 20 || y0 + len < -40) continue;
      foLavaFall(x, y0, len, 3 + (hsh(i, 1614) * 3 | 0), a, i);
    }
  }
  function foEmbers(a, low) {
    ctx.globalCompositeOperation = 'lighter'; const hg = ctx.createLinearGradient(0, H, 0, H * 0.45); hg.addColorStop(0, 'rgba(255,90,30,' + (0.2 * a).toFixed(3) + ')'); hg.addColorStop(1, 'rgba(255,90,30,0)'); ctx.fillStyle = hg; ctx.fillRect(0, H * 0.45, W, H * 0.55); ctx.globalCompositeOperation = 'source-over';
    for (let q = 0; q < (low ? 14 : 40); q++) {
      const x = mod(hsh(q, 1642) * W + Math.sin(time * 1.1 + q) * 14, W), y = mod(hsh(q, 1643) * (H + 40) - time * (30 + hsh(q, 1641) * 60) - camS / mpp * 0.4, H + 40) - 20, fl = 0.5 + 0.5 * Math.sin(time * 9 + q * 3);
      ctx.fillStyle = FO_LAVA[3 + (fl * 2.9 | 0)]; ctx.globalAlpha = a * (0.5 + 0.5 * fl); ctx.fillRect(sn(x), sn(y), 2, q % 3 ? 2 : 4);
      if (q % 5 === 0) halo(x, y, 8, 'rgb(255,150,60)', 0.5 * a * fl);
    }
    ctx.globalAlpha = 1;
  }

  // ---- the Obscura: veils of gold, floating rune-stones, the heart's pull, and the floor of the world ----
  const foRibArt = () => foCache('rib', 1, 96, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,214,120,0)'); gr.addColorStop(0.6, 'rgba(255,214,120,0.35)'); gr.addColorStop(0.92, 'rgba(255,244,200,0.9)'); gr.addColorStop(1, 'rgba(255,214,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  function foMonolith(x, y, wd, ht, i, dim) {
    const A = air(camS), st = css(lerp3([34, 26, 10], A, dim)), ed = css(lerp3([126, 96, 42], A, dim)), pul = 0.5 + 0.5 * Math.sin(time * 1.2 + i * 1.9);
    ctx.fillStyle = st; ctx.fillRect(sn(x - wd / 2), sn(y), wd, ht); ctx.fillRect(sn(x - wd / 2 + AP), sn(y - AP * 2), wd - AP * 2, AP * 2); ctx.fillRect(sn(x - wd / 2 + AP * 2), sn(y + ht), wd - AP * 4, AP * 2);
    ctx.fillStyle = ed; ctx.fillRect(sn(x - wd / 2), sn(y), AP, ht);
    ctx.fillStyle = 'rgba(255,214,120,' + ((0.35 + 0.6 * pul) * (1 - dim)).toFixed(3) + ')';
    for (let r = 0; r < ht / (AP * 5) - 1; r++) { const b = (hsh(i * 17 + r, 1801) * 512) | 0, gx = x - AP * 1.5, gy = y + AP * 3 + r * AP * 5; for (let p = 0; p < 9; p++) if ((b >> p) & 1) ctx.fillRect(sn(gx + (p % 3) * AP), sn(gy + ((p / 3) | 0) * AP), AP, AP); }
    if (dim < 0.5) halo(x, y + ht / 2, wd * 1.3, 'rgb(255,214,120)', 0.3 * pul);
  }
  function foMonoliths(a, z, SP, far) {
    for (let i = foI0(z, SP, 300); i <= foI1(z, SP, 60); i++) {
      const m = i * SP + hsh(i, 1811 + far) * SP * 0.5; if (m < 9950 || hsh(i, 1812 + far) < 0.35) continue;
      const left = hsh(i, 1813 + far) < 0.5, x = far ? hsh(i, 1814) * W : left ? W * (0.08 + hsh(i, 1814) * 0.1) : W * (0.82 + hsh(i, 1814) * 0.1), sc = far ? 0.55 : 1, wd = Math.round((6 + hsh(i, 1815) * 4) * sc) * AP, ht = Math.round((20 + hsh(i, 1816) * 20) * sc) * AP, y = foY(m, z) + Math.sin(time * 0.6 + i) * 6;
      if (y > H + 20 || y + ht < -20) continue;
      ctx.globalAlpha = a; foMonolith(x, y, wd, ht, i, far ? 0.55 : 0);
    }
    ctx.globalAlpha = 1;
  }
  function foObscFar(a, low) {
    const rib = foRibArt(), S = AP * 2;
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < (low ? 1 : 2); k++) {
      const by = mod(H * (0.35 + 0.4 * k) - camS / mpp * 0.12, H + 300) - 100;
      for (let x = 0; x < W; x += S) { const y = by + 40 * Math.sin(x * 0.005 + time * 0.22 + k * 2) + 16 * Math.sin(x * 0.019 - time * 0.5 + k), hh = 70 + 40 * Math.sin(x * 0.011 + time * 0.3 + k * 4); ctx.globalAlpha = a * (0.2 + 0.13 * Math.sin(x * 0.03 - time * 1.2 + k)); ctx.drawImage(rib, x, sn(y - hh), S, hh); }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    foMonoliths(a, 0.35, 40, 1);
  }
  function foGold(a, low) {
    const drift = camS / mpp;
    for (let q = 0; q < (low ? 14 : 36); q++) {
      const x = mod(hsh(q, 1701) * W + Math.sin(time * 0.4 + q) * 20, W), y = mod(hsh(q, 1702) * (H + 40) - drift * (0.4 + hsh(q, 1703) * 0.6) - time * (6 + hsh(q, 1704) * 8), H + 40) - 20, tw = 0.5 + 0.5 * Math.sin(time * 2 + q * 1.3);
      ctx.fillStyle = 'rgba(255,226,140,' + (a * (0.3 + 0.6 * tw)).toFixed(3) + ')'; ctx.fillRect(sn(x), sn(y), 2, 2);
      if ((q & 3) === 0) halo(x + 1, y + 1, 8, 'rgb(255,214,120)', 0.45 * a * tw);
    }
    // near the heart: slow rays, orbiting shards, light spiralling in, rings breaking outward
    if (near(11400, 700)) {
      const cy = yOf(11400), cx = W / 2, k0 = foCl(1 - Math.abs(camS - 11400) / 900), RR = Math.max(W, H);
      if (!low) { ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const rg = ctx.createRadialGradient(cx, cy, 30, cx, cy, RR); rg.addColorStop(0, 'rgba(255,220,140,' + (0.11 * k0).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = rg;
      for (let k = 0; k < 14; k++) { const a0 = k / 14 * 6.283 - time * 0.03, wd = 0.03 + 0.03 * hsh(k, 1721); ctx.globalAlpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.6 + k * 1.9)); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0 - wd) * RR, cy + Math.sin(a0 - wd) * RR); ctx.lineTo(cx + Math.cos(a0 + wd) * RR, cy + Math.sin(a0 + wd) * RR); ctx.closePath(); ctx.fill(); }
      ctx.restore(); }
      const R0 = Math.min(W, 700) * 0.16;
      for (let k = 0; k < 10; k++) {
        const an = time * (0.25 + 0.04 * k) + k * 0.628, r = R0 * (2 + 0.6 * Math.sin(time * 0.5 + k)), x = cx + Math.cos(an) * r * 1.4, y = cy + Math.sin(an) * r * 0.55, s = AP * (k & 1 ? 1 : 1.5);
        ctx.fillStyle = 'rgb(70,50,16)'; ctx.fillRect(sn(x - s), sn(y - 2 * s), 2 * s, 4 * s); ctx.fillStyle = 'rgba(255,220,130,0.9)'; ctx.fillRect(sn(x - s), sn(y - 2 * s), s, 3 * s); ctx.fillRect(sn(x - 2 * s), sn(y - s * 0.5), 4 * s, s);
        halo(x, y, 10, 'rgb(255,214,120)', 0.4 * k0);
      }
      const rp = rampOf('#ffd166');
      for (let q = 0; q < (low ? 16 : 44); q++) { const u = mod(time * 0.07 + hsh(q, 1711), 1), r = (1 - u) * Math.min(W, H) * 0.6, an = hsh(q, 1712) * 6.283 + u * 7; pset(F(cx + Math.cos(an) * r * 1.3), F(cy + Math.sin(an) * r * 0.65), rp[u > 0.7 ? 4 : 3], 4); }
      if (!low) for (let k = 0; k < 3; k++) { const rr = mod(time * 0.22 + k / 3, 1); pring(F(cx), F(cy), F(R0 * 1.4 + rr * Math.min(W, H) * 0.55), 2, (1 - rr) * 0.6 * k0, rp, time + k); }
    }
    // the floor of the world, lit from below
    if (camS > 11000) {
      const yb = yOf(12000), k2 = foCl((camS - 11000) / 800), yf = Math.min(H, yb);
      ctx.globalCompositeOperation = 'lighter';
      const gg = ctx.createLinearGradient(0, yf - H * 0.6, 0, yf); gg.addColorStop(0, 'rgba(255,200,100,0)'); gg.addColorStop(1, 'rgba(255,200,100,' + (0.22 * k2).toFixed(3) + ')'); ctx.fillStyle = gg; ctx.fillRect(0, yf - H * 0.6, W, H * 0.6);
      for (let q = 0; q < 6; q++) { const px = W * (0.1 + 0.16 * q) + Math.sin(time * 0.2 + q) * 20, pw = 10 + 26 * hsh(q, 1831), al = k2 * (0.07 + 0.05 * Math.sin(time * 0.7 + q * 2)), pg = ctx.createLinearGradient(0, yf, 0, yf - H); pg.addColorStop(0, 'rgba(255,226,150,' + al.toFixed(3) + ')'); pg.addColorStop(1, 'rgba(255,226,150,0)'); ctx.fillStyle = pg; ctx.fillRect(sn(px - pw / 2), yf - H, pw, H); }
      ctx.globalCompositeOperation = 'source-over';
      if (yb < H + 10) {
        ctx.fillStyle = 'rgb(34,24,8)'; ctx.beginPath(); ctx.moveTo(0, H + 10); for (let x = 0; x <= W + 30; x += 30) ctx.lineTo(x, yb + hsh(x, 1841) * 14 - 7); ctx.lineTo(W, H + 10); ctx.closePath(); ctx.fill();
        const pul = 0.6 + 0.4 * Math.sin(time * 1.5);
        for (let k = 0; k < 7; k++) { let x = W * (0.08 + k * 0.14), y = yb + 4; ctx.fillStyle = 'rgba(255,214,120,' + (0.55 + 0.4 * pul).toFixed(3) + ')'; for (let t = 0; t < 14 && y < H; t++) { x += (hsh(k * 20 + t, 1842) - 0.5) * AP * 4; y += AP * 2; ctx.fillRect(sn(x), sn(y), AP, AP * 2); } }
        ctx.fillStyle = 'rgba(255,240,200,' + (0.6 + 0.4 * pul).toFixed(3) + ')'; ctx.fillRect(0, sn(yb - 1), W, AP);
        // spires of rock standing on the floor, gilded on the side that faces the light
        for (let k = 0; k < 8; k++) { const left = k < 4, sx = left ? W * (0.03 + k * 0.07) : W * (0.97 - (k - 4) * 0.07), sh = 50 + hsh(k, 1851) * 110, bw = 10 + hsh(k, 1852) * 12; for (let t = 0; t < sh; t += AP * 2) { const ww = Math.max(AP, bw * (1 - t / sh)); ctx.fillStyle = 'rgb(30,21,7)'; ctx.fillRect(sn(sx - ww / 2), sn(yb - t - AP * 2), ww, AP * 2 + 1); ctx.fillStyle = 'rgba(255,214,120,' + (0.35 + 0.3 * pul).toFixed(3) + ')'; ctx.fillRect(sn(left ? sx + ww / 2 - AP : sx - ww / 2), sn(yb - t - AP * 2), AP, AP * 2); } }
        // a great seal set into the floor of the world, turning slowly
        const sx0 = W / 2, sy0 = yb + Math.min(90, H * 0.14), R1 = Math.min(W * 0.34, 240), sp = rampOf('#ffd166');
        for (let ring = 0; ring < 3; ring++) {
          const rr = R1 * (1 - ring * 0.24), n = Math.max(48, (rr * 0.55) | 0), rot = ring & 1 ? time * 0.05 : -time * 0.04;
          ctx.fillStyle = 'rgba(255,214,120,' + ((0.35 + 0.45 * pul) * (1 - ring * 0.18)).toFixed(3) + ')';
          for (let q = 0; q < n; q++) { if (ring === 1 && q % 7 === 0) continue; const an = q / n * 6.283 + rot, px = sx0 + Math.cos(an) * rr, py = sy0 + Math.sin(an) * rr * 0.3; ctx.fillRect(sn(px), sn(py), AP, AP); if (ring === 0 && q % 6 === 0) { const b = (hsh(q, 1853) * 512) | 0; for (let p = 0; p < 9; p++) if ((b >> p) & 1) ctx.fillRect(sn(px + (p % 3 - 1) * AP), sn(py + AP * 2 + ((p / 3) | 0) * AP), AP, AP); } }
        }
        ctx.globalCompositeOperation = 'lighter'; const bg2 = ctx.createLinearGradient(0, sy0, 0, sy0 - H); bg2.addColorStop(0, 'rgba(255,226,150,' + (0.16 * pul * k2).toFixed(3) + ')'); bg2.addColorStop(1, 'rgba(255,226,150,0)'); ctx.fillStyle = bg2; ctx.fillRect(sx0 - R1 * 0.3, sy0 - H, R1 * 0.6, H); ctx.globalCompositeOperation = 'source-over';
        pglow(F(sx0), F(sy0), F(70), 0.7 * pul, sp, 4);
      }
    }
  }

  // ---- what grows on the shaft walls below the forest, one world after another ----
  function foWall(side, w) {
    const SP = 26, dir = side ? -1 : 1, ex = side ? W - w * 0.75 : w * 0.75;
    for (let i = foI0(1, SP, 90); i <= foI1(1, SP, 90); i++) {
      const m = i * SP + hsh(i, 1001 + side) * SP * 0.5, r = hsh(i, 1003 + side); if (m < FLOOR + 30 || r < 0.2) continue;
      const kind = biomeOf(m).kind, y = sn(yOf(m)), pul = 0.6 + 0.4 * Math.sin(time * 1.5 + i * 1.7), A = air(m);
      const P = (dx, dy, ww, hh) => ctx.fillRect(sn(ex + (side ? -dx - ww : dx)), sn(y + dy), ww, hh);
      if (kind === 'floor' || kind === 'roots') {
        ctx.fillStyle = css(lerp3(A, [30, 20, 12], 0.8)); let tx = 0, ty = 0;
        for (let t = 0; t < 12; t++) { tx = t * AP * 1.6; ty = t * t * AP * 0.18 + Math.sin(t * 0.8 + i) * AP; P(tx, ty, AP * 2, Math.max(AP, (4 - t * 0.3) * AP)); }
        if (kind === 'roots' && r > 0.45) {
          ctx.fillStyle = 'rgba(255,190,110,' + (0.85 * pul).toFixed(3) + ')'; P(tx, ty + AP * 2, AP * 2, AP * 2); halo(ex + dir * (tx + AP), y + ty + AP * 3, 16, 'rgb(255,190,110)', 0.55 * pul);
          const u = mod(time * 0.55 + r * 7, 1); ctx.fillStyle = 'rgba(255,200,120,' + (0.9 * (1 - u)).toFixed(3) + ')'; P(tx + AP * 0.5, ty + AP * 4 + u * u * 90, AP, AP * 2);
        } else if (kind === 'floor' && r > 0.6) { ctx.fillStyle = 'rgba(160,255,200,' + (0.6 * pul).toFixed(3) + ')'; P(tx, ty + AP * 2, AP, AP); halo(ex + dir * tx, y + ty + AP * 2, 10, 'rgb(125,255,176)', 0.35 * pul); }
      } else if (kind === 'river') {
        for (let s = 0; s < 3; s++) { ctx.fillStyle = s === 1 ? 'rgba(60,170,150,0.8)' : 'rgba(30,110,100,0.8)'; for (let t = 0; t < 14; t++) P(s * AP * 2 + Math.sin(time * 1.4 + t * 0.45 + i + s) * t * 0.7, t * AP * 2, AP, AP * 2); }
        if (r > 0.55) { ctx.fillStyle = 'rgba(170,240,255,' + (0.9 * pul).toFixed(3) + ')'; P(AP * 2, -AP * 2, AP * 2, AP); halo(ex + dir * AP * 3, y - AP * 2, 12, 'rgb(110,214,255)', 0.5 * pul); }
      } else if (kind === 'grotto') {
        for (let s = 0; s < 4; s++) {
          const tl = 20 + hsh(i * 4 + s, 1011) * 90, tx = AP * (1 + s * 3), a2 = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 1.6 + s * 2 + i));
          ctx.fillStyle = 'rgba(125,240,255,' + (0.18 * a2).toFixed(3) + ')'; P(tx, 0, 1, tl);
          ctx.fillStyle = 'rgba(125,240,255,' + (0.6 * a2).toFixed(3) + ')'; for (let d2 = 10; d2 < tl; d2 += 14) P(tx - 1, d2, 2, 2);
          ctx.fillStyle = 'rgba(225,255,255,' + a2.toFixed(3) + ')'; P(tx - 1, tl, 3, 3); if (s === 1) halo(ex + dir * tx, y + tl, 10, 'rgb(125,240,255)', 0.5 * a2);
        }
      } else if (kind === 'crystal') {
        const im = foXtalArt((i % 3) + 3), sc = AP * (0.5 + r * 0.4) * Math.min(1, 0.4 + W / 1200);
        ctx.save(); ctx.translate(sn(ex - dir * AP * 2), y); ctx.rotate(dir * Math.PI / 2); ctx.drawImage(im, -im.width * sc / 2, -im.height * sc, im.width * sc, im.height * sc); ctx.restore();
        halo(ex + dir * im.height * sc * 0.6, y, 16 + 10 * r, 'rgb(200,140,255)', 0.4 * pul);
      } else if (kind === 'temple') {
        if (r > 0.6) { ctx.fillStyle = css(lerp3(A, [70, 60, 40], 0.8)); P(-AP * 2, 15 * AP * 0.7, AP * 14, AP * 3); foBrazier(ex + dir * AP * 6, y, AP * 0.7); }
        else { ctx.fillStyle = css(lerp3(A, [78, 68, 44], 0.8)); P(-AP * 2, -AP * 6, AP * 11, AP * 11); ctx.fillStyle = css(lerp3(A, [20, 16, 8], 0.7)); const gl = FO_GLYPH[i & 3]; for (let gy = 0; gy < 7; gy++) for (let gx = 0; gx < 7; gx++) if (gl[gy][gx] === '#') P(AP * (gx + 1), AP * (gy - 4), AP, AP); if (r > 0.45) { ctx.fillStyle = 'rgba(255,209,102,' + (0.5 * pul).toFixed(3) + ')'; P(AP * 4, -AP, AP, AP); } }
      } else if (kind === 'fungal') {
        for (let s = 0; s < 3; s++) { const ww = (7 - s * 2) * AP, yy = s * AP * 4 - AP * 4; ctx.fillStyle = css(lerp3([90, 34, 90], A, 0.3)); P(0, yy, ww, AP * 2); ctx.fillStyle = 'rgba(255,140,210,' + (0.8 * pul).toFixed(3) + ')'; P(0, yy + AP * 2, ww, AP); }
        ctx.fillStyle = 'rgba(255,170,230,' + (0.25 * pul).toFixed(3) + ')'; for (let t = 0; t < 10; t++) P(((t * 5) % 3) * AP, -AP * 5 - t * AP * 2, 1.5, AP * 2);
        halo(ex + dir * AP * 4, y, 22, 'rgb(255,120,200)', 0.45 * pul);
      } else if (kind === 'magma') {
        let dx = -AP * 8, dy = 0; ctx.globalAlpha = 0.5 + 0.5 * pul;
        for (let t = 0; t < 10; t++) { dx += AP * (1 + hsh(i * 10 + t, 1013)); dy += (hsh(i * 10 + t, 1014) - 0.5) * AP * 3; ctx.fillStyle = t < 3 ? '#ffd34d' : t < 7 ? '#ff8a2a' : '#c22a0a'; P(dx, dy, AP * 2, AP); }
        ctx.globalAlpha = 1; halo(ex, y, 26, 'rgb(255,110,50)', 0.4 * pul);
      } else {
        ctx.fillStyle = 'rgba(255,214,120,' + (0.5 + 0.45 * pul).toFixed(3) + ')'; const b = (hsh(i, 1015) * 512) | 0;
        for (let p = 0; p < 9; p++) if ((b >> p) & 1) P(-AP * 2 + (p % 3) * AP, ((p / 3) | 0) * AP, AP, AP);
        for (let t = 0; t < 8; t++) P(-AP * 8 + t * AP, Math.sin(t + i) * AP * 2 + AP * 6, AP, AP);
        halo(ex - dir * AP, y + AP, 14, 'rgb(255,214,120)', 0.45 * pul);
      }
    }
  }

  // ---- the order things are drawn in: far, middle, among the creatures, and in front of the haze ----
  function foFar(low) {
    let a;
    if ((a = foOn(3550, 3800, 4650, 4850)) > 0) foStars(a, low);
    if ((a = foOn(2700, 2850, 3650, 3850)) > 0 && !low) foCaustics(a);
    if ((a = foOn(4550, 4750, 5750, 5950)) > 0) foXtalFar(a);
    if ((a = foOn(5650, 5850, 6950, 7150)) > 0) foTempleWall(a, low);
    if ((a = foOn(6850, 7050, 8350, 8550)) > 0) foMushFar(a);
    if ((a = foOn(8250, 8450, 9950, 10150)) > 0 && !low) foMagmaFar(a);
    if ((a = foOn(9850, 10100, 13000, 13001)) > 0) foObscFar(a, low);
  }
  function foMid(low) {
    let a;
    if (camS < 1250) foBridges();
    if (camS > FLOOR - 120 && camS < 3000) foRootArches();
    if ((a = foOn(1850, 2050, 2750, 2950)) > 0) foSapDrops(a);
    if (near(3250, 260)) foEel();
    if ((a = foOn(4600, 4800, 5700, 5900)) > 0) foPrism(a);
    if (camS > 5800 && camS < 7100) foGuardians();
    if ((a = foOn(8300, 8500, 10000, 10200)) > 0) foLavaFalls(a);
    if ((a = foOn(9900, 10150, 13000, 13001)) > 0) foMonoliths(a, 0.75, 60, 0);
  }
  function foLife(low) {
    let a;
    if ((a = foOn(20, 80, 600, 900)) > 0) foMorphos(a, low);
    if (camS > 90 && camS < 760) foMonkeys();
    if ((a = foOn(650, 850, 1450, 1550)) > 0) foEyes(a);
    if (camS > 2650 && camS < 3900) foFish(low);
    if ((a = foOn(6900, 7100, 8300, 8500)) > 0) foPods(a, low);
  }
  function foFront(low) {
    let a;
    if ((a = foOn(-200, -100, 300, 700)) > 0) foPollen(a, low);
    if ((a = foOn(250, 700, 1600, 1900)) > 0) foFireflies(a, low);
    if ((a = foOn(1850, 2050, 2700, 2900)) > 0) foFireflies(a * 0.8, low, 1);
    if ((a = foOn(2750, 2900, 3650, 3850)) > 0) foBubbles(a);
    if ((a = foOn(3600, 3800, 4650, 4850)) > 0) foGlints(a, '#9ff6ff', low ? 6 : 14, 1111, 0.16);
    if ((a = foOn(4600, 4800, 5700, 5900)) > 0) foGlints(a, '#ead6ff', low ? 6 : 16, 1251, 0.7);
    if ((a = foOn(6900, 7100, 8300, 8500)) > 0) foSpores(a, low);
    if ((a = foOn(8300, 8500, 9950, 10150)) > 0) foEmbers(a, low);
    if ((a = foOn(9900, 10200, 13000, 13001)) > 0) foGold(a, low);
  }

  // ---- themed packs: the Geography pack turns the forest into an explorer's atlas, Sports into a floodlit stadium
  const confetti = []; let lastLineId = null;
  const COLOURS_SPORT = ['#ff4d4d', '#ffd23f', '#3bceac', '#4d8dff', '#ffffff', '#ff7ad9'];
  function themeBack(th) {
    if (th === 'geo') {
      // lines of latitude drifting up as you descend, each with its degree
      const step = 150, par = 0.55, off = mod(camS / mpp * par, step);
      ctx.font = Math.round(13 * AP / 3 + 5) + 'px VT323, monospace'; ctx.textBaseline = 'middle';
      for (let y = -off - step, i = 0; y < H + step; y += step, i++) {
        const lat = Math.round(60 - ((camS / mpp * par + y) / step) * 7.5), ly = sn(y);
        ctx.fillStyle = 'rgba(250,236,200,0.26)';
        for (let x = 0; x < W; x += AP * 4) ctx.fillRect(x, ly + Math.round(Math.sin(x / W * Math.PI) * 10), AP * 2, 1.5);
        ctx.fillStyle = 'rgba(250,236,200,0.55)';
        const t = Math.abs(lat) + '°' + (lat === 0 ? '' : lat > 0 ? 'N' : 'S');
        ctx.fillText(t, 12 + Math.max(26, Math.min(70, W * 0.06)), ly - 8); ctx.fillText(t, W - 70 - Math.max(26, Math.min(70, W * 0.06)), ly - 8);
      }
      // meridians bowing outwards like a globe
      ctx.strokeStyle = 'rgba(250,236,200,0.16)'; ctx.lineWidth = 1.5;
      for (let k = -3; k <= 3; k++) { if (!k) continue; ctx.beginPath(); for (let y = 0; y <= H; y += 24) { const x = W / 2 + k * W * 0.13 * (1 + 0.25 * Math.sin((y / H) * Math.PI)); y ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      // a flight route with a little plane, looping across the map
      for (let q = 0; q < 2; q++) {
        const u = mod(time * (0.035 + q * 0.012) + q * 0.5, 1), x0 = -40, x1 = W + 40, yb = H * (0.25 + q * 0.42), arc = H * 0.12;
        const px = x0 + (x1 - x0) * u, py = yb - Math.sin(u * Math.PI) * arc;
        ctx.fillStyle = 'rgba(255,240,200,0.35)';
        for (let s = 0; s < u; s += 0.012) { const sx = x0 + (x1 - x0) * s, sy2 = yb - Math.sin(s * Math.PI) * arc; ctx.fillRect(sn(sx), sn(sy2), 2, 2); }
        const ang = Math.atan2(-Math.cos(u * Math.PI) * arc * Math.PI, x1 - x0);
        ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.fillStyle = 'rgba(255,248,230,0.85)';
        ctx.fillRect(-7, -1.5, 14, 3); ctx.fillRect(-2, -7, 4, 14); ctx.fillRect(-7, -4, 3, 8); ctx.restore();
      }
    } else if (th === 'sports') {
      // mown pitch stripes far behind the forest
      const band = 70, off = mod(camS / mpp * 0.3, band * 2);
      for (let y = -off; y < H; y += band * 2) { ctx.fillStyle = 'rgba(160,255,160,0.035)'; ctx.fillRect(0, sn(y), W, band); }
      // a halfway line and centre circle that scroll past once
      const cy = yOf(600) * 0.4 + H * 0.3;
      if (cy > -200 && cy < H + 200) { ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = AP; ctx.beginPath(); ctx.arc(W / 2, cy, Math.min(W, H) * 0.18, 0, 6.283); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, sn(cy) - AP / 2, W, AP); }
      // camera flashes popping in the stands
      ctx.globalCompositeOperation = 'lighter';
      for (let q = 0; q < 14; q++) { const ph = mod(time * (0.5 + hsh(q, 71)) + hsh(q, 72) * 7, 1); if (ph > 0.06) continue; const a = (1 - ph / 0.06) * 0.8, x = hsh(q, 73 + Math.floor(time * (0.5 + hsh(q, 71)))) * W, y = H * (0.1 + 0.8 * hsh(q, 74 + Math.floor(time * 0.7))); halo(x, y, 18, '255,255,255', a * 0.5); ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')'; ctx.fillRect(sn(x) - 1, sn(y) - 1, 3, 3); }
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function themeFront(th, dt) {
    if (th === 'geo') {
    } else if (th === 'sports') {
      // confetti for a rare answer
      const L = window.__lines;
      if (L && L.id !== lastLineId) { lastLineId = L.id; if (L.tier >= 2 && !reduce) { const n = L.tier === 4 ? 240 : L.tier === 3 ? 150 : 80; for (let i = 0; i < n; i++) confetti.push({ x: W * (0.2 + 0.6 * R()), y: -10 - R() * H * 0.3, vx: D(-40, 40), vy: 60 + R() * 120, r: R() * 6.283, vr: D(-8, 8), c: COLOURS_SPORT[i % COLOURS_SPORT.length], life: 3 + R() * 2 }); } }
      for (let i = confetti.length - 1; i >= 0; i--) { const p = confetti[i]; p.life -= dt; p.x += (p.vx + Math.sin(time * 3 + i) * 30) * dt; p.y += p.vy * dt; p.r += p.vr * dt; if (p.life <= 0 || p.y > H + 20) { confetti.splice(i, 1); continue; } ctx.fillStyle = p.c; ctx.globalAlpha = Math.min(1, p.life); const w = 10 * Math.abs(Math.cos(p.r)) + 2; ctx.fillRect(sn(p.x - w / 2), sn(p.y - 3), w, 6); }
      ctx.globalAlpha = 1;
      // night under the lights
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ---- whole new worlds for the themed packs (they replace the forest entirely)
  const sheetCache = new Map(); let sheetW = 0;
  const PLACE = ['Terra Incognita', 'Mare Tenebrosum', 'Here be Dragons', 'The Unknown Sea', 'Isles of Mist', 'Cape Obscura', 'Mare Glaciale', 'The Far Reaches', 'Coast of Whispers', 'Sea of Serpents', 'The Lost Archipelago', 'Mare Incognitum', 'Bay of Storms', 'The Drowned Kingdom', 'Hic Sunt Leones', 'The Last Shore'];
  const SHEET = 1100;
  function mapSheet(k) {
    if (sheetW !== W) { sheetCache.clear(); sheetW = W; }
    if (sheetCache.has(k)) return sheetCache.get(k);
    const c = document.createElement('canvas'); c.width = W; c.height = SHEET; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    const cell = Math.max(6, AP * 3), ink = 'rgba(70,48,24,', sea = 'rgba(40,78,92,';
    // sea hatching: little waves all over the open water
    x.fillStyle = sea + '0.28)';
    for (let i = 0; i < 70; i++) { const wx = hsh(k * 131 + i, 601) * W, wy = hsh(k * 131 + i, 602) * SHEET; for (let s = 0; s < 3; s++) { x.fillRect(Math.round(wx + s * 9), Math.round(wy + (s % 2 ? -2 : 0)), 6, 2); } }
    // one or two landmasses, pixel-cut, with an inked coast
    const nLand = 1 + (hsh(k, 610) < 0.55 ? 1 : 0);
    for (let n = 0; n < nLand; n++) {
      const cx = W * (n ? 0.75 : 0.25) + (hsh(k * 7 + n, 611) - 0.5) * W * 0.35, cy = SHEET * (0.25 + 0.5 * hsh(k * 7 + n, 612)), R0 = Math.min(W * 0.28, 240) * (0.6 + 0.6 * hsh(k * 7 + n, 613));
      const p1 = hsh(k * 7 + n, 614) * 6.28, p2 = hsh(k * 7 + n, 615) * 6.28, p3 = hsh(k * 7 + n, 616) * 6.28;
      const rad = a => R0 * (1 + 0.32 * Math.sin(3 * a + p1) + 0.18 * Math.sin(5 * a + p2) + 0.09 * Math.sin(11 * a + p3));
      const inside = (px, py) => { const dx = px - cx, dy = (py - cy) * 1.15, d = Math.hypot(dx, dy); return d < rad(Math.atan2(dy, dx)); };
      for (let py = cy - R0 * 1.7; py < cy + R0 * 1.7; py += cell) for (let px = cx - R0 * 1.7; px < cx + R0 * 1.7; px += cell) {
        if (!inside(px, py)) continue;
        const edge = !inside(px - cell, py) || !inside(px + cell, py) || !inside(px, py - cell) || !inside(px, py + cell);
        x.fillStyle = edge ? ink + '0.85)' : (hsh(Math.round(px / cell) * 31 + Math.round(py / cell), 617 + k) < 0.08 ? 'rgba(150,120,70,0.55)' : 'rgba(201,172,112,0.75)');
        x.fillRect(Math.round(px), Math.round(py), cell, cell);
        // mountains and forests drawn on the land
        if (!edge && hsh(Math.round(px / cell) * 17 + Math.round(py / cell) * 3, 618 + k) < 0.035) { x.fillStyle = ink + '0.6)'; x.fillRect(Math.round(px) - 4, Math.round(py) + 4, 2, 2); x.fillRect(Math.round(px) - 2, Math.round(py) + 2, 2, 2); x.fillRect(Math.round(px), Math.round(py), 2, 2); x.fillRect(Math.round(px) + 2, Math.round(py) + 2, 2, 2); x.fillRect(Math.round(px) + 4, Math.round(py) + 4, 2, 2); }
      }
      // the coast ripples out into the sea
      x.strokeStyle = sea + '0.22)'; x.lineWidth = 1.5;
      for (const f of [1.12, 1.24]) { x.beginPath(); for (let a = 0; a <= 6.3; a += 0.08) { const r = rad(a) * f, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r / 1.15; a ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
      // a name for it
      x.fillStyle = ink + '0.8)'; x.font = Math.round(18 + 6 * hsh(k, 619 + n)) + 'px VT323, monospace'; x.textAlign = 'center';
      x.fillText(PLACE[Math.floor(hsh(k * 3 + n, 620) * PLACE.length)].toUpperCase().split('').join(' '), cx, cy + 6);
    }
    // rhumb lines from a wind rose somewhere on the sheet
    const rx = W * hsh(k, 630), ry = SHEET * hsh(k, 631); x.strokeStyle = ink + '0.12)'; x.lineWidth = 1;
    for (let a = 0; a < 16; a++) { x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx + Math.cos(a * Math.PI / 8) * W * 1.5, ry + Math.sin(a * Math.PI / 8) * W * 1.5); x.stroke(); }
    x.textAlign = 'left';
    sheetCache.set(k, c); if (sheetCache.size > 8) sheetCache.delete(sheetCache.keys().next().value);
    return c;
  }
  let paper = null;
  function paperPattern() {
    if (paper) return paper;
    const c = document.createElement('canvas'); c.width = c.height = 160; const x = c.getContext('2d');
    for (let i = 0; i < 900; i++) { x.fillStyle = 'rgba(90,60,25,' + (0.03 + 0.07 * Math.random()).toFixed(3) + ')'; x.fillRect(Math.random() * 160 | 0, Math.random() * 160 | 0, 1 + (Math.random() * 2 | 0), 1); }
    for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(120,80,30,0.05)'; x.beginPath(); x.arc(Math.random() * 160, Math.random() * 160, 8 + Math.random() * 20, 0, 6.283); x.fill(); }
    return (paper = ctx.createPattern(c, 'repeat'));
  }
  function atlasWorld(dt, sy) {
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const px = camS / mpp, age = Math.min(1, Math.max(0, camS) / 9000);
    // the parchment, browning with depth
    const top = [236, 219, 178], deep = [120, 92, 58], col = top.map((v, i) => Math.round(v + (deep[i] - v) * age));
    ctx.fillStyle = 'rgb(' + col.join(',') + ')'; ctx.fillRect(0, Math.max(0, sy), W, H);
    if (!window.__low) { ctx.save(); ctx.translate(0, -mod(px, 160)); ctx.fillStyle = paperPattern(); ctx.fillRect(0, Math.max(0, sy) + mod(px, 160), W, H + 160); ctx.restore(); }
    // map sheets
    const k0 = Math.floor((px - AY) / SHEET) - 1, k1 = Math.floor((px + H - AY) / SHEET) + 1;
    for (let k = Math.max(0, k0); k <= k1; k++) { const y = Math.round(AY + k * SHEET - px); if (y > H || y + SHEET < 0) continue; ctx.drawImage(mapSheet(k), 0, y); }
    // latitude lines and their degrees
    const step = 150; ctx.font = Math.round(13 * AP / 3 + 7) + 'px VT323, monospace'; ctx.textBaseline = 'middle';
    for (let m = Math.floor((px - AY) / step) * step; m < px - AY + H + step; m += step) {
      if (m < 0) continue; const y = Math.round(AY + m - px), lat = 80 - Math.round(m / step) * 5 % 170;
      ctx.fillStyle = 'rgba(70,48,24,0.16)'; for (let x = 0; x < W; x += 10) ctx.fillRect(x, y, 6, 1);
      ctx.fillStyle = 'rgba(70,48,24,0.5)'; const t = Math.abs(lat) + '°' + (lat === 0 ? '' : lat > 0 ? 'N' : 'S'); ctx.fillText(t, 34, y - 8); ctx.fillText(t, W - 84, y - 8);
    }
    // little ships sailing the chart, and the odd sea serpent
    for (let q = 0; q < 5; q++) {
      const m = (Math.floor(px / 900) + q - 1) * 900 + hsh(q + Math.floor(px / 900), 640) * 900, y = Math.round(AY + m - px); if (y < -40 || y > H + 40 || m < 60) continue;
      const dir = hsh(q + Math.floor(px / 900), 641) < 0.5 ? 1 : -1, xx = mod(hsh(q, 642) * W + dir * time * (10 + 8 * hsh(q, 643)), W + 80) - 40, bob = Math.round(Math.sin(time * 1.6 + q) * 2);
      ctx.fillStyle = 'rgba(70,48,24,0.85)';
      if (hsh(q + Math.floor(px / 900), 644) < 0.75) { ctx.fillRect(xx - 12, y + bob, 24, 4); ctx.fillRect(xx - 9, y + 4 + bob, 18, 3); ctx.fillRect(xx - 1, y - 18 + bob, 2, 18); ctx.fillStyle = 'rgba(245,232,200,0.95)'; ctx.fillRect(xx + 1, y - 16 + bob, 9 * dir > 0 ? 9 : 9, 12); ctx.fillStyle = '#a33a12'; ctx.fillRect(xx - 1, y - 21 + bob, 6, 3); }
      else { for (let s = 0; s < 4; s++) { const hx = xx + s * 12 * dir, hy = y + Math.round(Math.sin(time * 2 + s) * 3); ctx.fillRect(hx - 4, hy - 4, 8, 4); ctx.fillRect(hx - 2, hy - 7, 4, 3); } ctx.fillRect(xx - 10 * dir, y - 10, 5, 8); ctx.fillStyle = '#a33a12'; ctx.fillRect(xx - 10 * dir + (dir > 0 ? 0 : 3), y - 9, 2, 2); }
    }
    // above the map: the edge of the sheet lying on an explorer's desk, lit by a lamp
    if (sy > -80) {
      const g = ctx.createLinearGradient(0, 0, 0, Math.max(1, sy)); g.addColorStop(0, '#24170c'); g.addColorStop(1, '#3d2716'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, sy);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let y = 6; y < sy; y += 14) ctx.fillRect(0, y, W, 2);
      const lamp = ctx.createRadialGradient(W * 0.78, sy * 0.4, 0, W * 0.78, sy * 0.4, 260); lamp.addColorStop(0, 'rgba(255,214,140,0.22)'); lamp.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = lamp; ctx.fillRect(0, 0, W, sy + 200);
      ctx.fillStyle = '#6b4a22'; ctx.fillRect(0, sy - 6, W, 6); ctx.fillStyle = '#a07a3e'; ctx.fillRect(0, sy - 4, W, 2);
      ctx.fillStyle = 'rgba(70,48,24,0.8)'; ctx.fillRect(14, sy + 10, W - 28, 2); ctx.fillRect(20, sy + 16, W - 40, 1);
      ctx.fillStyle = 'rgba(70,48,24,0.85)'; ctx.font = Math.round(Math.min(30, W / 30)) + 'px VT323, monospace'; ctx.textAlign = 'center'; ctx.fillText(W < 600 ? 'ATLAS OF THE KNOWN WORLD' : '— A T L A S   O F   T H E   K N O W N   W O R L D —', W / 2, sy + 44); ctx.textAlign = 'left';
    }
    // edges of the sheet, darker as it ages
    // the map's double border runs the whole way down
    { const t0 = Math.max(0, sy + 10); ctx.fillStyle = 'rgba(70,48,24,0.8)'; ctx.fillRect(14, t0, 2, H); ctx.fillRect(W - 16, t0, 2, H); ctx.fillRect(20, t0 + 6, 1, H); ctx.fillRect(W - 21, t0 + 6, 1, H); }
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.72); vg.addColorStop(0, 'rgba(60,35,10,0)'); vg.addColorStop(1, 'rgba(60,35,10,' + (0.25 + 0.3 * age).toFixed(2) + ')'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
  // the stadium: tiers of stands, a crowd doing the wave, LED boards and the odd big screen
  const bandCache = new Map(); let bandW = 0;
  const BAND = 300, CROWD = 220, TEAM = [['#c8102e', '#ffffff'], ['#003da5', '#ffd23f'], ['#00843d', '#ffffff'], ['#6a0dad', '#ffb000'], ['#111111', '#ff4d4d'], ['#ff6a00', '#002b5c']], SKIN = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac', '#a0522d'];
  function crowdBand(k) {
    if (bandW !== W) { bandCache.clear(); bandW = W; }
    if (bandCache.has(k)) return bandCache.get(k);
    const c = document.createElement('canvas'); c.width = W; c.height = CROWD; const x = c.getContext('2d');
    x.fillStyle = '#141b26'; x.fillRect(0, 0, W, CROWD);
    const rowH = 11, seatW = 9;
    for (let r = 0; r * rowH < CROWD; r++) {
      x.fillStyle = 'rgba(255,255,255,0.04)'; x.fillRect(0, r * rowH + rowH - 2, W, 2);
      for (let s = 0; s * seatW < W; s++) {
        const sec = Math.floor(s * seatW / 180), team = TEAM[(sec + k) % TEAM.length], q = hsh(k * 977 + r * 131 + s, 700);
        const sx = s * seatW + (r % 2 ? 4 : 0), syy = r * rowH;
        x.fillStyle = team[0]; x.globalAlpha = 0.55; x.fillRect(sx + 1, syy + 5, seatW - 2, 5); x.globalAlpha = 1;
        if (q < 0.12) continue;
        x.fillStyle = hsh(s * 7 + r, 701 + k) < 0.7 ? team[0] : team[1]; x.fillRect(sx + 2, syy + 4, 5, 5);
        x.fillStyle = SKIN[Math.floor(hsh(s * 13 + r * 5, 702 + k) * SKIN.length)]; x.fillRect(sx + 3, syy, 3, 4);
        if (q > 0.93) { x.fillStyle = team[1]; x.fillRect(sx + 1, syy - 3, 2, 3); x.fillRect(sx + 6, syy - 3, 2, 3); }
      }
    }
    bandCache.set(k, c); if (bandCache.size > 8) bandCache.delete(bandCache.keys().next().value);
    return c;
  }
  const BOARD = ['OBSCURA', 'GO DEEPER', 'RARE ANSWERS SCORE MORE', 'NAME IT TO WIN IT', 'DIVE  DIVE  DIVE', 'THE CROWD GOES WILD', 'FIND THE OBSCURA', 'HALF TIME SOON'];
  // the Sports world: from the night sky over the city, through the roof and its floodlights, down the stands,
  // across the pitch and the players' tunnel, to a vault of golden trophies at the bottom
  const SP_COL = [[-400, [4, 6, 18]], [0, [6, 9, 28]], [800, [16, 24, 52]], [1000, [12, 15, 24]], [1300, [11, 15, 25]], [4300, [9, 12, 20]], [4400, [18, 58, 30]], [5300, [16, 50, 26]], [5340, [24, 24, 28]], [5700, [30, 32, 38]], [6300, [34, 26, 22]], [6880, [20, 20, 24]], [7080, [22, 14, 10]], [9300, [30, 20, 6]], [12000, [64, 42, 8]]];
  function spCol(m) { if (m <= SP_COL[0][0]) return SP_COL[0][1]; for (let i = 0; i < SP_COL.length - 1; i++) { const a = SP_COL[i], b = SP_COL[i + 1]; if (m <= b[0]) { const t = (m - a[0]) / Math.max(1, b[0] - a[0]); return a[1].map((v, k) => Math.round(v + (b[1][k] - v) * t)); } } return SP_COL[SP_COL.length - 1][1]; }
  // ---- little helpers for the Sports world: world-to-screen, easing, and art that is drawn once and kept
  const spY = m => AY + (m - camS) / mpp, spYP = (m, f) => AY + (m - camS) / mpp * f;
  const spCl = v => v < 0 ? 0 : v > 1 ? 1 : v, spIO = t => t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) * (2 - 2 * t) / 2;
  const spA = new Map(), spWC = new Map(); let spWK = '';
  function spArt(key, w, h, paint, sized) {
    let M = spA; if (sized) { const k2 = W + 'x' + H; if (spWK !== k2) { spWC.clear(); spWK = k2; } M = spWC; }
    let c = M.get(key); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false; paint(x, c.width, c.height, c); M.set(key, c); return c;
  }
  function spPix(key, rows, pal) { return spArt(key, rows[0].length, rows.length, x => { for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) { const c = pal[rows[j][i]]; if (c) { x.fillStyle = c; x.fillRect(i, j, 1, 1); } } }); }
  const spBlit = (c, x, y, s) => { s = s || AP; ctx.drawImage(c, Math.round(x), Math.round(y), c.width * s, c.height * s); };
  // a 3x5 pixel font for scoreboards, LED tickers and card mosaics (no web font needed, so it caches cleanly)
  const SP_F = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
    0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001110', '!': '010010010000010', '-': '000000111000000', ':': '000010000010000', "'": '010010000000000', '.': '000000000000010', '+': '000010111010000' };
  function spTxt(x, s, X, Y0, sc, col, dot) { x.fillStyle = col; const d = dot ? sc - Math.max(1, Math.round(sc / 4)) : sc; for (let n = 0; n < s.length; n++) { const g = SP_F[s[n]]; if (!g) continue; for (let b = 0; b < 15; b++) if (g.charCodeAt(b) === 49) x.fillRect(X + (n * 4 + b % 3) * sc, Y0 + ((b / 3) | 0) * sc, d, d); } }
  const spTW = (s, sc) => (s.length * 4 - 1) * sc;
  const spLed = (msg, col, sc) => spArt('L' + sc + col + msg, spTW(msg, sc) + sc, 5 * sc, x => spTxt(x, msg, 0, 0, sc, col, sc >= 3));
  // an LED ticker: a cached strip of dot-matrix text scrolled through a window
  function spTicker(msg, col, x0, y0, w, h, speed, off) {
    const sc = Math.max(2, Math.floor((h - 6) / 5)), s = spLed(msg + '   +   ', col, sc), uw = s.width, ty = Math.round(y0 + (h - 5 * sc) / 2);
    for (let x = x0 - mod(time * speed + off, uw); x < x0 + w; x += uw) { const a = Math.max(x, x0), b = Math.min(x + uw, x0 + w); if (b > a) ctx.drawImage(s, a - x, 0, b - a, s.height, a, ty, b - a, s.height); }
  }
  const spSign = (msg, sc, fg, bg) => spArt('S' + sc + fg + msg, spTW(msg, sc) + sc * 6, sc * 11, (x, w, h) => { x.fillStyle = fg; x.fillRect(0, 0, w, h); x.fillStyle = bg; x.fillRect(sc, sc, w - 2 * sc, h - 2 * sc); spTxt(x, msg, sc * 3, sc * 3, sc, fg); });
  // a side-on figure (feet at x,y) and a top-down player, both made of a handful of rectangles
  function spFig(x, y, u, shirt, shorts, skin, ph, pose, dir) {
    x = Math.round(x); y = Math.round(y); const a = pose === 1 ? Math.sin(ph) : 0, j = pose === 2;
    ctx.fillStyle = shorts;
    if (j) { ctx.fillRect(x - 2 * u, y - 4 * u, u, 3 * u); ctx.fillRect(x + u, y - 4 * u, u, 2 * u); }
    else { ctx.fillRect(x - u + Math.round(a * 1.5 * u), y - 4 * u, u, 4 * u); ctx.fillRect(x - Math.round(a * 1.5 * u), y - 4 * u, u, 4 * u); }
    ctx.fillStyle = shirt; ctx.fillRect(x - 2 * u, y - 9 * u, 3 * u, 5 * u);
    ctx.fillStyle = skin; ctx.fillRect(x - u - (dir < 0 ? u : 0), y - 12 * u, 3 * u, 3 * u);
    if (j) { ctx.fillRect(x - 3 * u, y - 14 * u, u, 5 * u); ctx.fillRect(x + u, y - 14 * u, u, 5 * u); }
    else ctx.fillRect(x - u - Math.round(a * u * (dir || 1)), y - 9 * u, u, 4 * u);
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(x - u - (dir < 0 ? u : 0), y - 12 * u, 3 * u, u);
  }
  function spTop(x, y, u, shirt, trim, shorts, skin, ph, mv) {
    x = Math.round(x); y = Math.round(y); const l = mv ? (Math.sin(ph) > 0 ? u : -u) : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(x - u, y + u, 5 * u, 2 * u); ctx.fillRect(x - 4 * u, y + u, 5 * u, 2 * u);
    ctx.fillStyle = '#e8e8e8'; ctx.fillRect(x - 2 * u, y + 2 * u + l, u, 2 * u); ctx.fillRect(x + u, y + 2 * u - l, u, 2 * u);
    ctx.fillStyle = shorts; ctx.fillRect(x - 2 * u, y + u, 4 * u, 2 * u);
    ctx.fillStyle = shirt; ctx.fillRect(x - 3 * u, y - 3 * u, 6 * u, 4 * u);
    ctx.fillStyle = trim; ctx.fillRect(x - 3 * u, y - 3 * u, u, 2 * u); ctx.fillRect(x + 2 * u, y - 3 * u, u, 2 * u);
    ctx.fillStyle = skin; ctx.fillRect(x - u, y - 5 * u, 2 * u, 2 * u); ctx.fillStyle = '#2a1a10'; ctx.fillRect(x - u, y - 5 * u, 2 * u, u);
  }
  // a pool of world-anchored particles (confetti and sparks), allocated once and recycled
  const SP_PP = []; let spPI = 0; for (let i = 0; i < 380; i++) SP_PP.push({ l: 0, L: 1, x: 0, m: 0, vx: 0, vy: 0, c: '#fff', k: 0, r: 0 });
  function spEmit(x, m, vx, vy, life, c, k) { const p = SP_PP[spPI]; spPI = (spPI + 1) % SP_PP.length; p.x = x; p.m = m; p.vx = vx; p.vy = vy; p.l = p.L = life; p.c = c; p.k = k; p.r = Math.random() * 6.28; }
  function spBurst(x, m, n, c) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, s = 60 + Math.random() * 160; spEmit(x, m, Math.cos(a) * s, Math.sin(a) * s - 40, 1 + Math.random() * 0.8, c, 1); } }

  // ---- the sky over the city
  let spSky = null, spSkyW = 0;
  function skylineLayer(f) { // 0 middle, 1 near, 2 far
    if (spSkyW !== W) { spSky = {}; spSkyW = W; }
    if (spSky[f]) return spSky[f];
    const c = document.createElement('canvas'); c.width = W; c.height = 360; const x = c.getContext('2d'), bea = [];
    const base = ['#141a2e', '#0a0e1a', '#1a2142'][f], hm = [0.7, 1, 0.5][f], wa = [0.55, 0.9, 0.3][f];
    for (let b = 0, px2 = 0; px2 < W; b++) {
      const bw = 30 + hsh(b, 910 + f * 10) * 70, bh = (80 + hsh(b, 911 + f * 10) * 260) * hm; x.fillStyle = base; x.fillRect(px2, 360 - bh, bw, bh);
      if (hsh(b, 912 + f) < 0.3) { x.fillRect(px2 + bw / 2 - 1, 360 - bh - 30, 2, 30); if (bea.length < 10) bea.push([px2 + bw / 2, 360 - bh - 30]); }
      else if (hsh(b, 915 + f) < 0.3) x.fillRect(px2 + 6, 360 - bh - 8, bw - 12, 8);
      for (let wy = 360 - bh + 8; wy < 356; wy += 10) for (let wx = px2 + 5; wx < px2 + bw - 6; wx += 8) if (hsh(wx * 13 + wy, 913 + f) < 0.45) { x.fillStyle = ['#ffd27a', '#ffe9b0', '#9fd6ff'][Math.floor(hsh(wx + wy * 7, 914) * 3)]; x.globalAlpha = wa; x.fillRect(wx, wy, 3, 4); x.globalAlpha = 1; }
      px2 += bw + 2;
    }
    c.bea = bea; c.base = base; return (spSky[f] = c);
  }
  const spMoon = () => spArt('moon', 16, 16, x => { for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const dx = i - 7.5, dy = j - 7.5, d = Math.hypot(dx, dy); if (d > 7.6) continue; let c = d > 6.6 || dx > 3.5 ? '#b9c2d6' : '#e6ebf5'; if (Math.hypot(i - 5, j - 6) < 1.8 || Math.hypot(i - 9, j - 10) < 1.5 || Math.hypot(i - 10, j - 4) < 1) c = '#a3adc4'; x.fillStyle = c; x.fillRect(i, j, 1, 1); } });
  const spBlimp = () => spArt('blimp', 48, 19, x => {
    for (let j = 0; j < 15; j++) for (let i = 0; i < 48; i++) { const dx = (i - 25) / 22, dy = (j - 7) / 7, d = dx * dx + dy * dy; if (d > 1) continue; x.fillStyle = d > 0.82 ? '#6f7688' : dy < -0.4 ? '#e4e8f0' : dy < 0.35 ? '#c3c9d6' : '#9aa1b2'; x.fillRect(i, j, 1, 1); }
    x.fillStyle = '#8a91a3'; x.fillRect(0, 1, 6, 4); x.fillRect(0, 10, 6, 4); x.fillRect(1, 5, 4, 5);
    x.fillStyle = '#4c5366'; x.fillRect(21, 14, 10, 4); x.fillStyle = '#ffd98a'; for (let i = 22; i < 30; i += 2) x.fillRect(i, 15, 1, 1);
    x.fillStyle = '#0b0f18'; x.fillRect(10, 3, 30, 8);
  });
  // drone-show shapes: polylines sampled into N evenly spaced points, so any two shapes morph point for point
  let spDS = null, spDN = 0;
  function spDrone(N) {
    if (spDS && spDN === N) return spDS;
    const T = Math.PI * 2, arc = (cx, cy, r, a0, a1, n, ry) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * (ry == null ? r : ry)]); } return p; };
    const star = (n, r, r2) => { const p = []; for (let i = 0; i <= n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r2 : r; p.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return p; };
    const pent = star(5, 0.4, 0.4), spokes = [0, 2, 4, 6, 8].map(i => [pent[i], [pent[i][0] * 2.5, pent[i][1] * 2.5]]);
    const S = [
      [arc(0, 0, 1, 0, T, 48), pent, ...spokes],
      [[[-0.62, -0.9], [0.62, -0.9]], arc(0, -0.9, 0.62, Math.PI, 0, 20, 0.8), arc(-0.62, -0.62, 0.26, -Math.PI / 2, -Math.PI * 1.5, 8), arc(0.62, -0.62, 0.26, -Math.PI / 2, Math.PI / 2, 8), [[0, -0.1], [0, 0.45]], [[-0.42, 0.45], [0.42, 0.45], [0.42, 0.68], [-0.42, 0.68], [-0.42, 0.45]], [[-0.62, 0.86], [0.62, 0.86]]],
      [star(5, 1, 0.42)],
      [arc(0, 0, 1, 0, T, 40), [[0, -1], [0, 1]], [[-1, 0], [1, 0]], arc(-1.45, 0, 1.05, -0.75, 0.75, 10), arc(1.45, 0, 1.05, Math.PI - 0.75, Math.PI + 0.75, 10)],
      [arc(0, -0.35, 0.5, 0, T, 30, 0.62), [[-0.25, -0.88], [-0.25, 0.18]], [[0, -0.97], [0, 0.27]], [[0.25, -0.88], [0.25, 0.18]], [[-0.46, -0.6], [0.46, -0.6]], [[-0.5, -0.35], [0.5, -0.35]], [[-0.46, -0.1], [0.46, -0.1]], [[-0.25, 0.2], [0, 0.45], [0.25, 0.2]], [[0, 0.45], [0, 1]]],
    ];
    spDS = S.map(lines => {
      const segs = []; let L = 0; for (const pl of lines) for (let i = 0; i < pl.length - 1; i++) { const a = pl[i], b = pl[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, l]); L += l; }
      const out = new Float32Array(N * 2); let si = 0, acc = 0;
      for (let n = 0; n < N; n++) { const d = (n + 0.5) / N * L; while (si < segs.length - 1 && acc + segs[si][2] < d) { acc += segs[si][2]; si++; } const s = segs[si], t = Math.min(1, (d - acc) / (s[2] || 1)); out[n * 2] = s[0][0] + (s[1][0] - s[0][0]) * t; out[n * 2 + 1] = s[0][1] + (s[1][1] - s[0][1]) * t; }
      return out;
    });
    spDN = N; return spDS;
  }
  const SP_DC = ['255,255,255', '255,210,90', '255,90,90', '255,150,50', '120,255,170'];
  function spSkyDraw(skyA, low) {
    // the moon and the stars
    const mx = W * 0.82, my = spYP(-250, 0.12);
    if (my > -60 && my < H + 60) { halo(mx, my, 60, '200,215,255', 0.4 * skyA); ctx.globalAlpha = skyA; spBlit(spMoon(), mx - 8 * AP, my - 8 * AP); ctx.globalAlpha = 1; }
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < (low ? 50 : 90); i++) { const y = mod(hsh(i, 920) * H * 1.5 - camS / mpp * 0.1, H * 1.5) - H * 0.2, tw = 0.4 + 0.6 * Math.abs(Math.sin(time * (0.6 + hsh(i, 921)) + i)); ctx.globalAlpha = 0.6 * tw * skyA; ctx.fillRect(sn(hsh(i, 922) * W), sn(y), 2, 2); if (i < 6 && tw > 0.9) { ctx.fillRect(sn(hsh(i, 922) * W) - 3, sn(y), 8, 1); ctx.fillRect(sn(hsh(i, 922) * W), sn(y) - 3, 1, 8); } }
    ctx.globalAlpha = 1;
    // searchlights sweeping up from the stadium
    ctx.globalCompositeOperation = 'lighter';
    { const by = spYP(905, 0.6), L = Math.max(H * 1.4, by + H * 0.3);
      for (let i = 0; i < 4; i++) { const bx = W * (0.12 + i * 0.25), a = -Math.PI / 2 + Math.sin(time * (0.23 + i * 0.05) + i * 1.9) * 0.5, ex = bx + Math.cos(a) * L, ey = by + Math.sin(a) * L, wv = 0.06 * L, nx = -Math.sin(a), ny = Math.cos(a);
        const g = ctx.createLinearGradient(bx, by, ex, ey); g.addColorStop(0, 'rgba(200,220,255,' + (0.16 * skyA).toFixed(3) + ')'); g.addColorStop(1, 'rgba(200,220,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx - nx * 5, by - ny * 5); ctx.lineTo(bx + nx * 5, by + ny * 5); ctx.lineTo(ex + nx * wv, ey + ny * wv); ctx.lineTo(ex - nx * wv, ey - ny * wv); ctx.fill(); } }
    // a drone light show drawing balls, trophies, stars and rackets over the city
    { const N = low ? 56 : 110, S = spDrone(N), cyc = time / 6.5, i0 = Math.floor(cyc), si = i0 % S.length, sj = (i0 + 1) % S.length, m = spIO(spCl((cyc - i0 - 0.6) / 0.4)), R0 = Math.min(W, H) * 0.26, cx = W * 0.5, cy = spYP(-80, 0.32);
      if (cy > -R0 * 1.3 && cy < H + R0 * 1.3) {
        const A = S[si], B = S[sj], ca = SP_DC[si].split(',').map(Number), cb = SP_DC[sj].split(',').map(Number), hc = m < 0.5 ? SP_DC[si] : SP_DC[sj], swirl = Math.sin(m * Math.PI);
        ctx.fillStyle = 'rgb(' + Math.round(ca[0] + (cb[0] - ca[0]) * m) + ',' + Math.round(ca[1] + (cb[1] - ca[1]) * m) + ',' + Math.round(ca[2] + (cb[2] - ca[2]) * m) + ')';
        for (let n = 0; n < N; n++) { const ox = A[n * 2] + (B[n * 2] - A[n * 2]) * m, oy = A[n * 2 + 1] + (B[n * 2 + 1] - A[n * 2 + 1]) * m, x = cx + (ox - oy * swirl * 0.4) * R0 + Math.sin(time * 1.7 + n) * 1.5, y = cy + (oy + ox * swirl * 0.4) * R0 + Math.cos(time * 1.3 + n * 2) * 1.5;
          ctx.globalAlpha = skyA; ctx.fillRect(sn(x) - 1, sn(y) - 1, 3, 3); if (!low && (n & 1) === 0) halo(x, y, 8, hc, 0.55 * skyA); }
        ctx.globalAlpha = 1;
      } }
    // fireworks: rockets, bursts and crackling trails
    for (let i = 0; i < (low ? 3 : 6); i++) { const P = 3.2 + i * 0.4, t = mod(time + i * 1.1, P) / P, cx = W * (0.12 + 0.76 * hsh(Math.floor((time + i * 1.1) / P) * 7 + i, 923)), top = spYP(-40 + i * 85, 0.3), c = ['255,77,77', '255,210,63', '94,224,255', '255,122,217', '140,255,140', '255,255,255'][i];
      if (top < -200 || top > H + 200) continue;
      if (t < 0.25) { ctx.fillStyle = 'rgba(' + c + ',0.9)'; ctx.fillRect(sn(cx), sn(top + (1 - t / 0.25) * 260), 2, 6); ctx.fillStyle = 'rgba(255,200,120,0.4)'; ctx.fillRect(sn(cx), sn(top + (1 - t / 0.25) * 260) + 6, 2, 14); }
      else { const u = (t - 0.25) / 0.75, rr = 20 + u * 110, al = (1 - u) * skyA; halo(cx, top, rr * 0.6, c, 0.3 * al); ctx.fillStyle = 'rgba(' + c + ',' + al.toFixed(2) + ')';
        for (let s = 0; s < 28; s++) { const a = s / 28 * 6.283, ca = Math.cos(a), sa = Math.sin(a); ctx.fillRect(sn(cx + ca * rr), sn(top + sa * rr + u * u * 40), 3, 3); ctx.fillRect(sn(cx + ca * rr * 0.8), sn(top + sa * rr * 0.8 + u * u * 32), 2, 2); if (!low && u > 0.5 && hsh(s + i * 31, Math.floor(time * 12)) < 0.3) ctx.fillRect(sn(cx + ca * rr * 0.65), sn(top + sa * rr * 0.65 + u * u * 26), 1, 1); } } }
    ctx.globalCompositeOperation = 'source-over';
    // an airliner blinking high above
    { const px2 = mod(time * 22, W + 240) - 120, py2 = spYP(-330, 0.1); if (py2 > -10 && py2 < H) { ctx.fillStyle = 'rgba(150,160,180,' + (0.8 * skyA).toFixed(2) + ')'; ctx.fillRect(sn(px2) - 7, sn(py2), 14, 2); ctx.fillRect(sn(px2) - 2, sn(py2) - 3, 4, 8); if (Math.sin(time * 6) > 0.6) halo(px2 + 7, py2, 6, '255,60,60', 0.9 * skyA); if (Math.sin(time * 6 + 2) > 0.8) halo(px2 - 7, py2, 6, '255,255,255', 0.9 * skyA); } }
    // the blimp, with its own scrolling message board and a searchlight on the crowd
    { const im = spBlimp(), bx = mod(W * 0.2 + time * 14, W + 300) - 150, by = spYP(260, 0.4), x0 = bx - 24 * AP, y0 = by - 7 * AP;
      if (by > -80 && by < H + 200) {
        ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y0 + 18 * AP, 0, y0 + 18 * AP + 300); g.addColorStop(0, 'rgba(255,240,200,' + (0.14 * skyA).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 + 24 * AP, y0 + 18 * AP); ctx.lineTo(x0 + 28 * AP, y0 + 18 * AP); ctx.lineTo(x0 + 26 * AP + 70 + Math.sin(time * 0.7) * 40, y0 + 18 * AP + 300); ctx.lineTo(x0 + 26 * AP - 70 + Math.sin(time * 0.7) * 40, y0 + 18 * AP + 300); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
        spBlit(im, x0, y0); spTicker('OBSCURA  GO DEEPER  RARE ANSWERS SCORE MORE', '#ff5a5a', x0 + 10 * AP, y0 + 3 * AP, 30 * AP, 8 * AP, 34, 0);
        if (Math.sin(time * 4) > 0) halo(x0 + 47 * AP, y0 + 7 * AP, 7, '255,60,60', 0.9); else halo(x0, y0 + 3 * AP, 7, '80,255,120', 0.9);
      } }
    // three layers of skyline, each sliding past at its own pace, with blinking roof beacons
    for (const [f, base, par] of [[2, 600, 0.3], [0, 720, 0.45], [1, 840, 0.7]]) {
      const im = skylineLayer(f), y = Math.round(spYP(base, par) - 360); if (y > H) continue;
      ctx.globalAlpha = skyA; ctx.drawImage(im, 0, y); ctx.fillStyle = im.base; ctx.fillRect(0, y + 360, W, Math.max(0, H - y - 360)); ctx.globalAlpha = 1;
      if (f !== 2) for (let b = 0; b < im.bea.length; b++) { const p = im.bea[b]; if (Math.sin(time * 2 + b * 1.7) > 0.4 && y + p[1] > -10 && y + p[1] < H) { ctx.fillStyle = '#ff3b3b'; ctx.fillRect(Math.round(p[0]) - 1, y + p[1] - 2, 3, 3); halo(p[0], y + p[1], 8, '255,60,60', 0.8 * skyA); } }
    }
    const gy = spYP(900, 0.8); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(W / 2, gy, 10, W / 2, gy, W * 0.6); gl.addColorStop(0, 'rgba(220,235,255,' + (0.45 * skyA).toFixed(2) + ')'); gl.addColorStop(1, 'rgba(220,235,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
  }

  // ---- outside the ground: the stadium's lit facade, fans at the barriers, and the team bus pulling up
  const spFacade = fh => spArt('fac' + fh, W, fh, x => {
    x.fillStyle = '#161c2b'; x.fillRect(0, 0, W, fh); const ah = fh * 0.62, aw = 46;
    for (let gx = 30, i = 0; gx < W; gx += 110, i++) {
      x.fillStyle = '#1f2739'; x.fillRect(gx - 8, 0, 8, fh);
      const ax = gx + 24, ay = fh - ah, g = x.createLinearGradient(0, ay, 0, fh); g.addColorStop(0, '#ffe2a0'); g.addColorStop(1, '#ff8a3d');
      x.fillStyle = g; x.beginPath(); x.moveTo(ax, fh); x.lineTo(ax, ay + aw / 2); x.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0); x.lineTo(ax + aw, fh); x.fill();
      x.fillStyle = '#2a1608'; for (let s = 0; s < 4; s++) { const hx = ax + 5 + s * 10 + hsh(i * 4 + s, 1210) * 4, hh = 10 + hsh(i * 4 + s, 1211) * 6; x.fillRect(hx, fh - hh, 5, hh); x.fillRect(hx + 1, fh - hh - 4, 3, 4); }
      x.fillStyle = 'rgba(160,210,255,0.5)'; for (let wy = Math.round(fh * 0.16); wy < ay - 6; wy += 12) { x.fillRect(gx + 4, wy, 6, 6); x.fillRect(gx + 88, wy, 6, 6); }
    }
    x.fillStyle = '#0d111c'; x.fillRect(0, fh - 4, W, 4);
  }, true);
  const spFans = () => spArt('fans', W, 14, x => { for (let i = 0; i * 5 < W; i++) { const t = TEAM[Math.floor(hsh(i, 1220) * TEAM.length)]; x.fillStyle = t[hsh(i, 1221) < 0.7 ? 0 : 1]; x.fillRect(i * 5, 6, 4, 8); x.fillStyle = SKIN[Math.floor(hsh(i, 1222) * SKIN.length)]; x.fillRect(i * 5 + 1, 2, 3, 4); } }, true);
  const spBus = ti => spArt('bus' + ti, 46, 17, x => {
    const t = TEAM[ti]; x.fillStyle = t[0]; x.fillRect(1, 1, 44, 12); x.fillRect(0, 2, 46, 10);
    x.fillStyle = '#16202e'; x.fillRect(3, 2, 33, 4); x.fillStyle = '#2a3a50'; x.fillRect(41, 2, 4, 6);
    for (let i = 4; i < 35; i += 3) { x.fillStyle = hsh(i, 1230 + ti) < 0.6 ? '#ffd98a' : '#3b4a60'; x.fillRect(i, 2, 2, 2); x.fillStyle = '#0b0f16'; if (hsh(i, 1231 + ti) < 0.5) x.fillRect(i, 4, 2, 2); }
    x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(37, 3, 3, 10);
    spTxt(x, 'OBSCURA', 6, 7, 1, t[1]); x.fillStyle = t[1]; x.fillRect(0, 12, 46, 1);
    for (const wx of [6, 33]) { x.fillStyle = '#0b0b0b'; x.fillRect(wx, 12, 6, 5); x.fillStyle = '#9aa1ae'; x.fillRect(wx + 2, 14, 2, 2); }
    x.fillStyle = '#fff6c0'; x.fillRect(45, 9, 1, 2); x.fillStyle = '#ff3030'; x.fillRect(0, 9, 1, 2);
  });
  const SP_CAR = ['#3b4a6b', '#6b2b2b', '#2b5b4b', '#5a5a66', '#7a6a2a'];
  function spStreet(low) {
    const fT = spY(855), pT = spY(905), rT = spY(917), rB = spY(941), gB = spY(951);
    if (gB < -10 || fT > H + 60) return;
    const fh = Math.max(20, Math.round(pT - fT)); ctx.drawImage(spFacade(fh), 0, Math.round(fT));
    // a crown of LEDs chasing round the bowl, and flags along the rim
    const ch = Math.max(4, Math.round(fh * 0.1)), ci = Math.floor(time * 10);
    for (let x = 0, i = 0; x < W; x += 12, i++) { ctx.fillStyle = COLOURS_SPORT[((i >> 2) + ci) % COLOURS_SPORT.length]; ctx.fillRect(x, Math.round(fT), 10, ch); }
    for (let fx2 = 60, i = 0; fx2 < W; fx2 += 140, i++) { const t = TEAM[i % TEAM.length], py = Math.round(fT); ctx.fillStyle = '#8b97a8'; ctx.fillRect(fx2, py - 34, 2, 34); for (let s = 0; s < 8; s++) { const o = Math.round(Math.sin(time * 5 - s * 0.8 + i) * s * 0.35); ctx.fillStyle = t[0]; ctx.fillRect(fx2 + 2 + s * 3, py - 34 + o, 3, 8); ctx.fillStyle = t[1]; ctx.fillRect(fx2 + 2 + s * 3, py - 26 + o, 3, 8); } }
    for (let gx = 30; gx < W; gx += 110) halo(gx + 47, pT - 14, 30, '255,190,110', 0.5);
    // the plaza with its fans jumping behind the barriers
    ctx.fillStyle = '#232835'; ctx.fillRect(0, Math.round(pT), W, Math.ceil(rT - pT));
    const fans = spFans(), cw = Math.ceil(W / 8); for (let c = 0; c < 8; c++) { const j = reduce ? 0 : Math.max(0, Math.sin(time * 7 + c * 1.3)) * 3; ctx.drawImage(fans, c * cw, 0, cw, 14, c * cw, Math.round(rT - 18 - j), cw, 14); }
    ctx.fillStyle = '#9aa4b4'; ctx.fillRect(0, Math.round(rT - 8), W, 2); for (let x = 4; x < W; x += 24) ctx.fillRect(x, Math.round(rT - 8), 2, 8);
    // the road, the lamps and the traffic
    ctx.fillStyle = '#101218'; ctx.fillRect(0, Math.round(rT), W, Math.ceil(rB - rT));
    const my = Math.round((rT + rB) / 2); ctx.fillStyle = '#c9c27a'; for (let x = 0; x < W; x += 40) ctx.fillRect(x, my, 20, 2);
    ctx.fillStyle = '#2b303b'; ctx.fillRect(0, Math.round(rB), W, Math.ceil(gB - rB) + 2);
    ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(0, rT - 36, 0, rB); lg.addColorStop(0, 'rgba(255,214,140,0.22)'); lg.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = lg;
    for (let lx = 80; lx < W; lx += 200) { ctx.beginPath(); ctx.moveTo(lx + 8, rT - 36); ctx.lineTo(lx + 16, rT - 36); ctx.lineTo(lx + 50, rB); ctx.lineTo(lx - 26, rB); ctx.fill(); }
    ctx.globalCompositeOperation = 'source-over';
    for (let lx = 80; lx < W; lx += 200) { ctx.fillStyle = '#3a4252'; ctx.fillRect(lx, Math.round(rT - 40), 3, 40); ctx.fillRect(lx, Math.round(rT - 40), 16, 3); ctx.fillStyle = '#fff1c4'; ctx.fillRect(lx + 10, Math.round(rT - 37), 6, 2); halo(lx + 13, rT - 34, 20, '255,214,140', 0.6); }
    for (let i = 0; i < (low ? 5 : 10); i++) { const dir = i % 2 ? 1 : -1, sp = 90 + hsh(i, 1201) * 60, q = mod(hsh(i, 1202) * (W + 200) + time * sp, W + 200), x = dir > 0 ? q - 100 : W + 100 - q, y = Math.round(rT + (rB - rT) * (dir > 0 ? 0.72 : 0.3));
      ctx.fillStyle = SP_CAR[i % 5]; ctx.fillRect(Math.round(x) - 12, y - 4, 24, 8); ctx.fillStyle = '#0a0c10'; ctx.fillRect(Math.round(x) - 4 + dir * 2, y - 4, 8, 3);
      ctx.fillStyle = '#fff6d0'; ctx.fillRect(Math.round(x + dir * 12) - 1, y - 1, 2, 3); ctx.fillStyle = '#ff3030'; ctx.fillRect(Math.round(x - dir * 12) - 1, y - 1, 2, 3);
      if (!low) { halo(x + dir * 16, y, 10, '255,240,200', 0.45); halo(x - dir * 13, y, 6, '255,50,50', 0.5); } }
    // the team bus: escorted in by police bikes, players file into the ground, then it pulls away
    const P = 26, cyc = Math.floor(time / P), t = time - cyc * P, ti = cyc % TEAM.length, gx = W * 0.62;
    let bx = null; if (t < 7) bx = -160 + (gx + 160) * (1 - Math.pow(1 - t / 7, 3)); else if (t < 15) bx = gx; else if (t < 20) bx = gx + Math.pow((t - 15) / 5, 2) * (W + 220 - gx);
    if (bx !== null) {
      const bus = spBus(ti), bw = bus.width * AP, bh = bus.height * AP, by = Math.round(rB - bh + AP);
      spBlit(bus, bx - bw / 2, by); halo(bx + bw / 2 + 4, by + 10 * AP, 16, '255,240,200', 0.7);
      if (t < 7 || t >= 15) for (let b = 0; b < 2; b++) { const px3 = bx + bw / 2 + 40 + b * 46; ctx.fillStyle = '#e8ecf2'; ctx.fillRect(Math.round(px3) - 8, by + bh - 14, 16, 8); ctx.fillStyle = '#111'; ctx.fillRect(Math.round(px3) - 9, by + bh - 6, 5, 5); ctx.fillRect(Math.round(px3) + 4, by + bh - 6, 5, 5); halo(px3 - 3, by + bh - 18, 9, Math.sin(time * 18 + b) > 0 ? '80,140,255' : '255,60,60', 0.95); }
      if (t >= 8 && t < 15) { for (let j = 0; j < 7; j++) { const u = (t - 8 - j * 0.75) / 1.6; if (u < 0 || u > 1) continue; const dx = bx + bw / 2 - 5 * AP, px3 = dx + (gx + 70 - dx) * u * 0.4, py3 = by + bh - 4 - (by + bh - 4 - (pT + 4)) * u; spFig(px3, py3, 2, TEAM[ti][0], '#1b1f2a', SKIN[(j * 3) % SKIN.length], time * 12, 1, 1); }
        if (!reduce) for (let q = 0; q < 3; q++) { const ph = mod(time * 1.7 + q * 0.37, 1); if (ph < 0.08) { const fx3 = bx - 90 + hsh(q + Math.floor(time * 1.7) * 3, 1203) * 200, fy3 = rT - 16; halo(fx3, fy3, 14, '255,255,255', 0.9 * (1 - ph / 0.08)); } } }
    }
  }

  // ---- the roof: trusses, a catwalk, the spidercam, banks of floodlights, a curtain of sparks
  function spRoof(low, dim) {
    const top = spY(950), bot = spY(1300); if (bot < -60 || top > H + 20) return;
    const t0 = Math.max(top, -4), t1 = Math.min(bot, H + 4);
    if (t1 > t0) {
      ctx.fillStyle = '#121824'; ctx.fillRect(0, t0, W, t1 - t0);
      ctx.save(); ctx.beginPath(); ctx.rect(0, t0, W, t1 - t0); ctx.clip();
      // a far lattice that drifts past slower than you
      const b0 = top * 0.7, s0 = b0 + 80 * Math.floor((t0 - b0) / 80) - 80; ctx.strokeStyle = '#1b2433'; ctx.lineWidth = 2; ctx.beginPath();
      for (let y = s0; y < t1 + 80; y += 80) { ctx.moveTo(0, y); ctx.lineTo(W, y); for (let x = 0; x < W; x += 80) { ctx.moveTo(x, y); ctx.lineTo(x + 80, y + 80); ctx.moveTo(x + 80, y); ctx.lineTo(x, y + 80); } }
      ctx.stroke();
      // the near girders: chords and zig-zag webbing
      const hh = bot - top, ch = [top + 6, top + hh * 0.36, top + hh * 0.7]; ctx.strokeStyle = '#2c3646'; ctx.lineWidth = 3; ctx.beginPath();
      for (let b = 0; b < 2; b++) { const ya = ch[b], yb = ch[b + 1]; if (yb < -10 || ya > H + 10) continue; for (let x = -60; x < W + 60; x += 120) { ctx.moveTo(x, ya); ctx.lineTo(x + 60, yb); ctx.lineTo(x + 120, ya); } }
      ctx.stroke(); ctx.fillStyle = '#2c3646'; for (const c of ch) ctx.fillRect(0, Math.round(c) - 4, W, 8);
      ctx.restore();
      // giant flags hanging from the girders, swaying in the draught
      const fh = Math.round(Math.min(170, hh * 0.28)), fy0 = Math.round(ch[1]) + 4;
      if (fy0 < H && fy0 + fh > 0) for (let i = 0; i < 5; i++) { const t = TEAM[(i + 1) % TEAM.length], fx = Math.round(W * (0.1 + i * 0.2)); ctx.fillStyle = '#8b97a8'; ctx.fillRect(fx - 26, fy0 - 2, 52, 3);
        for (let s = 0; s < 10; s++) { const o = Math.round(Math.sin(time * 1.4 + i * 1.3 - s * 0.35) * 4 * s / 10), y = fy0 + Math.round(s * fh / 10), hgt = Math.ceil(fh / 10) + 1; ctx.fillStyle = t[0]; ctx.fillRect(fx - 24 + o, y, 16, hgt); ctx.fillStyle = t[1]; ctx.fillRect(fx - 8 + o, y, 16, hgt); ctx.fillStyle = t[0]; ctx.fillRect(fx + 8 + o, y, 16, hgt); }
        const o = Math.round(Math.sin(time * 1.4 + i * 1.3 - 3.5) * 4); ctx.fillStyle = t[1]; ctx.fillRect(fx - 4 + o, fy0 + Math.round(fh * 0.35), 8, 8); }
      // a row of follow-spots on the middle chord, and speaker clusters on the lower one
      const my = Math.round(ch[1]); if (my > -30 && my < H + 30) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, my, 0, my + 420); g.addColorStop(0, 'rgba(255,240,210,' + (0.12 * (1 - 0.7 * dim)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = g;
        for (let x = 45, i = 0; x < W; x += 90, i++) { const sw = Math.sin(time * 0.6 + i * 0.9) * 60; ctx.beginPath(); ctx.moveTo(x - 4, my + 6); ctx.lineTo(x + 4, my + 6); ctx.lineTo(x + sw + 30, my + 420); ctx.lineTo(x + sw - 30, my + 420); ctx.fill(); }
        ctx.globalCompositeOperation = 'source-over'; for (let x = 45; x < W; x += 90) { ctx.fillStyle = '#0b0f16'; ctx.fillRect(x - 6, my + 2, 12, 8); ctx.fillStyle = '#fff4dc'; ctx.fillRect(x - 3, my + 8, 6, 2); halo(x, my + 9, 14, '255,240,210', 0.7 * (1 - 0.6 * dim)); } }
      const sy3 = Math.round(ch[2]); if (sy3 > -40 && sy3 < H + 40) for (let x = 150; x < W; x += 300) { ctx.fillStyle = '#0b0f16'; ctx.fillRect(x - 14, sy3 + 4, 28, 34); ctx.fillStyle = '#1b2230'; for (let r = 0; r < 3; r++) ctx.fillRect(x - 10, sy3 + 8 + r * 10, 20, 7); ctx.fillStyle = '#3a4252'; ctx.fillRect(x - 1, sy3, 2, 4); }
      // the catwalk, with a rigger walking it
      const cy = Math.round(spY(1050)); if (cy > -30 && cy < H + 30) { ctx.fillStyle = '#39434f'; ctx.fillRect(0, cy, W, 5); ctx.fillRect(0, cy - 16, W, 2); for (let x = 0; x < W; x += 24) ctx.fillRect(x, cy - 16, 2, 16); const rx = W * 0.5 + Math.sin(time * 0.15) * W * 0.4, dir = Math.cos(time * 0.15) > 0 ? 1 : -1; spFig(rx, cy, 2, '#ff7a1a', '#2a2f3a', '#e0ac69', time * 7, 1, dir); ctx.fillStyle = '#ffd23f'; ctx.fillRect(Math.round(rx) - 3, cy - 25, 6, 2); halo(rx + dir * 4, cy - 22, 7, '255,250,220', 0.8); }
      // the spidercam on its four cables
      const sx = W / 2 + Math.sin(time * 0.31) * W * 0.32, syy = spY(1160) + Math.sin(time * 0.47) * 40;
      if (syy > -40 && syy < H + 40) { ctx.strokeStyle = 'rgba(180,190,210,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, top + 10); ctx.lineTo(sx, syy); ctx.lineTo(W, top + 10); ctx.moveTo(0, bot - 40); ctx.lineTo(sx, syy); ctx.lineTo(W, bot - 40); ctx.stroke(); ctx.fillStyle = '#2d3440'; ctx.fillRect(Math.round(sx) - 10, Math.round(syy) - 6, 20, 12); ctx.fillStyle = '#0b0b0b'; ctx.fillRect(Math.round(sx) - 4, Math.round(syy) + 6, 8, 6); ctx.fillStyle = '#8fd6ff'; ctx.fillRect(Math.round(sx) - 1, Math.round(syy) + 8, 2, 2); if (Math.sin(time * 4) > 0) halo(sx + 8, syy - 4, 6, '255,60,60', 0.9); }
    }
    // floodlight banks: steady most of the time, then a chase light show; they dim when the phones come out
    const ly = Math.round(bot - 26);
    if (ly > -40 && ly < H + 40) {
      const nb = Math.max(3, Math.round(W / 210)), show = mod(time, 22) < 5, chase = Math.floor(time * 7) % nb;
      ctx.globalCompositeOperation = 'lighter'; const cone = ctx.createLinearGradient(0, ly, 0, ly + H); cone.addColorStop(0, 'rgba(235,242,255,0.16)'); cone.addColorStop(1, 'rgba(235,242,255,0)'); ctx.fillStyle = cone;
      const bb = []; for (let i = 0; i < nb; i++) { const b = (show ? (i === chase || i === (chase + (nb >> 1)) % nb ? 1 : 0.2) : 0.9 + 0.1 * Math.sin(time * 7 + i)) * (1 - 0.75 * dim); bb.push(b); const bx = (i + 0.5) * W / nb; ctx.globalAlpha = b; ctx.beginPath(); ctx.moveTo(bx - 40, ly); ctx.lineTo(bx + 40, ly); ctx.lineTo(bx + 170, ly + H); ctx.lineTo(bx - 170, ly + H); ctx.fill(); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      let best = -1, bd = 1e9;
      for (let i = 0; i < nb; i++) { const bx = Math.round((i + 0.5) * W / nb), b = bb[i]; ctx.fillStyle = '#0b0f16'; ctx.fillRect(bx - 48, ly - 14, 96, 26); ctx.fillStyle = '#f6f9ff'; ctx.globalAlpha = 0.25 + 0.75 * b; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) ctx.fillRect(bx - 44 + c * 22, ly - 11 + r * 11, 18, 8); ctx.globalAlpha = 1; halo(bx, ly, 44, '240,246,255', 0.85 * b); if (Math.abs(bx - W / 2) < bd && b > 0.5) { bd = Math.abs(bx - W / 2); best = i; } }
      // a lens flare from the light nearest the middle: an anamorphic streak and a string of ghosts
      if (best >= 0 && !low) { const fx0 = (best + 0.5) * W / nb, b = bb[best]; ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createLinearGradient(fx0 - W * 0.45, 0, fx0 + W * 0.45, 0); sg.addColorStop(0, 'rgba(120,170,255,0)'); sg.addColorStop(0.5, 'rgba(170,205,255,' + (0.5 * b).toFixed(2) + ')'); sg.addColorStop(1, 'rgba(120,170,255,0)'); ctx.fillStyle = sg; ctx.fillRect(fx0 - W * 0.45, ly - 1, W * 0.9, 3);
        const dx = W / 2 - fx0, dy = H * 0.55 - ly;
        for (const [k, r, c] of [[0.5, 16, '120,255,200'], [1.2, 34, '255,170,90'], [1.6, 12, '170,150,255'], [2.1, 52, '90,160,255']]) { const gx = fx0 + dx * k, gy = ly + dy * k; ctx.fillStyle = 'rgba(' + c + ',' + (0.07 * b).toFixed(3) + ')'; ctx.beginPath(); for (let s = 0; s <= 6; s++) { const a = s / 6 * 6.283 + 0.3; s ? ctx.lineTo(gx + Math.cos(a) * r, gy + Math.sin(a) * r) : ctx.moveTo(gx + Math.cos(a) * r, gy + Math.sin(a) * r); } ctx.fill(); }
        ctx.globalCompositeOperation = 'source-over'; }
    }
    // the upper-tier fascia below the roof, with a ribbon board running all the way round
    const fy = Math.round(bot); if (fy > -40 && fy < H) { ctx.fillStyle = '#0b0f18'; ctx.fillRect(0, fy, W, 36); ctx.fillStyle = '#05070b'; ctx.fillRect(0, fy + 6, W, 24); spTicker('WELCOME TO THE OBSCURA STADIUM  MIND THE GAP  ENJOY THE MATCH', '#ffd23f', 0, fy + 6, W, 24, 55, 0); }
    // a curtain of sparks pouring off the roof edge
    const gOn = mod(time, 18);
    if (!reduce && gOn < 9 && fy > -40 && fy < H + 10) { const fade = Math.min(1, gOn / 0.5, (9 - gOn) / 0.8), gy = fy + 32; ctx.fillStyle = '#ffe6a8';
      for (let gx = 20, i = 0; gx < W; gx += low ? 64 : 34, i++) { halo(gx, gy, 10, '255,220,140', 0.8 * fade); for (let s = 0; s < 5; s++) { const u = mod(time * (0.9 + hsh(i * 5 + s, 1301) * 0.5) + hsh(i * 5 + s, 1302), 1), y = gy + u * u * H * 0.34, x = gx + (hsh(i * 5 + s, 1303) - 0.5) * 14 * u; ctx.globalAlpha = fade * (1 - u); ctx.fillRect(sn(x), sn(y), 2, 3 + (s & 1) * 3); } }
      ctx.globalAlpha = 1; }
  }

  // ---- the stands
  const SP_FROG = [['...GG......GG...', '..GWWG....GWWG..', '..GWKG....GWKG..', '..GGGGGGGGGGGG..', '.GGGGGGGGGGGGGG.', '.GgGGGGGGGGGGgG.', '.GGddddddddddGG.', '..GGGGGGGGGGGG..', '...JJJJJJJJJJ...', '.JJJjjjjjjjjJJJ.', '.G.JJJJjjJJJJ.G.', '.G.JJJJjjJJJJ.G.', '...JJJJJJJJJJ...', '...SSSSSSSSSS...', '...SSSS..SSSS...', '...GGG....GGG...', '..GGGG....GGGG..'],
    ['G..GG......GG..G', 'G.GWWG....GWWG.G', 'G.GWKG....GWKG.G', 'G.GGGGGGGGGGGG.G', '.GGGGGGGGGGGGGG.', '.GgGGGGGGGGGGgG.', '.GGddddddddddGG.', '..GGGGGGGGGGGG..', '.JJJJJJJJJJJJJJ.', '..JJjjjjjjjjJJ..', '...JJJJjjJJJJ...', '...JJJJjjJJJJ...', '...JJJJJJJJJJ...', '...SSSSSSSSSS...', '...SSSS..SSSS...', '...GGG....GGG...', '..GGGG....GGGG..']];
  const spBeach = () => spPix('beach', ['..rrww..', '.rrrwwy.', 'rrrwwyyy', 'rrwwwyyy', 'bbwwwggg', 'bbbwwgg.', '.bbbwgg.', '..bbgg..'], { r: '#ff4d4d', w: '#ffffff', y: '#ffd23f', b: '#4d8dff', g: '#3bceac' });
  const spHeart = () => spPix('heart', ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'], { r: '#ff5c9a' });
  // card-mosaic designs: painted at one pixel per card, then laid out card by card
  function spMosaicArt(d) {
    return spArt('mos' + d, W, CROWD, x => {
      const cols = Math.ceil(W / 9), rows = 20, lo = document.createElement('canvas'); lo.width = cols; lo.height = rows; const g = lo.getContext('2d'), cx = cols / 2, cy = rows / 2, big = cols >= 80 ? 2 : 1;
      const word = (s, fg) => { const sc = spTW(s, 2) <= cols - 4 ? big : 1, tx = Math.round(cx - spTW(s, sc) / 2), ty = Math.round(cy - 5 * sc / 2); spTxt(g, s, tx + 1, ty + 1, sc, '#000000'); spTxt(g, s, tx, ty, sc, fg); };
      if (d === 0) { g.fillStyle = '#1d3f8f'; g.fillRect(0, 0, cols, rows); g.fillStyle = '#2f6bd8'; for (let i = 0; i < 16; i += 2) { const a0 = i / 16 * 6.283, a1 = (i + 1) / 16 * 6.283; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a0) * 200, cy + Math.sin(a0) * 200); g.lineTo(cx + Math.cos(a1) * 200, cy + Math.sin(a1) * 200); g.fill(); }
        g.fillStyle = '#ffd23f'; g.fillRect(0, 0, cols, 1); g.fillRect(0, rows - 1, cols, 1); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(cx, cy, 8, 0, 6.283); g.fill(); g.fillStyle = '#111111'; g.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 1.2566; i ? g.lineTo(cx + Math.cos(a) * 3, cy + Math.sin(a) * 3) : g.moveTo(cx + Math.cos(a) * 3, cy + Math.sin(a) * 3); } g.fill(); for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * 1.2566; g.fillRect(Math.round(cx + Math.cos(a) * 6.5) - 1, Math.round(cy + Math.sin(a) * 6.5) - 1, 2, 2); } }
      else if (d === 1) { g.fillStyle = '#c8102e'; g.fillRect(0, 0, cols, rows); g.fillStyle = '#003da5'; g.beginPath(); g.moveTo(cols * 0.62, 0); g.lineTo(cols, 0); g.lineTo(cols, rows); g.lineTo(cols * 0.38, rows); g.fill(); word('OBSCURA', '#ffffff'); }
      else if (d === 2) { g.fillStyle = '#3a1a6a'; g.fillRect(0, 0, cols, rows); g.fillStyle = '#ffd23f'; for (let i = 0; i < cols / 4; i++) g.fillRect(Math.floor(hsh(i, 1285) * cols), Math.floor(hsh(i, 1286) * rows), 1, 1); g.fillStyle = '#ff8a2a'; g.beginPath(); g.arc(cx, cy, 8.5, 0, 6.283); g.fill(); g.fillStyle = '#1a0a04'; g.fillRect(Math.floor(cx), cy - 8, 1, 17); g.fillRect(cx - 8, Math.floor(cy), 17, 1); g.strokeStyle = '#1a0a04'; g.lineWidth = 1; g.beginPath(); g.arc(cx - 12, cy, 8.5, -0.8, 0.8); g.stroke(); g.beginPath(); g.arc(cx + 12, cy, 8.5, Math.PI - 0.8, Math.PI + 0.8); g.stroke(); }
      else { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { g.fillStyle = ((r >> 1) + (c >> 1)) % 2 ? '#f2f2f2' : '#141414'; g.fillRect(c, r, 1, 1); } const s = 'GO DEEPER', sc = spTW(s, 2) <= cols - 4 ? big : 1, w = spTW(s, sc); g.fillStyle = '#c8102e'; g.fillRect(Math.round(cx - w / 2) - 2, Math.round(cy - 5 * sc / 2) - 2, w + 4, 5 * sc + 4); word(s, '#ffffff'); }
      const p = g.getImageData(0, 0, cols, rows).data; x.fillStyle = '#141b26'; x.fillRect(0, 0, W, CROWD);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = (r * cols + c) * 4; x.fillStyle = 'rgb(' + p[i] + ',' + p[i + 1] + ',' + p[i + 2] + ')'; x.fillRect(c * 9, r * 11, 8, 10); }
      x.fillStyle = 'rgba(0,0,0,0.14)'; for (let r = 0; r < rows; r++) x.fillRect(0, r * 11 + 6, W, 4);
      for (let i = 0; i < cols * 0.6; i++) { const c = Math.floor(hsh(i, 1287 + d) * cols), r = Math.floor(hsh(i, 1288 + d) * rows); x.fillStyle = '#141b26'; x.fillRect(c * 9, r * 11, 8, 10); x.fillStyle = SKIN[i % SKIN.length]; x.fillRect(c * 9 + 2, r * 11 + 1, 4, 4); }
    }, true);
  }
  function spMosaic(k, y) {
    const tt = time / 8 + k * 0.37, i0 = Math.floor(tt), ph = tt - i0, A = spMosaicArt((i0 + k) % 4), B = spMosaicArt((i0 + k + 1) % 4), f = spCl((ph - 0.8) / 0.18);
    if (f <= 0 || f >= 1) ctx.drawImage(f >= 1 ? B : A, 0, y);
    else { const front = f * (W + 160) - 80; ctx.fillStyle = '#141b26'; ctx.fillRect(0, y, W, CROWD);
      for (let x = 0; x < W; x += 18) { const d = (x - front) / 80, sc = Math.min(1, Math.abs(d)), hh = Math.max(2, Math.round(CROWD * sc)), yy = y + Math.round((CROWD - hh) / 2); ctx.drawImage(d > 0 ? A : B, x, 0, 18, CROWD, x, yy, 18, hh); if (sc < 0.5) { ctx.fillStyle = 'rgba(255,255,255,' + (0.5 * (1 - sc * 2)).toFixed(2) + ')'; ctx.fillRect(x, yy, 18, hh); } } }
    const st = Math.floor(time * 4); ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let i = 0; i < 12; i++) if (hsh(i + st * 12, 1290 + k) > 0.5) ctx.fillRect(Math.floor(hsh(i, st + k) * W / 9) * 9, y + Math.floor(hsh(i, 1291 + st) * 20) * 11, 8, 10);
  }
  function spCrowd(k, y, ty, low, dim) {
    const band = crowdBand(k), sl = 24, wavePos = mod(time * 0.28 + k * 0.13, 1.4) - 0.2;
    for (let x = 0; x < W; x += sl) { const d = x / W - wavePos, up = reduce ? 0 : Math.max(0, 1 - Math.abs(d) * 9), jig = reduce ? 0 : Math.sin(time * 8 + x * 0.3 + k) * 0.6; ctx.drawImage(band, x, 0, sl, CROWD, x, Math.round(y - up * 9 + jig), sl, CROWD); if (up > 0.3) { ctx.fillStyle = 'rgba(255,255,255,' + (0.06 * up).toFixed(3) + ')'; ctx.fillRect(x, y - 9, sl, CROWD); } }
    if (dim > 0) { ctx.fillStyle = 'rgba(2,4,12,' + (0.6 * dim).toFixed(3) + ')'; ctx.fillRect(0, y - 10, W, CROWD + 10); }
    // phone torches: a few always, a whole galaxy of them when the floodlights go down
    const nt = Math.round((low ? 12 : 22) + dim * (low ? 24 : 70)); ctx.fillStyle = '#fffff0';
    for (let i = 0; i < nt; i++) { const tw = Math.max(0, Math.sin(time * (1.5 + hsh(i, 930 + k)) + i * 2.3)), v = Math.max(tw, dim * (0.6 + 0.4 * Math.sin(time * 3 + i))); if (v < 0.4) continue; const x = hsh(i, 931 + k) * W, yy = y + hsh(i, 932 + k) * CROWD; if (i < 22 && !low) halo(x, yy, 7, '255,255,240', 0.5 * v); ctx.globalAlpha = Math.min(1, v); ctx.fillRect(sn(x), sn(yy), 2, 3); }
    ctx.globalAlpha = 1;
    // camera flashes popping all over the stand
    if (!reduce) for (let i = 0; i < 4; i++) { const P = 1.3 + hsh(i, 1240 + k) * 2.2, tt = (time + hsh(i, 1241 + k) * 9) / P, cyc = Math.floor(tt), ph = tt - cyc; if (ph > 0.07) continue; const a = 1 - ph / 0.07, x = hsh(cyc * 3 + i, 1242 + k) * W, yy = y + 10 + hsh(cyc * 3 + i, 1243 + k) * (CROWD - 20); halo(x, yy, 16, '255,255,255', 0.8 * a); ctx.fillStyle = '#ffffff'; ctx.fillRect(sn(x) - 1, sn(yy) - 1, 3, 3); ctx.globalAlpha = a; ctx.fillRect(sn(x) - 6, sn(yy), 13, 1); ctx.fillRect(sn(x), sn(yy) - 6, 1, 13); ctx.globalAlpha = 1; }
    if (ty === 1) spFlags(k, y); else if (ty === 3) spMascots(k, y); else if (ty === 4) spBigFlag(k, y); else if (ty === 6) spBalls(k, y); else spCapo(k, y);
  }
  function spFlags(k, y) {
    for (let i = 0; i < 4; i++) { const t = TEAM[(k + i) % TEAM.length], fx2 = Math.round(W * (0.12 + i * 0.25) + Math.sin(time * 0.7 + i) * 10), fy = Math.round(y + 30 + hsh(i, 1250 + k) * 60), sw = Math.sin(time * 2.2 + i) * 0.5;
      ctx.fillStyle = '#c9ced8'; ctx.fillRect(fx2, fy, 2, 70);
      for (let s = 0; s < 12; s++) { const o = Math.round(Math.sin(time * 6 - s * 0.7 + i) * s * 0.4 + sw * s), xx = fx2 + 2 + s * 5; ctx.fillStyle = t[0]; ctx.fillRect(xx, fy + o, 5, 17); ctx.fillStyle = t[1]; ctx.fillRect(xx, fy + 17 + o, 5, 17); if (s % 3 === 1) { ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(xx, fy + o, 5, 34); } } }
    // a smoke flare
    const t2 = TEAM[k % TEAM.length], fx2 = W * (0.15 + 0.7 * hsh(k, 933)), fy2 = y + CROWD * 0.5; halo(fx2, fy2, 26, '255,90,60', 0.7); ctx.fillStyle = '#fff2c0'; ctx.fillRect(Math.round(fx2) - 2, Math.round(fy2) - 3, 4, 6);
    for (let p2 = 0; p2 < 16; p2++) { const u = mod(time * 0.35 + p2 / 16, 1); ctx.fillStyle = t2[0] === '#111111' ? 'rgba(200,200,210,' + (0.35 * (1 - u)).toFixed(2) + ')' : t2[0] + Math.round(90 * (1 - u)).toString(16).padStart(2, '0'); ctx.beginPath(); ctx.arc(fx2 + Math.sin(u * 5 + p2) * 20 * u + u * 40, fy2 - u * 180, 10 + u * 34, 0, 6.283); ctx.fill(); }
  }
  function spMascots(k, y) {
    const t = TEAM[k % TEAM.length], fr = reduce ? 0 : Math.floor(time * 3) % 2, mx = W * 0.5 + Math.sin(time * 0.4 + k) * W * 0.35, base = y + CROWD - 2;
    const im = spPix('frog' + fr + (k % TEAM.length), SP_FROG[fr], { G: '#5fbf4a', g: '#8fe070', W: '#ffffff', K: '#111111', d: '#2f6a25', J: t[0], j: t[1], S: '#1b1f2a' });
    spBlit(im, mx - im.width * AP / 2, base - im.height * AP - (reduce ? 0 : Math.abs(Math.sin(time * 6)) * 6));
    for (let i = 0; i < 6; i++) { const cx = mx + (i < 3 ? -1 : 1) * (64 + (i % 3) * 26), jy = reduce ? 0 : Math.max(0, Math.sin(time * 6 + i * 0.9)) * 12, fy = Math.round(base - jy), up = jy > 4;
      ctx.fillStyle = '#f1c27d'; ctx.fillRect(Math.round(cx) - 3, fy - 8, 2, 8); ctx.fillRect(Math.round(cx) + 1, fy - 8, 2, 8); ctx.fillStyle = t[1]; ctx.fillRect(Math.round(cx) - 5, fy - 13, 10, 5); ctx.fillStyle = t[0]; ctx.fillRect(Math.round(cx) - 3, fy - 21, 7, 8); ctx.fillStyle = SKIN[i % SKIN.length]; ctx.fillRect(Math.round(cx) - 2, fy - 26, 5, 5);
      ctx.fillStyle = '#ffd23f'; ctx.fillRect(Math.round(cx) - 8, fy - (up ? 32 : 20), 5, 5); ctx.fillRect(Math.round(cx) + 4, fy - (up ? 32 : 20), 5, 5); }
  }
  function spBigFlag(k, y) {
    const t = TEAM[(k + 2) % TEAM.length], fw = Math.min(W * 0.5, 420), fh2 = Math.round(CROWD * 0.6), x0 = W - mod(time * 30 + k * 300, W + fw), n = 24, sw = fw / n;
    for (let s = 0; s < n; s++) { const xx = Math.round(x0 + s * sw), o = Math.round(Math.sin(time * 3 + s * 0.5) * 8 + Math.sin(time * 1.3 + s * 0.2) * 5), yy = y + 30 + o, w = Math.ceil(sw) + 1, h3 = Math.round(fh2 / 3);
      ctx.fillStyle = t[0]; ctx.fillRect(xx, yy, w, h3); ctx.fillStyle = t[1]; ctx.fillRect(xx, yy + h3, w, h3); ctx.fillStyle = t[0]; ctx.fillRect(xx, yy + h3 * 2, w, h3);
      const sh = Math.cos(time * 3 + s * 0.5); ctx.fillStyle = sh > 0 ? 'rgba(255,255,255,' + (0.12 * sh).toFixed(2) + ')' : 'rgba(0,0,0,' + (-0.25 * sh).toFixed(2) + ')'; ctx.fillRect(xx, yy, w, h3 * 3); }
  }
  function spBalls(k, y) {
    for (let i = 0; i < 3; i++) { const sp = 50 + hsh(i, 1260 + k) * 40, x = mod(hsh(i, 1261 + k) * W + time * sp * (i % 2 ? 1 : -1), W + 60) - 30, h = Math.abs(Math.sin(time * 2.6 + i * 2)) * 60, yy = y + 80 - h + i * 34; spBlit(spBeach(), x - 4 * AP, yy - 4 * AP); }
    const cx = W * (0.2 + 0.6 * hsh(k, 1262)), ry = y + CROWD - 2, cyc = mod(time + k, 4) / 4, side = k % 2 ? 1 : -1;
    spFig(cx, ry, 2, '#ffd23f', '#1b1f2a', '#c68642', 0, 0, side); ctx.fillStyle = '#5a6578'; ctx.fillRect(Math.round(cx) + (side > 0 ? 0 : -14), ry - 22, 14, 5);
    if (cyc < 0.6) { const u = cyc / 0.6, sx = cx + side * (14 + u * W * 0.22), sy = ry - 22 - Math.sin(u * Math.PI) * 150 - u * 40, t = TEAM[k % TEAM.length]; ctx.fillStyle = t[0]; ctx.fillRect(Math.round(sx) - 5, Math.round(sy) - 4, 10, 9); ctx.fillRect(Math.round(sx) - 8, Math.round(sy) - 4, 16, 3); if (u < 0.08) halo(cx + side * 16, ry - 20, 12, '255,240,200', 0.8); }
  }
  function spCapo(k, y) {
    const x = Math.round(W * (0.15 + 0.7 * hsh(k, 1270))), py = y + CROWD - 2, beat = Math.pow(Math.max(0, Math.sin(time * 9.4)), 12);
    ctx.fillStyle = '#2a313d'; ctx.fillRect(x - 20, py - 8, 40, 8); spFig(x - 6, py - 8, 2, TEAM[k % TEAM.length][0], '#1b1f2a', SKIN[k % SKIN.length], 0, beat > 0.3 ? 2 : 0, 1);
    ctx.fillStyle = '#d9d2c3'; ctx.fillRect(x + 4, py - 22, 12, 12); ctx.fillStyle = '#c8102e'; ctx.fillRect(x + 4, py - 22, 12, 2); ctx.fillRect(x + 4, py - 12, 12, 2); if (beat > 0.1) halo(x + 10, py - 18, 16, '255,220,160', 0.7 * beat);
  }
  const spBoxArt = () => spArt('boxes', W, CROWD, x => {
    x.fillStyle = '#0b0f18'; x.fillRect(0, 0, W, CROWD); x.fillStyle = '#1b2230'; x.fillRect(0, 0, W, 16); x.fillRect(0, CROWD - 40, W, 40);
    const bw = 150; for (let i = 0, bx = 10; bx < W; i++, bx += bw) {
      const g = x.createLinearGradient(0, 30, 0, CROWD - 46); g.addColorStop(0, '#4a3420'); g.addColorStop(1, '#1d140c'); x.fillStyle = g; x.fillRect(bx + 6, 30, bw - 12, CROWD - 76);
      x.fillStyle = '#ffd9a0'; x.fillRect(bx + 12, 32, bw - 24, 2);
      const n = 2 + Math.floor(hsh(i, 1280) * 3); x.fillStyle = '#0a0705'; for (let p = 0; p < n; p++) { const hx = Math.round(bx + 30 + p * (bw - 60) / Math.max(1, n - 1)); x.fillRect(hx - 5, 96, 10, 11); x.fillRect(hx - 9, 107, 18, CROWD - 153); if (i % 4 === 2) { x.fillStyle = '#3a3a3a'; x.fillRect(hx - 7, 94, 14, 2); x.fillRect(hx + 5, 98, 3, 6); x.fillStyle = '#0a0705'; } }
      x.fillStyle = 'rgba(255,255,255,0.06)'; for (let r = 0; r < 3; r++) { x.beginPath(); x.moveTo(bx + 30 + r * 40, 30); x.lineTo(bx + 46 + r * 40, 30); x.lineTo(bx + r * 40 - 10, CROWD - 46); x.lineTo(bx + r * 40 - 26, CROWD - 46); x.fill(); }
      x.fillStyle = '#2a3140'; x.fillRect(bx, 24, 6, CROWD - 64);
      if (i % 4 === 2) spTxt(x, 'PRESS', Math.round(bx + bw / 2 - spTW('PRESS', 2) / 2), 20, 2, '#ffffff');
    }
    x.fillStyle = '#5a6578'; x.fillRect(0, CROWD - 46, W, 3);
  }, true);
  function spBoxes(k, y) {
    ctx.drawImage(spBoxArt(), 0, y);
    for (let bx = 10 + 2 * 150; bx < W; bx += 600) { const on = Math.sin(time * 3) > -0.3; ctx.fillStyle = on ? '#ff2a2a' : '#4a1010'; ctx.fillRect(bx + 52, y + 4, 46, 10); if (on) halo(bx + 75, y + 9, 18, '255,60,60', 0.7); }
    const cx = Math.round(W * 0.72), cy = y + CROWD - 46, pan = Math.sin(time * 0.6) * 6; ctx.fillStyle = '#3a4252'; ctx.fillRect(cx - 1, cy - 20, 2, 20); ctx.fillStyle = '#1b1f2a'; ctx.fillRect(cx - 12, cy - 32, 22, 12); ctx.fillRect(Math.round(cx - 12 - 10 + pan), cy - 30, 10, 7); if (Math.sin(time * 2) > -0.5) halo(cx + 8, cy - 30, 6, '255,60,60', 0.9);
    spFig(cx + 18, cy, 2, '#2b303b', '#1b1f2a', '#8d5524', 0, 0, -1);
    if (!reduce && mod(time + k, 2.3) < 0.08) halo(W * hsh(Math.floor(time / 2.3), 1281 + k), y + 110, 26, '255,255,255', 0.6);
  }
  // the big screen: live score, replays from other sports, the kiss cam, the noise meter
  let spScan = null;
  function spScreen(k, y) {
    const fx0 = Math.round(W * (W < 600 ? 0.03 : 0.12)), fw2 = W - fx0 * 2, sx0 = fx0 + 12, sy0 = y + 30, sw = fw2 - 24, sh = BAND - 60, cx = sx0 + sw / 2, cy = sy0 + sh / 2;
    ctx.fillStyle = '#05070b'; ctx.fillRect(fx0, y + 10, fw2, BAND - 20);
    const ci = Math.floor(time * 10); ctx.fillStyle = '#ffd23f';
    for (let x = fx0 + 6, i = 0; x < fx0 + fw2 - 6; x += 14, i++) { ctx.globalAlpha = (i + ci) % 3 ? 0.25 : 1; ctx.fillRect(x, y + 16, 6, 6); ctx.fillRect(x, y + BAND - 22, 6, 6); }
    ctx.globalAlpha = 1;
    ctx.save(); ctx.beginPath(); ctx.rect(sx0, sy0, sw, sh); ctx.clip(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const sc = (Math.floor(time / 6) + k) % 8, lt = mod(time, 6), font = f => Math.round(f) + 'px VT323, monospace';
    if (sc === 0) { // live score from the match on the pitch below
      ctx.fillStyle = '#7a0f20'; ctx.fillRect(sx0, sy0, sw / 2, sh); ctx.fillStyle = '#0a2f7a'; ctx.fillRect(cx, sy0, sw / 2, sh);
      ctx.fillStyle = '#ffffff'; ctx.font = font(sh * 0.42); ctx.fillText(SPM.sc[0] + ' - ' + SPM.sc[1], cx, cy + sh * 0.04); ctx.font = font(sh * 0.14); ctx.fillText('REDS', sx0 + sw * 0.2, sy0 + sh * 0.2); ctx.fillText('BLUES', sx0 + sw * 0.8, sy0 + sh * 0.2);
      ctx.fillStyle = '#ffd23f'; ctx.fillText(SPM.ph === 1 ? 'HALF TIME' : SPM.ph === 3 ? 'FULL TIME' : Math.floor(SPM.clk) + "'", cx, sy0 + sh * 0.84);
      if (Math.sin(time * 5) > 0) { ctx.fillStyle = '#ff3030'; ctx.fillRect(sx0 + 14, sy0 + 14, 10, 10); } ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.font = font(20); ctx.fillText('LIVE', sx0 + 30, sy0 + 20);
    } else if (sc === 1) { // GOAL!
      const st = reduce ? 0 : Math.floor(time * 7) % 2; ctx.fillStyle = st ? '#ffd23f' : '#c8102e'; ctx.fillRect(sx0, sy0, sw, sh);
      ctx.fillStyle = st ? 'rgba(255,255,255,0.25)' : 'rgba(255,210,63,0.3)'; for (let i = 0; i < 16; i += 2) { const a0 = i / 16 * 6.283 + time * 0.5, a1 = (i + 1) / 16 * 6.283 + time * 0.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a0) * sw, cy + Math.sin(a0) * sw); ctx.lineTo(cx + Math.cos(a1) * sw, cy + Math.sin(a1) * sw); ctx.fill(); }
      ctx.font = font(sh * 0.5); for (let i = 0; i < 5; i++) { const lx = cx + (i - 2) * sh * 0.3, ly2 = cy - Math.abs(Math.sin(time * 6 + i * 0.7)) * sh * 0.12; ctx.fillStyle = '#111111'; ctx.fillText('GOAL!'[i], lx + 4, ly2 + 4); ctx.fillStyle = st ? '#c8102e' : '#ffffff'; ctx.fillText('GOAL!'[i], lx, ly2); }
    } else if (sc === 2) { // basketball dunk replay
      ctx.fillStyle = '#2a1640'; ctx.fillRect(sx0, sy0, sw, sh); const fl = Math.round(sy0 + sh * 0.86); ctx.fillStyle = '#c98a4a'; ctx.fillRect(sx0, fl, sw, sh); ctx.fillStyle = '#8a5a2a'; for (let x = sx0; x < sx0 + sw; x += 30) ctx.fillRect(x, fl, 2, sh);
      const hx = sx0 + sw * 0.82, ry = Math.round(sy0 + sh * 0.36); ctx.fillStyle = '#d8dde6'; ctx.fillRect(hx + 18, ry - 50, 8, 64); ctx.fillRect(hx + 30, ry, 6, fl - ry); ctx.fillStyle = '#ff6a00'; ctx.fillRect(hx - 22, ry, 40, 4);
      const u = lt / 6; let px2, py2, pose = 1, bx2, by2, swish = 0;
      if (u < 0.45) { const r = u / 0.45; px2 = sx0 + sw * (0.12 + 0.5 * r); py2 = fl; bx2 = px2 + 14; by2 = fl - 8 - Math.abs(Math.sin(r * 18)) * sh * 0.25; }
      else if (u < 0.62) { const r = (u - 0.45) / 0.17; px2 = sx0 + sw * 0.62 + (hx - 30 - sx0 - sw * 0.62) * r; py2 = fl - Math.sin(r * Math.PI / 2) * (fl - ry - 36); pose = 2; bx2 = px2 + 4; by2 = py2 - 64; }
      else if (u < 0.75) { const r = (u - 0.62) / 0.13; px2 = hx - 30; py2 = ry + 36 + r * 8; pose = 2; bx2 = hx - 2; by2 = ry - 4 + r * 34; swish = 1; }
      else { const r = (u - 0.75) / 0.25; px2 = hx - 30 - r * 40; py2 = Math.min(fl, ry + 44 + r * 300); pose = 0; bx2 = hx - 2 + r * 50; by2 = fl - 8 - Math.abs(Math.sin(r * 9)) * 40 * (1 - r); }
      ctx.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(hx - 20 + i * 9 + (swish ? Math.sin(time * 30 + i) * 2 : 0)), ry + 4, 2, 22);
      spFig(px2, py2, 4, '#6a0dad', '#ffb000', SKIN[3], time * 14, pose, 1);
      ctx.fillStyle = '#ff8a2a'; ctx.fillRect(Math.round(bx2) - 7, Math.round(by2) - 7, 14, 14); ctx.fillStyle = '#3a1a0a'; ctx.fillRect(Math.round(bx2) - 7, Math.round(by2) - 1, 14, 2); ctx.fillRect(Math.round(bx2) - 1, Math.round(by2) - 7, 2, 14);
      ctx.textAlign = 'left'; ctx.font = font(22); ctx.fillStyle = '#ff3030'; ctx.fillRect(sx0 + 14, sy0 + 14, 10, 10); ctx.fillStyle = '#ffffff'; ctx.fillText('REPLAY', sx0 + 30, sy0 + 20);
    } else if (sc === 3) { // a tennis rally, seen from the umpire's chair
      ctx.fillStyle = '#1f5f8a'; ctx.fillRect(sx0, sy0, sw, sh); const cl = Math.min(sw * 0.8, sh * 2.3), cw2 = sh * 0.7, c0 = cx - cl / 2, r0 = cy - cw2 / 2;
      ctx.fillStyle = '#3a8a4a'; ctx.fillRect(c0, r0, cl, cw2); ctx.fillStyle = '#ffffff'; ctx.fillRect(c0, r0, cl, 2); ctx.fillRect(c0, r0 + cw2 - 2, cl, 2); ctx.fillRect(c0, r0, 2, cw2); ctx.fillRect(c0 + cl - 2, r0, 2, cw2); ctx.fillRect(c0 + cl * 0.23, r0, 2, cw2); ctx.fillRect(c0 + cl * 0.77, r0, 2, cw2); ctx.fillRect(c0 + cl * 0.23, cy - 1, cl * 0.54, 2);
      ctx.fillStyle = '#e8e8e8'; ctx.fillRect(cx - 2, r0 - 8, 4, cw2 + 16);
      const leg = Math.floor(time / 0.9), s = mod(time, 0.9) / 0.9, ya = cy + (hsh(leg, 1305) - 0.5) * cw2 * 0.7, yb = cy + (hsh(leg + 1, 1305) - 0.5) * cw2 * 0.7, dir = leg % 2 ? -1 : 1, xa = dir > 0 ? c0 + 8 : c0 + cl - 8, bx2 = xa + dir * (cl - 16) * s, by2 = ya + (yb - ya) * s, z = Math.abs(Math.sin(s * Math.PI * 1.3)) * 28;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(Math.round(bx2) - 3, Math.round(by2) - 1, 6, 3); ctx.fillStyle = '#d8ff3a'; ctx.fillRect(Math.round(bx2) - 3, Math.round(by2 - z) - 3, 6, 6);
      const lp = dir > 0 ? ya : yb + (ya - yb) * (1 - s), rp = dir > 0 ? ya + (yb - ya) * s : yb; spTop(c0 - 12, lp, 3, '#ffffff', '#c8102e', '#ffffff', SKIN[0], time * 10, 1); spTop(c0 + cl + 12, rp, 3, '#ffd23f', '#003da5', '#003da5', SKIN[3], time * 10, 1);
      ctx.fillStyle = '#ffffff'; ctx.font = font(sh * 0.14); ctx.fillText(['15 - 0', '15 - 15', '30 - 15', '40 - 15', 'DEUCE'][Math.floor(time / 6) % 5], cx, sy0 + sh * 0.08);
    } else if (sc === 4) { // the kiss cam
      ctx.fillStyle = '#3a0a2a'; ctx.fillRect(sx0, sy0, sw, sh); for (let i = 0; i < 14; i++) spBlit(spHeart(), sx0 + hsh(i, 1300) * sw, sy0 + sh - mod(time * 40 + hsh(i, 1301) * sh, sh + 20), 3);
      const lean = spCl((lt - 2) / 1.5) * Math.min(26, sw * 0.04); for (const [s, shirt, skin, hair] of [[-1, '#3bceac', SKIN[1], '#3a2010'], [1, '#ff7ad9', SKIN[4], '#d9a040']]) { const hx = cx + s * (60 - lean); ctx.fillStyle = shirt; ctx.fillRect(Math.round(hx) - 30, Math.round(cy + 20), 60, sh); ctx.fillStyle = skin; ctx.fillRect(Math.round(hx) - 18, Math.round(cy - 34), 36, 44); ctx.fillStyle = hair; ctx.fillRect(Math.round(hx) - 20, Math.round(cy - 40), 40, 14); ctx.fillStyle = '#111111'; ctx.fillRect(Math.round(hx - s * 8) - 2, Math.round(cy - 16), 4, 4); }
      if (lt > 3.6) halo(cx, cy - 10, 30, '255,92,154', 0.7);
      ctx.fillStyle = '#ff9ccc'; ctx.font = font(sh * 0.16); ctx.fillText('KISS CAM', cx, sy0 + sh * 0.1);
    } else if (sc === 5) { // the noise meter
      ctx.fillStyle = '#08121f'; ctx.fillRect(sx0, sy0, sw, sh); ctx.fillStyle = '#ffffff'; ctx.font = font(sh * 0.17); ctx.fillText('MAKE SOME NOISE', cx, sy0 + sh * 0.14);
      const n = 24, bw = sw * 0.8 / n, base = sy0 + sh * 0.9, top = sh * 0.6, lev = 0.6 + 0.4 * Math.sin(time * 0.7);
      for (let i = 0; i < n; i++) { const h = (0.3 + 0.7 * Math.abs(Math.sin(time * (3 + i * 0.13) + i))) * top * lev, x = Math.round(sx0 + sw * 0.1 + i * bw); ctx.fillStyle = '#3bceac'; ctx.fillRect(x, base - Math.min(h, top * 0.5), bw - 3, Math.min(h, top * 0.5)); if (h > top * 0.5) { ctx.fillStyle = '#ffd23f'; ctx.fillRect(x, base - Math.min(h, top * 0.8), bw - 3, Math.min(h, top * 0.8) - top * 0.5); } if (h > top * 0.8) { ctx.fillStyle = '#ff4d4d'; ctx.fillRect(x, base - h, bw - 3, h - top * 0.8); } }
      ctx.fillStyle = '#08121f'; for (let yy = base - top; yy < base; yy += 8) ctx.fillRect(sx0, Math.round(yy), sw, 2);
      ctx.fillStyle = '#ffd23f'; ctx.font = font(sh * 0.13); ctx.fillText(Math.round(92 + 18 * lev) + ' dB', cx + sw * 0.36, sy0 + sh * 0.14);
    } else if (sc === 6) { // the 100 m final
      ctx.fillStyle = '#a8432c'; ctx.fillRect(sx0, sy0, sw, sh); const lh = sh / 6, fin = sx0 + sw * 0.88; ctx.fillStyle = 'rgba(255,240,230,0.7)'; for (let l = 0; l <= 6; l++) ctx.fillRect(sx0, Math.round(sy0 + l * lh), sw, 2);
      for (let l = 0; l < 12; l++) { ctx.fillStyle = l % 2 ? '#111111' : '#ffffff'; ctx.fillRect(Math.round(fin), Math.round(sy0 + l * lh / 2), 6, Math.ceil(lh / 2)); }
      for (let i = 0; i < 6; i++) { const v = 0.15 + hsh(i + Math.floor(time / 6) * 6, 1310) * 0.03, pos = Math.min(0.93, 0.03 + lt * v), t = TEAM[i]; spFig(sx0 + sw * pos, sy0 + (i + 1) * lh - 3, 2, t[0], t[1], SKIN[i], time * 16 + i, pos < 0.93 ? 1 : 0, 1); }
      ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.font = font(sh * 0.14); ctx.fillText((Math.min(lt, 5.6) * 1.7).toFixed(2), sx0 + sw - 10, sy0 + sh * 0.1); ctx.textAlign = 'left'; ctx.fillText('100 M FINAL', sx0 + 12, sy0 + sh * 0.1);
    } else { // how deep you are
      ctx.fillStyle = '#0a1a33'; ctx.fillRect(sx0, sy0, sw, sh); ctx.fillStyle = 'rgba(94,224,255,0.9)'; ctx.font = font(sh * 0.32); ctx.fillText(Math.floor(time) % 4 < 2 ? 'O B S C U R A' : Math.round(Math.max(0, cam)).toLocaleString('en-US') + ' m', cx, sy0 + sh * 0.45);
      ctx.font = font(sh * 0.14); ctx.fillStyle = '#ffd23f'; ctx.fillText('★ MAKE SOME NOISE ★', cx, sy0 + sh * 0.8);
    }
    ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    if (!spScan) spScan = ctx.createPattern(spArt('scan', 2, 3, x => { x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(0, 2, 2, 1); x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(1, 0, 1, 2); }), 'repeat');
    ctx.fillStyle = spScan; ctx.fillRect(sx0, sy0, sw, sh);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.lineTo(sx0 + sw * 0.35, sy0); ctx.lineTo(sx0 + sw * 0.2, sy0 + sh); ctx.lineTo(sx0, sy0 + sh); ctx.fill();
  }
  function spBoard(k, y) {
    const by = y + CROWD + 6, bh = 34; ctx.fillStyle = '#05070b'; ctx.fillRect(0, by, W, bh); ctx.fillStyle = '#1d2533'; ctx.fillRect(0, by - 2, W, 2);
    const goal = time - SPM.gT < 4;
    if (goal || mod(time + k * 0.7, 15) < 2.4) { const ci = Math.floor(time * 8); for (let x = 0, i = 0; x < W; x += 40, i++) { ctx.fillStyle = COLOURS_SPORT[(i + ci) % COLOURS_SPORT.length]; ctx.fillRect(x, by + 3, 38, bh - 6); } if (goal) spTicker('GOAL  GOAL  GOAL', '#111111', 0, by, W, bh, 140, 0); }
    else spTicker(BOARD[k % BOARD.length], k % 2 ? '#ffb000' : '#5ee0ff', 0, by, W, bh, 70, k * 200);
    ctx.fillStyle = '#2a313d'; ctx.fillRect(0, by + bh, W, BAND - CROWD - bh - 6); ctx.fillStyle = '#8b97a8'; ctx.fillRect(0, by + bh + 4, W, 2);
    spBlit(spSign('SEC ' + (100 + k * 7), 2, '#0b1019', '#ffd23f'), 16, by + bh + 8, 1);
  }
  function spStands(low, dim) {
    const px = camS / mpp, k0 = Math.max(Math.ceil(1300 / mpp / BAND), Math.floor((px - AY) / BAND) - 1), k1 = Math.min(Math.floor(4300 / mpp / BAND), Math.floor((px + H - AY) / BAND) + 1);
    // the strip between the roof fascia and the first row of seats
    const fy = Math.round(spY(1300)) + 36, fb = Math.round(AY + Math.ceil(1300 / mpp / BAND) * BAND - px);
    if (fb > fy && fb > 0 && fy < H) { ctx.fillStyle = '#0d1220'; ctx.fillRect(0, fy, W, fb - fy); }
    for (let k = k0; k <= k1; k++) {
      const y = Math.round(AY + k * BAND - px); if (y > H || y + BAND < 0) continue;
      const ty = k % 8;
      if (ty === 5) { spScreen(k, y); continue; }
      if (ty === 7) spBoxes(k, y); else if (ty === 2) spMosaic(k, y); else spCrowd(k, y, ty, low, dim);
      spBoard(k, y);
    }
  }

  // ---- the match: twenty-two players, a referee and a ball, with passing, tackles, shots, saves and goals,
  // a half-time show in the middle and a full-time handshake at the end
  const SPM = { p: null, bx: 34, by: 52.5, bz: 0, own: -1, fx: 0, fy: 0, tx: 0, ty: 0, ft: 0, fd: 1, fh: 0, to: -1, tt: 0, shot: 0, hold: 0, sc: [0, 0], clk: 0, ph: 0, pt: 0, cel: 0, gl: 0, gT: -99, gE: 105, rx: 40, ry: 50, fw: 0 };
  const SP_FORM = [[34, 3], [10, 20], [26, 17], [42, 17], [58, 20], [12, 36], [27, 33], [41, 33], [56, 36], [27, 47], [41, 47]];
  const SP_KIT = [['#c8102e', '#ffffff', '#ffffff'], ['#003da5', '#ffd23f', '#003da5']], SP_KEEP = [['#16a34a', '#111111', '#111111'], ['#ff8c1a', '#111111', '#111111']];
  const spTW0 = () => W >= 760 ? Math.round(Math.min(150, W * 0.1)) : 0, spLX = () => spTW0() + (W < 600 ? 14 : 30);
  function spKick(t) { SPM.bx = 34; SPM.by = 52.5; SPM.bz = 0; SPM.to = -1; SPM.shot = 0; const j = t * 11 + 9, p = SPM.p[j]; p.x = 34; p.y = 52.5 + (t ? 1 : -1); SPM.own = j; SPM.hold = 1.2; }
  function spReset(full) {
    if (!SPM.p) { SPM.p = []; for (let t = 0; t < 2; t++) for (let i = 0; i < 11; i++) SPM.p.push({ t, i, k: i === 0, hx: t ? 68 - SP_FORM[i][0] : SP_FORM[i][0], hy: t ? 105 - SP_FORM[i][1] : SP_FORM[i][1], x: 0, y: 0, mv: 0, ph: Math.random() * 6, dx: 0, dy: 1 }); }
    for (const p of SPM.p) { p.x = p.hx; p.y = p.hy; }
    if (full) { SPM.sc[0] = SPM.sc[1] = 0; SPM.clk = 0; SPM.ph = 0; SPM.pt = 0; SPM.cel = 0; }
    spKick(Math.random() < 0.5 ? 0 : 1);
  }
  function spGoal(G) {
    SPM.sc[SPM.tt]++; SPM.gl = SPM.tt; SPM.cel = 4.5; SPM.gT = time; SPM.gE = G; SPM.to = -2;
    if (camS < 3900 || camS > 5800) return;
    const lx0 = spLX(), pw = W - 2 * lx0, mG = G ? 5290 : 4410, dir = G ? -1 : 1;
    for (let i = 0; i < (window.__low ? 70 : 170); i++) { const side = i % 2 ? 1 : -1; spEmit(W / 2 + side * pw * (0.12 + Math.random() * 0.05), mG, side * (Math.random() * 200 - 40), dir * (200 + Math.random() * 360), 2.5 + Math.random() * 2, COLOURS_SPORT[i % COLOURS_SPORT.length], 0); }
  }
  function spPass(o) {
    const P = SPM.p, s = o.t ? -1 : 1, G = o.t ? 0 : 105, j0 = P.indexOf(o);
    SPM.fx = SPM.bx; SPM.fy = SPM.by; SPM.ft = 0; SPM.tt = o.t;
    if (Math.abs(G - o.y) < 24 && Math.random() < 0.75) { SPM.own = -1; SPM.shot = 1; SPM.to = -1; SPM.tx = 34 + (Math.random() - 0.5) * 11; SPM.ty = G + s * 1.2; SPM.fh = Math.random() < 0.4 ? 1.6 : 0.4; SPM.fd = Math.hypot(SPM.tx - SPM.fx, SPM.ty - SPM.fy) / 26; return; }
    let best = -1, bs = -1e9;
    for (let j = o.t * 11 + 1; j < o.t * 11 + 11; j++) { if (j === j0) continue; const q = P[j], d = Math.hypot(q.x - o.x, q.y - o.y); if (d < 6 || d > 38) continue; const v = (q.y - o.y) * s - d * 0.25 + Math.random() * 14; if (v > bs) { bs = v; best = j; } }
    if (best < 0) { SPM.hold = 0.4; return; }
    const q = P[best], tx = Math.max(2, Math.min(66, q.x + q.dx * 2)), ty = Math.max(2, Math.min(103, q.y + q.dy * 2)), d = Math.hypot(tx - SPM.fx, ty - SPM.fy);
    SPM.own = -1; SPM.shot = 0; SPM.to = best; SPM.tx = tx; SPM.ty = ty; SPM.fd = d / (d > 22 ? 16 : 20); SPM.fh = d > 22 ? d / 40 : 0.1;
  }
  function spMatchStep(dt) {
    if (!SPM.p) spReset(true);
    const P = SPM.p; SPM.pt += dt;
    const play = SPM.ph === 0 || SPM.ph === 2;
    if (play) { if (SPM.cel <= 0) SPM.clk += dt; if (SPM.clk >= (SPM.ph === 0 ? 45 : 90) && SPM.cel <= 0) { SPM.ph++; SPM.pt = 0; SPM.own = -1; SPM.to = -2; SPM.bx = 34; SPM.by = 52.5; SPM.bz = 0; SPM.fw = 0; } }
    else if (SPM.ph === 1) { if (SPM.pt > 32) { SPM.ph = 2; SPM.pt = 0; SPM.clk = 45; for (const p of P) { p.x = p.hx; p.y = p.hy; } spKick(1); }
      else if (SPM.pt > 3 && SPM.pt < 29 && Math.floor(SPM.pt / 1.3) !== SPM.fw) { SPM.fw = Math.floor(SPM.pt / 1.3); if (camS > 4200 && camS < 5500) spBurst(W * (0.25 + Math.random() * 0.5), 4700 + Math.random() * 300, window.__low ? 20 : 44, COLOURS_SPORT[SPM.fw % COLOURS_SPORT.length]); } }
    else if (SPM.ph === 3 && SPM.pt > 10) spReset(true);
    if (SPM.cel > 0) { SPM.cel -= dt; if (SPM.cel <= 0 && play) { for (const p of P) { p.x = p.hx; p.y = p.hy; } spKick(1 - SPM.gl); } }
    if (play && SPM.cel <= 0) {
      if (SPM.own >= 0) {
        const o = P[SPM.own]; SPM.bx = o.x + o.dx * 0.9; SPM.by = o.y + o.dy * 0.9; SPM.bz = 0; SPM.hold -= dt;
        for (let j = (1 - o.t) * 11 + 1; j < (1 - o.t) * 11 + 11; j++) { const q = P[j]; if (Math.abs(q.x - o.x) < 1.3 && Math.abs(q.y - o.y) < 1.3 && Math.random() < dt * 1.4) { SPM.own = j; SPM.to = -1; SPM.hold = 0.6; break; } }
        if (SPM.own >= 0 && SPM.hold <= 0) spPass(P[SPM.own]);
      } else if (SPM.to !== -2) {
        SPM.ft += dt / SPM.fd; const u = Math.min(1, SPM.ft);
        SPM.bx = SPM.fx + (SPM.tx - SPM.fx) * u; SPM.by = SPM.fy + (SPM.ty - SPM.fy) * u; SPM.bz = Math.sin(u * Math.PI) * SPM.fh;
        if (!SPM.shot && SPM.bz < 0.6 && u > 0.2 && u < 0.9) for (let j = (1 - SPM.tt) * 11 + 1; j < (1 - SPM.tt) * 11 + 11; j++) { const q = P[j]; if (Math.abs(q.x - SPM.bx) < 1.5 && Math.abs(q.y - SPM.by) < 1.5 && Math.random() < dt * 6) { SPM.own = j; SPM.to = -1; SPM.hold = 0.5 + Math.random(); break; } }
        if (SPM.own < 0 && u >= 1) {
          if (SPM.shot) { if (Math.abs(SPM.tx - 34) < 3.66 && Math.random() < 0.6) spGoal(SPM.tt ? 0 : 105); else { SPM.own = (1 - SPM.tt) * 11; SPM.hold = 1.4; } }
          else { SPM.own = SPM.to >= 0 ? SPM.to : SPM.tt * 11 + 5; SPM.hold = 0.4 + Math.random() * 1.4; }
        }
      }
    }
    // who chases the ball: the nearest outfield player of each side
    let c0 = -1, c1 = -1, d0 = 1e9, d1 = 1e9; const bx = SPM.bx, by = SPM.by, ownT = SPM.own >= 0 ? P[SPM.own].t : SPM.to >= 0 ? SPM.tt : -1;
    for (let j = 0; j < 22; j++) { const p = P[j]; if (p.k) continue; const d = (p.x - bx) * (p.x - bx) + (p.y - by) * (p.y - by); if (p.t === 0 && d < d0) { d0 = d; c0 = j; } if (p.t === 1 && d < d1) { d1 = d; c1 = j; } }
    for (let j = 0; j < 22; j++) {
      const p = P[j], s = p.t ? -1 : 1; let tx, ty, sp;
      if (!play) { if (SPM.ph === 1) { tx = p.t ? 66.5 : 1.5; ty = 31 + p.i * 4.2; sp = 3.5; } else { tx = 9 + p.i * 5; ty = 52.5 + (p.t ? 2.2 : -2.2); sp = 3; } }
      else if (SPM.cel > 0) { if (p.t === SPM.gl && !p.k) { tx = 64 - (p.i % 3) * 2; ty = SPM.gE ? 101 - (p.i % 4) * 1.5 : 4 + (p.i % 4) * 1.5; sp = 7; } else { tx = p.hx; ty = p.hy; sp = 2.5; } }
      else if (j === SPM.own) { tx = 34 + Math.sin(time * 0.9 + j) * 14; ty = p.t ? 0 : 105; sp = 5.6; }
      else if (j === SPM.to) { tx = SPM.tx; ty = SPM.ty; sp = 6.5; }
      else if ((j === c0 || j === c1) && ownT !== p.t) { tx = bx; ty = by; sp = 6.6; }
      else if (p.k) { tx = 34 + (bx - 34) * 0.18; ty = p.hy; sp = 4; }
      else { const push = ownT === p.t ? 9 : ownT >= 0 ? -5 : 0; tx = p.hx + (bx - 34) * 0.35; ty = p.hy + (by - 52.5) * 0.55 + push * s; sp = 4.2; }
      tx = Math.max(1, Math.min(67, tx)); ty = Math.max(0.5, Math.min(104.5, ty));
      const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
      if (d > 0.3) { const st = Math.min(d, sp * dt); p.x += dx / d * st; p.y += dy / d * st; p.dx = dx / d; p.dy = dy / d; p.mv = 1; p.ph += dt * 11; } else p.mv = 0;
    }
    SPM.rx += (bx + 7 - SPM.rx) * Math.min(1, dt * 1.2); SPM.ry += (by - 9 - SPM.ry) * Math.min(1, dt * 1.2);
  }
  const spFl = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; spFl.n = 0;
  function spFlame(x, y, dir, h) {
    for (let s = 0; s < 9; s++) { const w = (9 - s) * 1.8 + Math.sin(time * 40 + s * 2 + x) * 2, yy = y + dir * s * h / 9; ctx.fillStyle = s < 3 ? '#fff6c8' : s < 6 ? '#ffb340' : '#ff5a1f'; ctx.globalAlpha = 1 - s / 11; ctx.fillRect(Math.round(x - w / 2), Math.round(yy - h / 18), Math.round(w), Math.ceil(h / 9) + 1); }
    ctx.globalAlpha = 1; halo(x, y + dir * h * 0.35, h * 0.55, '255,150,60', 0.85);
  }
  function spPitch(low) {
    const aT = spY(4300), top = spY(4410), bot = spY(5290), aB = spY(5320);
    if (aB < -30 || aT > H + 30) return;
    spFl.n = 0; const TW = spTW0(), lx0 = spLX(), lx1 = W - lx0, pw = lx1 - lx0, ph = bot - top, g0 = Math.max(aT, -2), g1 = Math.min(aB, H + 2), u = Math.max(2, Math.round(AP * 0.9));
    // grass, mown in stripes both ways
    ctx.fillStyle = '#2f8a3e'; ctx.fillRect(0, g0, W, g1 - g0); ctx.fillStyle = '#38a149';
    for (let s = Math.floor((g0 - top) / 60); top + s * 60 < g1; s++) if (!(s & 1)) ctx.fillRect(0, Math.round(top + s * 60), W, 60);
    ctx.fillStyle = 'rgba(255,255,255,0.035)'; for (let x = lx0; x < lx1; x += 80) ctx.fillRect(x, g0, 40, g1 - g0);
    // the running track down both sides, with hurdlers and sprinters
    if (TW) { for (const side of [0, 1]) { const x0 = side ? W - TW : 0; ctx.fillStyle = '#a8432c'; ctx.fillRect(x0, g0, TW, g1 - g0); ctx.fillStyle = 'rgba(255,240,230,0.55)'; for (let l = 0; l <= 4; l++) ctx.fillRect(Math.round(x0 + 4 + l * (TW - 8) / 4), g0, 2, g1 - g0); }
      const lw = (TW - 8) / 4; ctx.fillStyle = '#f2f2f2';
      for (let m = 4320; m < 5300; m += 60) { const y = spY(m); if (y < -10 || y > H + 10) continue; ctx.fillRect(Math.round(4 + lw), Math.round(y), Math.round(lw), 3); ctx.fillStyle = '#111111'; ctx.fillRect(Math.round(4 + lw + lw / 3), Math.round(y), Math.round(lw / 3), 3); ctx.fillStyle = '#f2f2f2'; }
      for (let i = 0; i < 8; i++) { const side = i % 2, lane = (i >> 1) % 4, dn = side ? -1 : 1, m = 4300 + mod(hsh(i, 1320) * 1000 + dn * time * (34 + hsh(i, 1321) * 14), 1000), y = spY(m); if (y < -20 || y > H + 20) continue;
        const x = (side ? W - TW : 0) + 4 + (lane + 0.5) * lw, hj = side === 0 && lane === 1 ? Math.max(0, 1 - Math.abs(mod(m - 4320 + 30, 60) - 30) / 8) : 0; spTop(x, y - hj * 8, u, ['#ffd23f', '#5ee0ff', '#ff7ad9', '#ffffff'][lane], '#111111', '#111111', SKIN[i % SKIN.length], time * 18 + i, 1); } }
    // the markings
    if (top < H + 40 && bot > -40) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 4;
      ctx.fillRect(lx0, top, pw, 4); ctx.fillRect(lx0, bot - 4, pw, 4); ctx.fillRect(lx0, top, 4, ph); ctx.fillRect(lx1 - 4, top, 4, ph);
      const mid = (top + bot) / 2; ctx.fillRect(lx0, mid - 2, pw, 4); ctx.beginPath(); ctx.arc(W / 2, mid, Math.min(110, pw * 0.135), 0, 6.283); ctx.stroke(); ctx.fillRect(W / 2 - 4, mid - 4, 8, 8);
      if (mid > -200 && mid < H + 200) { const r = Math.min(110, pw * 0.135) * 0.62; ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.beginPath(); for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; i ? ctx.lineTo(W / 2 + Math.cos(a) * rr, mid + Math.sin(a) * rr) : ctx.moveTo(W / 2 + Math.cos(a) * rr, mid + Math.sin(a) * rr); } ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.85)'; }
      for (let m = 4470; m < 5280; m += 110) { const y = spY(m); if (y < -30 || y > H + 30) continue; spTop(lx0 - Math.min(14, (lx0 - TW) * 0.5), y, Math.max(1, u - 1), '#ff7a1a', '#ffd23f', '#1b1f2a', SKIN[(m / 10) % SKIN.length | 0], 0, 0); spTop(lx1 + Math.min(14, (lx0 - TW) * 0.5), y + 30, Math.max(1, u - 1), '#ff7a1a', '#ffd23f', '#1b1f2a', SKIN[(m / 10 + 3) % SKIN.length | 0], 0, 0); }
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const bw = pw * 0.59, bd = ph * 16.5 / 105, gw = pw * 0.27, gd = ph * 5.5 / 105, mw = pw * 7.32 / 68;
      for (const e of [0, 1]) { const gl = e ? bot - 2 : top + 2, s = e ? -1 : 1; ctx.strokeRect(W / 2 - bw / 2, e ? gl - bd : gl, bw, bd); ctx.strokeRect(W / 2 - gw / 2, e ? gl - gd : gl, gw, gd); ctx.fillRect(W / 2 - 3, gl + s * ph * 11 / 105 - 3, 6, 6); ctx.beginPath(); ctx.arc(W / 2, gl + s * ph * 11 / 105, Math.min(110, pw * 0.135), e ? Math.PI + 0.9 : 0.9, e ? 2 * Math.PI - 0.9 : Math.PI - 0.9); ctx.stroke();
        // the goal and its net, then the pyro cannons either side of it
        const ny = e ? gl + 2 : gl - 22; ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(W / 2 - mw / 2, ny, mw, 20); ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = W / 2 - mw / 2; x < W / 2 + mw / 2; x += 6) ctx.fillRect(Math.round(x), ny, 1, 20); for (let yy = 0; yy < 20; yy += 5) ctx.fillRect(W / 2 - mw / 2, ny + yy, mw, 1);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(W / 2 - mw / 2 - 3, ny, 4, 20); ctx.fillRect(W / 2 + mw / 2 - 1, ny, 4, 20); ctx.fillRect(W / 2 - mw / 2 - 3, e ? ny + 18 : ny, mw + 6, 3);
        const fire = (time - SPM.gT < 3.2 && SPM.gE === (e ? 105 : 0)) || (SPM.ph === 1 && mod(SPM.pt, 5) < 1.4 && SPM.pt > 3);
        for (const off of [-1.7, -1.1, 1.1, 1.7]) { const fx2 = W / 2 + off * mw, fy2 = e ? gl + 26 : gl - 26; ctx.fillStyle = '#1b1f2a'; ctx.fillRect(Math.round(fx2) - 5, Math.round(fy2) - 4, 10, 8); if (fire && !reduce && spFl.n < 8) { const f = spFl[spFl.n++]; f[0] = fx2; f[1] = fy2 + (e ? 4 : -4); f[2] = e ? 1 : -1; f[3] = 60 + 20 * Math.sin(time * 9 + off); } }
        // corner flags
        for (const cx2 of [lx0 + 2, lx1 - 2]) { ctx.fillStyle = '#e8e8e8'; ctx.fillRect(Math.round(cx2) - 1, Math.round(gl) - 14, 2, 14); ctx.fillStyle = '#ffd23f'; ctx.fillRect(Math.round(cx2) + 1, Math.round(gl) - 14 + Math.round(Math.sin(time * 6 + cx2) * 1.5), 8, 5); } }
    }
    // the players, the referee and the ball
    const sxm = pw / 68, sym = ph / 105, X = v => lx0 + v * sxm, YY = v => top + v * sym;
    for (let j = 0; j < 22; j++) { const p = SPM.p[j], y = YY(p.y); if (y < -30 || y > H + 30) continue; const kit = p.k ? SP_KEEP[p.t] : SP_KIT[p.t]; spTop(X(p.x), y, u, kit[0], kit[1], kit[2], SKIN[(j * 7) % SKIN.length], p.ph, p.mv); }
    { const y = YY(SPM.ry); if (y > -30 && y < H + 30) spTop(X(SPM.rx), y, u, '#111111', '#ffd23f', '#111111', SKIN[2], time * 9, 1); }
    { SPM.cy = SPM.cy == null ? SPM.by : SPM.cy + (SPM.by - SPM.cy) * 0.03; const y = Math.round(YY(SPM.cy)), x = Math.round(lx1 + 4); if (y > -30 && y < H + 30) { ctx.fillStyle = '#3a4252'; ctx.fillRect(x, Math.max(g0, top), 2, Math.min(g1, bot) - Math.max(g0, top)); ctx.fillStyle = '#1b1f2a'; ctx.fillRect(x - 6, y - 8, 14, 16); ctx.fillStyle = '#0b0b0b'; ctx.fillRect(x - 14, y - 3, 8, 6); if (Math.sin(time * 3) > 0) halo(x + 4, y - 6, 5, '255,60,60', 0.9); } }
    { const x = X(SPM.bx), y = YY(SPM.by); if (y > -30 && y < H + 30) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(Math.round(x) - 3, Math.round(y) + 1, 7, 3); const zy = Math.round(y - SPM.bz * 16); ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(x) - 3, zy - 3, 6, 6); ctx.fillStyle = '#111111'; ctx.fillRect(Math.round(x) - 1, zy - 1, 2, 2); if (SPM.shot && SPM.own < 0 && SPM.to === -1) halo(x, zy, 9, '255,255,220', 0.6); } }
    // the half-time show: a stage, lasers, a marching band forming shapes, and fireworks
    if (SPM.ph === 1) { const cyM = (top + bot) / 2, a = spCl((SPM.pt - 1) / 2) * spCl((31 - SPM.pt) / 2);
      if (a > 0 && cyM > -500 && cyM < H + 500) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, Math.max(top, 0), W, Math.min(bot, H) - Math.max(top, 0)); ctx.clip();
        if (!reduce) { ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2; const L = Math.max(W, H) * 1.2; for (let i = 0; i < 8; i++) { const ang = time * (i % 2 ? 0.7 : -0.5) + i * 0.785; ctx.strokeStyle = ['rgba(255,60,90,', 'rgba(60,255,160,', 'rgba(80,140,255,', 'rgba(255,220,60,'][i % 4] + (0.5 * a).toFixed(2) + ')'; ctx.beginPath(); ctx.moveTo(W / 2, cyM); ctx.lineTo(W / 2 + Math.cos(ang) * L, cyM + Math.sin(ang) * L); ctx.stroke(); } ctx.globalCompositeOperation = 'source-over'; }
        const sw2 = Math.min(200, pw * 0.35); ctx.globalAlpha = a; ctx.fillStyle = '#121218'; ctx.fillRect(Math.round(W / 2 - sw2 / 2), Math.round(cyM - 40), Math.round(sw2), 80);
        const ci = Math.floor(time * 12); for (let i = 0; i < 20; i++) { ctx.fillStyle = COLOURS_SPORT[(i + ci) % COLOURS_SPORT.length]; ctx.fillRect(Math.round(W / 2 - sw2 / 2 + i * sw2 / 20), Math.round(cyM - 42), Math.ceil(sw2 / 20) - 2, 3); ctx.fillRect(Math.round(W / 2 - sw2 / 2 + i * sw2 / 20), Math.round(cyM + 39), Math.ceil(sw2 / 20) - 2, 3); }
        spFig(W / 2, cyM + 14, 3, '#ff7ad9', '#1b1f2a', SKIN[4], time * 6, Math.sin(time * 3) > 0 ? 2 : 0, 1); halo(W / 2, cyM - 10, 34, '255,200,240', 0.6 * a);
        const N = low ? 24 : 48, S = spDrone(N), cyc = SPM.pt / 5, i0 = Math.floor(cyc), m = spIO(spCl((cyc - i0 - 0.55) / 0.45)), A = S[i0 % S.length], B = S[(i0 + 1) % S.length], R0 = Math.min(pw * 0.36, 250);
        for (let n = 0; n < N; n++) { const x = Math.round(W / 2 + (A[n * 2] + (B[n * 2] - A[n * 2]) * m) * R0), y = Math.round(cyM + (A[n * 2 + 1] + (B[n * 2 + 1] - A[n * 2 + 1]) * m) * R0 * 1.15); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x - 1, y + 4, 6, 2); ctx.fillStyle = '#f2f2f2'; ctx.fillRect(x - 2, y - 2, 5, 6); ctx.fillStyle = '#c8102e'; ctx.fillRect(x - 2, y - 5, 5, 3); ctx.fillStyle = '#ffd23f'; ctx.fillRect(x + ((n + Math.floor(time * 4)) % 2 ? 2 : -2), y, 2, 2); }
        ctx.globalAlpha = 1; ctx.restore();
      } }
    // pitch-side: perimeter LED boards, the scoreboard, the dugouts and the photographers, at both ends
    for (const e of [0, 1]) {
      const y0 = e ? bot + 30 : aT + 4; if (y0 > H + 120 || y0 < -160) continue;
      const by = Math.round(e ? y0 : y0); ctx.fillStyle = '#05070b'; ctx.fillRect(0, by, W, 26);
      if (time - SPM.gT < 4) { const ci = Math.floor(time * 10); for (let x = 0, i = 0; x < W; x += 30, i++) { ctx.fillStyle = (i + ci) % 2 ? '#ffd23f' : '#c8102e'; ctx.fillRect(x, by + 2, 28, 22); } spTicker('GOAL  GOAL', '#ffffff', 0, by, W, 26, 160, 0); }
      else spTicker(e ? 'PLAY FAIR  RESPECT THE REF  OBSCURA' : 'WELCOME TO THE PITCH  REDS V BLUES  OBSCURA', e ? '#3bceac' : '#ff7ad9', 0, by, W, 26, 90, e * 300);
      if (!e) {
        // the scoreboard: re-drawn only when the score or the minute changes
        const st = SPM.ph === 1 ? 'HT' : SPM.ph === 3 ? 'FT' : String(Math.floor(SPM.clk)).padStart(2, '0') + "'", txt = 'REDS ' + SPM.sc[0] + '-' + SPM.sc[1] + ' BLUES ' + st, sb = spSB(txt), sx = Math.round(lx0), sy2 = by + 36;
        ctx.drawImage(sb, sx, sy2); if (time - SPM.gT < 4 && Math.sin(time * 14) > 0) { ctx.fillStyle = 'rgba(255,210,63,0.35)'; ctx.fillRect(sx, sy2, sb.width, sb.height); }
        // the dugouts
        for (const dx of [W * 0.5 - pw * 0.28, W * 0.5 + pw * 0.28]) { const x = Math.round(dx - 50), y = by + 96; if (y > H) break; ctx.fillStyle = '#9fb4c8'; ctx.globalAlpha = 0.35; ctx.fillRect(x, y, 100, 30); ctx.globalAlpha = 1; ctx.fillStyle = '#1b2230'; ctx.fillRect(x, y + 30, 100, 8); for (let s = 0; s < 6; s++) { ctx.fillStyle = SP_KIT[dx < W / 2 ? 0 : 1][0]; ctx.fillRect(x + 6 + s * 16, y + 16, 10, 12); ctx.fillStyle = SKIN[s % SKIN.length]; ctx.fillRect(x + 8 + s * 16, y + 10, 6, 6); } spFig(x + 50 + Math.sin(time * 0.8 + dx) * 40, y + 66, 2, '#2b303b', '#1b1f2a', SKIN[1], time * 5, Math.abs(Math.cos(time * 0.8 + dx)) > 0.3 ? 1 : 0, Math.cos(time * 0.8 + dx) > 0 ? 1 : -1); }
      }
      // photographers crouched by the goal line, flashes going off
      const py = e ? bot + 60 : top - 34; if (py < -20 || py > H + 20) continue;
      for (let i = 0; i < 14; i++) { const x = lx0 + 20 + i * (pw - 40) / 13; if (Math.abs(x - W / 2) < pw * 0.07) continue; ctx.fillStyle = '#1b1f2a'; ctx.fillRect(Math.round(x) - 5, Math.round(py) - 6, 10, 10); ctx.fillStyle = SKIN[i % SKIN.length]; ctx.fillRect(Math.round(x) - 2, Math.round(py) - 10, 5, 4); ctx.fillStyle = '#0b0b0b'; ctx.fillRect(Math.round(x) - 1, Math.round(py) + (e ? -12 : 4), 3, 8);
        if (!reduce && hsh(i + e * 20, Math.floor(time * 5)) < (time - SPM.gT < 4 ? 0.5 : 0.06)) halo(x, py + (e ? -12 : 10), 14, '255,255,255', 0.9); }
    }
    for (let i = 0; i < spFl.n; i++) spFlame(spFl[i][0], spFl[i][1], spFl[i][2], spFl[i][3]);
  }
  let spSBc = null, spSBt = '';
  function spSB(txt) {
    if (spSBc && spSBt === txt) return spSBc; spSBt = txt;
    const sc = 3, w = spTW(txt, sc) + 24, h = 5 * sc + 20; spSBc = spSBc || document.createElement('canvas'); spSBc.width = w; spSBc.height = h; const x = spSBc.getContext('2d');
    x.fillStyle = '#05070b'; x.fillRect(0, 0, w, h); x.fillStyle = '#2a313d'; x.fillRect(0, 0, w, 3); x.fillRect(0, h - 3, w, 3); spTxt(x, txt, 12, 10, sc, '#ffd23f', true); return spSBc;
  }

  // ---- under the stand: the tunnel, the dressing room and the training hall
  let spBrickP = null, spTileP = null;
  const spRack = () => spPix('rack', ['..WKW...OOO...BB....yy..WbW..', '.WKWKW.OOkOO.BBBB..yyyy.WbWbW.', '.KWKWK.OkkkO.BBBBB.yyyy.bWyWb.', '.WKWKW.OOkOO.BBBB..yyyy.WbWbW.', '..WKW...OOO...BB....yy...yWy..', 'ffffffffffffffffffffffffffffff', 'f............................f'], { W: '#f2f2f2', K: '#202020', O: '#ff8a2a', k: '#2a1408', B: '#8a4a22', y: '#d8ff3a', b: '#2f6bd8', f: '#8b97a8' });
  const spLockers = row => spArt('lock' + row, W, 200, x => {
    const n = Math.max(1, Math.floor((W - 40) / 70)), x0 = 20 + ((W - 40) - n * 70) / 2;
    for (let i = 0; i < n; i++) { const lx = Math.round(x0 + i * 70), jc = TEAM[(i + row) % TEAM.length];
      x.fillStyle = '#3a4150'; x.fillRect(lx, 0, 62, 180); x.fillStyle = '#2a2f3a'; x.fillRect(lx + 4, 4, 54, 172); x.fillStyle = '#c9a24a'; x.fillRect(lx + 16, 8, 30, 7);
      x.fillStyle = '#8b97a8'; x.fillRect(lx + 29, 20, 4, 10); x.fillStyle = jc[0]; x.fillRect(lx + 12, 30, 38, 44); x.fillRect(lx + 6, 30, 8, 18); x.fillRect(lx + 48, 30, 8, 18); x.fillStyle = '#2a2f3a'; x.fillRect(lx + 26, 30, 10, 4);
      const num = String((i * 7 + row * 3) % 99 + 1); spTxt(x, num, Math.round(lx + 31 - spTW(num, 2) / 2), 42, 2, jc[1]);
      x.fillStyle = '#556070'; x.fillRect(lx + 4, 120, 54, 4); x.fillStyle = '#111111'; x.fillRect(lx + 12, 112, 14, 8); x.fillRect(lx + 32, 112, 14, 8); x.fillStyle = jc[1]; x.fillRect(lx + 12, 112, 14, 2); x.fillRect(lx + 32, 112, 14, 2);
      x.fillStyle = '#20242c'; for (let v = 0; v < 4; v++) x.fillRect(lx + 20, 150 + v * 5, 22, 2);
      if (hsh(i, 1500 + row) < 0.45) { x.fillStyle = hsh(i, 1501) < 0.5 ? '#ffffff' : jc[0]; x.fillRect(lx + 8, 180, 30, 6); } }
    x.fillStyle = '#7a5530'; x.fillRect(0, 186, W, 8); x.fillStyle = '#5a3d22'; for (let bx = 30; bx < W; bx += 160) x.fillRect(bx, 194, 6, 6);
  }, true);
  function spTunnel(low) {
    const top = spY(5300), bot = spY(6880); if (bot < -20 || top > H + 20) return;
    const zone = (m0, m1) => [Math.max(spY(m0), -2), Math.min(spY(m1), H + 2)];
    // the players' tunnel: brick, a rubber walkway, and the two teams walking out hand in hand with the mascots
    let [a, b] = zone(5320, 5680);
    if (b > a) {
      if (!spBrickP) spBrickP = ctx.createPattern(spArt('brick', 32, 16, x => { x.fillStyle = '#1e2026'; x.fillRect(0, 0, 32, 16); for (let r = 0; r < 2; r++) for (let c = -1; c < 2; c++) { x.fillStyle = ['#34373f', '#30333a', '#383b44'][Math.floor(hsh(r * 3 + c + 1, 1510) * 3)]; x.fillRect(c * 16 + (r ? 8 : 0) + 1, r * 8 + 1, 15, 7); } }), 'repeat');
      spBrickP.setTransform(new DOMMatrix([AP / 1.5, 0, 0, AP / 1.5, 0, Math.round(top)])); ctx.fillStyle = spBrickP; ctx.fillRect(0, a, W, b - a);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, a, W * 0.14, b - a); ctx.fillRect(W * 0.86, a, W * 0.14, b - a);
      ctx.fillStyle = '#1a2a1f'; ctx.fillRect(Math.round(W / 2 - 100), a, 200, b - a); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(Math.round(W / 2 - 100), a, 3, b - a); ctx.fillRect(Math.round(W / 2 + 97), a, 3, b - a);
      const ey = spY(5320); if (ey > -200 && ey < H) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, ey, 0, ey + 200); g.addColorStop(0, 'rgba(220,255,220,0.4)'); g.addColorStop(1, 'rgba(220,255,220,0)'); ctx.fillStyle = g; ctx.fillRect(W * 0.2, ey, W * 0.6, 200); ctx.globalCompositeOperation = 'source-over'; }
      for (let m = 5350; m < 5680; m += 60) { const y = spY(m); if (y < -40 || y > H + 40) continue; const fl = Math.sin(time * 30 + m) > -0.92 ? 1 : 0.2; ctx.fillStyle = 'rgba(255,250,230,' + (0.9 * fl).toFixed(2) + ')'; ctx.fillRect(Math.round(W / 2 - 60), Math.round(y) - 3, 120, 6); halo(W / 2, y, 50, '255,250,230', 0.55 * fl); }
      const sy2 = spY(5330); if (sy2 > -60 && sy2 < H + 60) { ctx.fillStyle = '#ffd23f'; ctx.fillRect(Math.round(W / 2 - 90), Math.round(sy2), 180, 30); spBlit(spSign('PLAYERS ONLY', 2, '#111111', '#ffd23f'), W / 2 - (spTW('PLAYERS ONLY', 2) + 12) / 2, sy2 + 4, 1); }
      const sy3 = spY(5420); if (sy3 > -60 && sy3 < H + 60) { const s = spSign('THIS IS OBSCURA', 3, '#ffd23f', '#0a1a33'); spBlit(s, W / 2 - s.width / 2, sy3, 1); halo(W / 2, sy3 + s.height / 2, 60, '255,210,63', 0.25); }
      const u = Math.max(1, Math.round(AP / 1.5));
      for (let line = 0; line < 2; line++) for (let i = 0; i < 12; i++) { const m = 5680 - mod(time * 14 + i * 28 + line * 9, 360); if (m < 5330) continue; const y = spY(m); if (y < -30 || y > H + 30) continue; const x = W / 2 + (line ? 44 : -44), kit = i === 0 ? SP_KEEP[line] : SP_KIT[line]; spTop(x, y, u, kit[0], kit[1], kit[2], SKIN[(i + line * 3) % SKIN.length], time * 10 + i, 1); spTop(x + (line ? 16 : -16), y + 4, Math.max(1, u - 1), '#ffffff', '#ffd23f', '#1b1f2a', SKIN[(i + 2) % SKIN.length], time * 12 + i, 1); }
    }
    // the dressing room: tiles, lockers with shirts and boots, a tactics board, a ball rack and steam from the showers
    [a, b] = zone(5680, 6300);
    if (b > a) {
      if (!spTileP) spTileP = ctx.createPattern(spArt('tile', 12, 12, x => { x.fillStyle = '#2b313c'; x.fillRect(0, 0, 12, 12); x.fillStyle = '#3a4250'; x.fillRect(1, 1, 11, 11); x.fillStyle = '#434c5c'; x.fillRect(1, 1, 11, 2); }), 'repeat');
      spTileP.setTransform(new DOMMatrix([AP / 1.5, 0, 0, AP / 1.5, 0, Math.round(top)])); ctx.fillStyle = spTileP; ctx.fillRect(0, a, W, b - a);
      for (const [m, row] of [[5720, 0], [5980, 1]]) { const y = spY(m); if (y > -210 && y < H + 10) ctx.drawImage(spLockers(row), 0, Math.round(y)); }
      const shy = Math.round(spY(6058)); if (shy > -20 && shy < H + 100) { ctx.fillStyle = '#5a6578'; ctx.fillRect(0, shy - 4, W, 3); ctx.fillStyle = 'rgba(190,225,255,0.8)';
        for (let x = 40, i = 0; x < W; x += 80, i++) { ctx.fillRect(x - 10, shy - 1, 20, 5); for (let d = 0; d < 6; d++) { const yy = mod(time * 260 + d * 37 + i * 11, 84); ctx.fillRect(x - 8 + d * 3 + Math.round(yy * (d - 2.5) * 0.04), shy + 6 + Math.round(yy), 2, 8); } }
        ctx.fillStyle = '#2b313c'; ctx.fillRect(0, shy + 92, W, 4); }
      const ty2 = spY(6160), bw = Math.min(300, W * 0.44), bh = 160, bx = Math.round(W * 0.5 - bw / 2);
      if (ty2 > -bh - 20 && ty2 < H + 20) { const y = Math.round(ty2); ctx.fillStyle = '#8b97a8'; ctx.fillRect(bx - 6, y - 6, bw + 12, bh + 12); ctx.fillStyle = '#eef1f4'; ctx.fillRect(bx, y, bw, bh); ctx.strokeStyle = 'rgba(40,140,70,0.45)'; ctx.lineWidth = 2; ctx.strokeRect(bx + 10, y + 10, bw - 20, bh - 20); ctx.beginPath(); ctx.moveTo(bx + bw / 2, y + 10); ctx.lineTo(bx + bw / 2, y + bh - 10); ctx.stroke(); ctx.beginPath(); ctx.arc(bx + bw / 2, y + bh / 2, 18, 0, 6.283); ctx.stroke();
        const ph = mod(time / 4, 1); ctx.setLineDash([6, 5]); ctx.lineDashOffset = -time * 20; ctx.lineWidth = 2;
        const routes = [[0.2, 0.7, 0.55, 0.3, '#c8102e'], [0.3, 0.3, 0.7, 0.55, '#c8102e'], [0.45, 0.8, 0.85, 0.5, '#c8102e']];
        for (const [x1, y1, x2, y2, c] of routes) { ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(bx + bw * x1, y + bh * y1); ctx.quadraticCurveTo(bx + bw * (x1 + x2) / 2, y + bh * Math.min(y1, y2) - 20, bx + bw * x2, y + bh * y2); ctx.stroke(); const px3 = bx + bw * (x1 + (x2 - x1) * ph), py3 = y + bh * (y1 + (y2 - y1) * ph) - Math.sin(ph * Math.PI) * 14; ctx.fillStyle = c; ctx.fillRect(Math.round(px3) - 4, Math.round(py3) - 1, 8, 2); ctx.fillRect(Math.round(px3) - 1, Math.round(py3) - 4, 2, 8); }
        ctx.setLineDash([]); ctx.strokeStyle = '#003da5'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(bx + bw * (0.6 + 0.08 * i), y + bh * (0.25 + 0.17 * i), 5, 0, 6.283); ctx.stroke(); }
        spFig(bx + bw + 30 + Math.sin(time * 0.5) * 20, y + bh + 4, 3, '#1b1f2a', '#2a2f3a', SKIN[0], time * 5, Math.abs(Math.cos(time * 0.5)) > 0.3 ? 1 : 0, Math.cos(time * 0.5) > 0 ? 1 : -1); }
      const ry = spY(6250); if (ry > -30 && ry < H + 30) { const r = spRack(); spBlit(r, 20, ry); spBlit(r, W - 20 - r.width * AP, ry); }
      if (!low) { const blob = spArt('blob', 32, 32, x => { const g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(230,236,245,0.9)'); g.addColorStop(1, 'rgba(230,236,245,0)'); x.fillStyle = g; x.fillRect(0, 0, 32, 32); });
        ctx.save(); ctx.imageSmoothingEnabled = true; for (let i = 0; i < 10; i++) { const m = 6300 - mod(time * 10 + i * 60, 600), y = spY(m), s = 70 + hsh(i, 1520) * 90, x = (i % 2 ? W * 0.9 : W * 0.08) + Math.sin(time * 0.5 + i) * 30; if (y < -s || y > H + s) continue; ctx.globalAlpha = 0.12 * spCl((6300 - m) / 100) * spCl((m - 5700) / 100); ctx.drawImage(blob, x - s / 2, y - s / 2, s, s); } ctx.restore(); }
    }
    // the training hall: a basketball shooter that never misses, and a boxer working the heavy bag
    [a, b] = zone(6300, 6880);
    if (b > a) {
      ctx.fillStyle = '#2c241e'; ctx.fillRect(0, a, W, b - a); ctx.fillStyle = '#3a2f26'; for (let m = 6320; m < 6760; m += 40) { const y = spY(m); if (y > -20 && y < H + 20) ctx.fillRect(0, Math.round(y), W, 22); }
      const fl = Math.round(spY(6780));
      if (fl > -40 && fl < H + 140) { const fb = Math.round(spY(6812)); ctx.fillStyle = '#b07a43'; ctx.fillRect(0, fl, W, fb - fl); ctx.fillStyle = '#8f5f30'; for (let x = 0; x < W; x += 26) ctx.fillRect(x, fl, 2, fb - fl); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, fl + 10, W, 3); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, fl, W, 2); }
      // high windows letting moonlight slant across the hall
      const wy = Math.round(spY(6470)); if (wy > -60 && wy < H + 60) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, wy, 0, wy + 420); g.addColorStop(0, 'rgba(150,190,255,0.13)'); g.addColorStop(1, 'rgba(150,190,255,0)'); ctx.fillStyle = g;
        for (let x = W * 0.1; x < W; x += W * 0.2) { ctx.beginPath(); ctx.moveTo(x, wy + 40); ctx.lineTo(x + 50, wy + 40); ctx.lineTo(x + 230, wy + 420); ctx.lineTo(x + 180, wy + 420); ctx.fill(); }
        ctx.globalCompositeOperation = 'source-over'; for (let x = W * 0.1; x < W; x += W * 0.2) { ctx.fillStyle = '#1a2440'; ctx.fillRect(Math.round(x), wy, 50, 40); ctx.fillStyle = '#5a78b0'; ctx.fillRect(Math.round(x) + 3, wy + 3, 20, 15); ctx.fillRect(Math.round(x) + 27, wy + 3, 20, 15); ctx.fillRect(Math.round(x) + 3, wy + 22, 20, 15); ctx.fillRect(Math.round(x) + 27, wy + 22, 20, 15); ctx.fillStyle = '#c8d8ff'; ctx.fillRect(Math.round(x) + 5, wy + 5, 4, 2); } }
      const bn = spY(6400); if (bn > -40 && bn < H + 40) { const s = spSign('TRAIN HARD  PLAY HARDER', 2, '#ffd23f', '#3a1a10'); spBlit(s, W / 2 - s.width / 2, bn, 1); }
      if (fl > -260 && fl < H + 60) {
        const hx = Math.round(W * (W < 600 ? 0.8 : 0.76)), ry = fl - 150, cyc = mod(time, 3.2), sx = W * (W < 600 ? 0.45 : 0.55);
        ctx.fillStyle = '#5a6578'; ctx.fillRect(hx + 40, ry - 40, 6, fl - ry + 40); ctx.fillStyle = '#eef1f4'; ctx.fillRect(hx + 24, ry - 50, 8, 64); ctx.fillStyle = '#c8102e'; ctx.fillRect(hx + 24, ry - 16, 8, 14); ctx.fillStyle = '#ff6a00'; ctx.fillRect(hx - 22, ry, 46, 4);
        let px2 = sx, py2 = fl, pose = 0, bx2, by2, sw = 0;
        if (cyc < 1.2) { pose = 1; bx2 = sx + 14; by2 = fl - 8 - Math.abs(Math.sin(cyc * 8)) * 30; }
        else if (cyc < 1.55) { const r = (cyc - 1.2) / 0.35; py2 = fl - Math.sin(r * Math.PI) * 30; pose = 2; bx2 = sx + 2; by2 = py2 - 60; }
        else if (cyc < 2.45) { const r = (cyc - 1.55) / 0.9; py2 = fl; bx2 = sx + 2 + (hx - sx) * r; by2 = (fl - 90) + (ry - 6 - (fl - 90)) * r - Math.sin(r * Math.PI) * 120; }
        else if (cyc < 2.7) { const r = (cyc - 2.45) / 0.25; bx2 = hx; by2 = ry - 6 + r * 36; sw = 1; }
        else { const r = (cyc - 2.7) / 0.5; bx2 = hx - (hx - sx - 14) * r; by2 = fl - 8 - Math.abs(Math.sin(r * Math.PI * 2)) * 60 * (1 - r * 0.5); }
        ctx.fillStyle = '#ffffff'; for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(hx - 20 + i * 10 + (sw ? Math.sin(time * 30 + i) * 2 : 0)), ry + 4, 2, 24);
        spFig(px2, py2, 4, '#ff6a00', '#002b5c', SKIN[3], time * 10, pose, 1);
        ctx.fillStyle = '#ff8a2a'; ctx.fillRect(Math.round(bx2) - 7, Math.round(by2) - 7, 14, 14); ctx.fillStyle = '#3a1a0a'; ctx.fillRect(Math.round(bx2) - 7, Math.round(by2) - 1, 14, 2);
        if (sw) halo(hx, ry + 14, 26, '255,200,120', 0.5);
        // the heavy bag
        const kx = Math.round(W * (W < 600 ? 0.18 : 0.2)), ky = fl - 140, ang = Math.sin(time * 3.1) * 0.22, hit = Math.cos(time * 3.1) > 0.92;
        ctx.fillStyle = '#8b97a8'; ctx.fillRect(kx - 1, ky - 110, 2, 110); ctx.save(); ctx.translate(kx, ky); ctx.rotate(ang); ctx.fillStyle = '#8a1c1c'; ctx.fillRect(-16, 0, 32, 96); ctx.fillStyle = '#5a1010'; ctx.fillRect(-16, 0, 32, 6); ctx.fillRect(-16, 90, 32, 6); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-12, 6, 4, 84); ctx.restore();
        spFig(kx - 40, fl, 4, '#111111', '#c8102e', SKIN[5], 0, 0, 1); ctx.fillStyle = '#c8102e'; ctx.fillRect(Math.round(kx - 36 + (hit ? 14 : 0)), fl - 36, 12, 10); if (hit) halo(kx - 18, fl - 30, 14, '255,255,255', 0.7);
        if (W >= 600) { // a weightlifter and a skipper
          const lx = Math.round(W * 0.37), lift = 0.5 - 0.5 * Math.cos(time * 1.4), by2 = Math.round(fl - 30 - lift * 38); spFig(lx, fl, 4, '#3bceac', '#1b1f2a', SKIN[1], 0, lift > 0.6 ? 2 : 0, 1);
          ctx.fillStyle = SKIN[1]; ctx.fillRect(lx - 14, by2, 4, fl - 36 - by2 > 0 ? fl - 36 - by2 : 4); ctx.fillRect(lx + 6, by2, 4, fl - 36 - by2 > 0 ? fl - 36 - by2 : 4);
          ctx.fillStyle = '#b8bfca'; ctx.fillRect(lx - 40, by2 - 2, 80, 3); ctx.fillStyle = '#2a2f3a'; ctx.fillRect(lx - 40, by2 - 12, 8, 24); ctx.fillRect(lx + 32, by2 - 12, 8, 24); ctx.fillStyle = '#c8102e'; ctx.fillRect(lx - 32, by2 - 9, 4, 18); ctx.fillRect(lx + 28, by2 - 9, 4, 18);
          const qx = Math.round(W * 0.92), jh = Math.abs(Math.sin(time * 5)) * 14, fy3 = Math.round(fl - jh), ra = time * 5; spFig(qx, fy3, 4, '#ffd23f', '#1b1f2a', SKIN[4], 0, 0, 1);
          ctx.strokeStyle = '#e8e8e8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(qx - 10, fy3 - 30); ctx.quadraticCurveTo(qx, fy3 - 30 + Math.cos(ra) * 70, qx + 12, fy3 - 30); ctx.stroke();
          ctx.fillStyle = '#ffd23f'; ctx.font = '22px VT323, monospace'; ctx.textAlign = 'center'; ctx.fillText('SHOTS MADE ' + (Math.floor(time / 3.2) % 1000), hx, ry - 70); ctx.textAlign = 'left'; }
      }
    }
  }

  // ---- the vault door
  function spVaultDoor() {
    const top = spY(6812), bot = spY(7080); if (bot < -60 || top > H + 60) return;
    const t0 = Math.max(top, -2), t1 = Math.min(bot, H + 2); ctx.fillStyle = '#2b2f36'; ctx.fillRect(0, t0, W, t1 - t0);
    for (const yy of [top + 4, bot - 16]) { for (let x = 0, i = 0; x < W; x += 16, i++) { ctx.fillStyle = i % 2 ? '#111111' : '#ffd23f'; ctx.fillRect(x, Math.round(yy), 16, 12); } }
    ctx.fillStyle = '#4a505a'; for (let x = 12; x < W; x += 30) { ctx.fillRect(x, Math.round(top) + 24, 4, 4); ctx.fillRect(x, Math.round(bot) - 28, 4, 4); }
    const cy = (top + bot) / 2, cx = W / 2, R = Math.max(30, Math.min(W * 0.3, (bot - top) * 0.36, 190));
    ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const a = -0.6 + i * 0.15 + Math.sin(time * 0.6 + i) * 0.02; ctx.fillStyle = 'rgba(255,214,120,0.07)'; ctx.beginPath(); ctx.moveTo(cx + R * 0.95, cy); ctx.lineTo(cx + R * 0.95 + Math.cos(a - 0.05) * W, cy + Math.sin(a - 0.05) * W); ctx.lineTo(cx + R * 0.95 + Math.cos(a + 0.05) * W, cy + Math.sin(a + 0.05) * W); ctx.fill(); } ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(cx + R * 0.1, cy, R * 1.02, 0, 6.283); ctx.fill(); halo(cx + R * 0.95, cy, R * 0.6, '255,214,120', 0.6);
    ctx.fillStyle = '#5a616c'; ctx.beginPath(); ctx.arc(cx - R * 0.06, cy, R, 0, 6.283); ctx.fill(); ctx.fillStyle = '#444a54'; ctx.beginPath(); ctx.arc(cx - R * 0.06, cy, R * 0.86, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#8a929e'; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; ctx.fillRect(Math.round(cx - R * 0.06 + Math.cos(a) * R * 0.93) - 3, Math.round(cy + Math.sin(a) * R * 0.93) - 3, 6, 6); }
    ctx.strokeStyle = '#b8bfca'; ctx.lineWidth = Math.max(3, R * 0.05); ctx.beginPath(); ctx.arc(cx - R * 0.06, cy, R * 0.42, 0, 6.283); for (let i = 0; i < 3; i++) { const a = time * 0.4 + i * 2.094; ctx.moveTo(cx - R * 0.06, cy); ctx.lineTo(cx - R * 0.06 + Math.cos(a) * R * 0.42, cy + Math.sin(a) * R * 0.42); } ctx.stroke();
    ctx.fillStyle = '#d8dde6'; ctx.beginPath(); ctx.arc(cx - R * 0.06, cy, R * 0.1, 0, 6.283); ctx.fill();
    // the security lasers
    if (!reduce) for (let i = 0; i < 3; i++) { const y = Math.round(top + 40 + i * 14 + Math.sin(time * 1.3 + i * 2) * 6); if (Math.sin(time * 20 + i * 5) < -0.95) continue; ctx.fillStyle = 'rgba(255,40,40,0.7)'; ctx.fillRect(0, y, W, 1); halo(6, y, 6, '255,60,60', 0.8); halo(W - 6, y, 6, '255,60,60', 0.8); }
  }

  // ---- the hall of fame: banners, framed shirts and glass cases of glowing trophies
  function spTrophy(kind) {
    return spArt('tro' + kind, 24, 28, (x, w, h) => {
      x.fillStyle = '#000000'; const P = (...pts) => { x.beginPath(); for (let i = 0; i < pts.length; i += 2) i ? x.lineTo(pts[i], pts[i + 1]) : x.moveTo(pts[i], pts[i + 1]); x.fill(); }, C = (cx, cy, rx, ry) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 6.283); x.fill(); };
      const base = () => { x.fillRect(7, 21, 10, 3); x.fillRect(5, 24, 14, 4); };
      if (kind === 0) { x.fillRect(5, 1, 14, 2); x.beginPath(); x.ellipse(12, 3, 7, 8, 0, 0, Math.PI); x.fill(); x.strokeStyle = '#000'; x.lineWidth = 2; x.beginPath(); x.arc(4, 6, 3, Math.PI * 0.5, Math.PI * 1.5); x.stroke(); x.beginPath(); x.arc(20, 6, 3, -Math.PI * 0.5, Math.PI * 0.5); x.stroke(); x.fillRect(11, 10, 3, 11); x.fillRect(9, 14, 7, 2); base(); }
      else if (kind === 1) { C(12, 7, 6.5, 6.5); x.fillRect(10, 13, 5, 8); base(); }
      else if (kind === 2) { C(12, 5, 5, 5); P(5, 11, 19, 11, 16, 18, 8, 18); x.fillRect(11, 18, 3, 3); base(); }
      else if (kind === 3) { C(12, 10, 10, 10); x.fillRect(10, 19, 5, 3); base(); }
      else if (kind === 4) { P(8, 2, 14, 2, 14, 12, 21, 15, 21, 19, 6, 19, 8, 12); base(); }
      else if (kind === 5) { x.fillRect(1, 9, 22, 8); C(12, 13, 7, 7); base(); }
      else if (kind === 6) { C(12, 2, 2, 2); C(12, 5, 5, 2); C(12, 12, 7, 8); x.fillRect(10, 19, 5, 3); base(); }
      else { x.beginPath(); x.arc(12, 12, 9, Math.PI, 0); x.fill(); x.fillRect(3, 12, 18, 5); x.fillRect(10, 17, 4, 4); base(); }
      // shade it like polished metal: a highlight down the left, darker toward the right, a dark rim
      const im = x.getImageData(0, 0, w, h), d = im.data, ramp = [[138, 94, 18], [243, 198, 78], [255, 242, 184], [224, 169, 46], [154, 106, 20]], at = (i, j) => i >= 0 && j >= 0 && i < w && j < h && d[(j * w + i) * 4 + 3] > 100;
      const out = new Uint8ClampedArray(d.length);
      for (let j = 0; j < h; j++) { let a = -1, b = -1; for (let i = 0; i < w; i++) if (at(i, j)) { if (a < 0) a = i; b = i; } if (a < 0) continue;
        for (let i = a; i <= b; i++) { if (!at(i, j)) continue; const t = (i - a) / Math.max(1, b - a), c = !at(i - 1, j) || !at(i + 1, j) || !at(i, j - 1) || !at(i, j + 1) ? [92, 61, 8] : ramp[t < 0.15 ? 0 : t < 0.38 ? 1 : t < 0.5 ? 2 : t < 0.8 ? 3 : 4], o = (j * w + i) * 4; out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = 255; } }
      d.set(out); x.putImageData(im, 0, 0);
      if (kind === 5) { x.fillStyle = '#3a1a0c'; x.fillRect(1, 10, 4, 6); x.fillRect(19, 10, 4, 6); }
      if (kind === 1) { x.fillStyle = '#5c3d08'; x.fillRect(11, 5, 3, 3); x.fillRect(8, 9, 2, 2); x.fillRect(15, 9, 2, 2); }
      if (kind === 3) { x.strokeStyle = 'rgba(92,61,8,0.8)'; x.lineWidth = 1; x.beginPath(); x.arc(12, 10, 6, 0, 6.283); x.stroke(); }
      x.fillStyle = '#fffbe6'; x.fillRect(8, 4, 1, 2);
    });
  }
  const spJersey = i => spArt('jer' + i, 26, 30, x => {
    const t = TEAM[i % TEAM.length]; x.fillStyle = '#c9a24a'; x.fillRect(0, 0, 26, 30); x.fillStyle = '#8a6a2a'; x.fillRect(1, 1, 24, 28); x.fillStyle = '#1a1410'; x.fillRect(2, 2, 22, 26);
    x.fillStyle = t[0]; x.fillRect(8, 6, 10, 15); x.fillRect(4, 6, 4, 5); x.fillRect(18, 6, 4, 5); x.fillStyle = '#1a1410'; x.fillRect(11, 6, 4, 1);
    const n = String((i * 3 + 7) % 23 + 1); spTxt(x, n, Math.round(13 - spTW(n, 1) / 2), 10, 1, t[1]); x.fillStyle = '#c9a24a'; x.fillRect(9, 24, 8, 2);
  });
  const spBanner = i => spArt('ban' + i, 20, 36, x => {
    const t = TEAM[i % TEAM.length]; x.fillStyle = '#8b6a2a'; x.fillRect(0, 0, 20, 2); x.fillStyle = t[1]; x.beginPath(); x.moveTo(1, 2); x.lineTo(19, 2); x.lineTo(19, 28); x.lineTo(10, 35); x.lineTo(1, 28); x.fill();
    x.fillStyle = t[0]; x.beginPath(); x.moveTo(2, 3); x.lineTo(18, 3); x.lineTo(18, 27); x.lineTo(10, 33); x.lineTo(2, 27); x.fill();
    const k = i % 5; x.fillStyle = '#ffffff';
    if (k === 0) { x.fillRect(7, 6, 6, 6); x.fillRect(6, 7, 8, 4); x.fillStyle = '#111'; x.fillRect(9, 8, 2, 2); }
    else if (k === 1) { x.fillStyle = '#ff8a2a'; x.fillRect(7, 6, 6, 6); x.fillRect(6, 7, 8, 4); x.fillStyle = '#111'; x.fillRect(9, 6, 1, 6); x.fillRect(6, 9, 8, 1); }
    else if (k === 2) { x.fillRect(7, 5, 6, 1); x.fillRect(7, 11, 6, 1); x.fillRect(6, 6, 1, 5); x.fillRect(13, 6, 1, 5); x.fillRect(9, 12, 2, 4); x.fillStyle = '#d8ff3a'; x.fillRect(14, 12, 2, 2); }
    else if (k === 3) { x.fillStyle = '#111'; x.fillRect(6, 13, 6, 2); x.fillStyle = '#ffffff'; x.fillRect(12, 5, 1, 9); x.fillRect(12, 13, 4, 1); }
    else { x.fillRect(5, 13, 2, 2); x.fillRect(7, 11, 2, 2); x.fillRect(9, 9, 2, 2); x.fillRect(11, 7, 2, 2); x.fillRect(13, 5, 2, 2); x.fillRect(13, 13, 2, 2); }
    spTxt(x, (hsh(i, 1530) < 0.5 ? '19' : '20') + String(Math.floor(hsh(i, 1531) * 90) + 10).slice(-2), 3, 19, 1, t[1]);
  });
  const spPortrait = i => spArt('por' + i, 14, 16, x => { const t = TEAM[i % TEAM.length]; x.fillStyle = '#c9a24a'; x.fillRect(0, 0, 14, 16); x.fillStyle = '#3a2a10'; x.fillRect(1, 1, 12, 14); x.globalAlpha = 0.35; x.fillStyle = t[0]; x.fillRect(1, 1, 12, 14); x.globalAlpha = 1; x.fillStyle = t[0]; x.fillRect(3, 11, 8, 4); x.fillStyle = t[1]; x.fillRect(6, 11, 2, 2); x.fillStyle = SKIN[i % SKIN.length]; x.fillRect(5, 5, 4, 5); x.fillRect(6, 10, 2, 1); x.fillStyle = ['#2a1a10', '#d9a040', '#111111', '#7a3a1a'][i % 4]; x.fillRect(5, 4, 4, 2); });
  function spHall(low) {
    const top = spY(7080), bot = spY(9300); if (bot < -40 || top > H + 40) return;
    const t0 = Math.max(top, -2), t1 = Math.min(bot, H + 2), bays = W < 600 ? [W * 0.27, W * 0.73] : [W / 6, W / 2, W * 5 / 6], wide = W >= 600;
    ctx.fillStyle = '#1a110b'; ctx.fillRect(0, t0, W, t1 - t0); ctx.fillStyle = '#21160d'; for (let x = 0; x < W; x += 120) ctx.fillRect(x + 6, t0, 108, t1 - t0); ctx.fillStyle = 'rgba(255,200,120,0.05)'; for (let x = 0; x < W; x += 120) ctx.fillRect(x + 6, t0, 2, t1 - t0);
    // a field of faint gold stars on the far wall, drifting past slower than you
    { const step = 64, f = 0.8, b0 = spYP(7080, f), r0 = Math.floor((t0 - b0) / (step / mpp * f)) - 1; ctx.fillStyle = 'rgba(255,210,120,0.08)'; ctx.beginPath();
      for (let r = r0; ; r++) { const y = b0 + r * step / mpp * f; if (y > t1 + 20) break; if (y < t0 - 20) continue; for (let x = (r & 1) * 70 + 35; x < W; x += 140) for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 4 : 10; i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } }
      ctx.fill(); }
    // marble columns between the bays
    const col = spArt('col', 34, 4, x => { const g = x.createLinearGradient(0, 0, 34, 0); g.addColorStop(0, '#6e665a'); g.addColorStop(0.35, '#e9e3d6'); g.addColorStop(1, '#5a5348'); x.fillStyle = g; x.fillRect(0, 0, 34, 4); });
    for (let i = 1; i < bays.length; i++) { const x = Math.round((bays[i - 1] + bays[i]) / 2); ctx.drawImage(col, x - 17, t0, 34, t1 - t0); for (let m = 7090; m < 9300; m += 240) { const y = spY(m); if (y > -20 && y < H + 20) { ctx.fillStyle = '#c9a24a'; ctx.fillRect(x - 23, Math.round(y), 46, 12); ctx.fillStyle = '#f2ead6'; ctx.fillRect(x - 21, Math.round(y) + 12, 42, 4); } } }
    const sy = spY(7120); if (sy > -80 && sy < H + 40) { const s = spSign('HALL OF FAME', 4, '#ffd36a', '#1a110b'); spBlit(s, W / 2 - s.width / 2, sy, 1); halo(W / 2, sy + s.height / 2, 70, '255,210,90', 0.4); }
    // eight galleries, one above the other: banners or framed shirts and portraits on the upper wall, glass cases below
    for (let j = 0; j < 8; j++) {
      const L = 7330 + j * 240, y = Math.round(spY(L)); if (y < -40 || y > H + 820) continue;
      const uy = Math.round(spY(L - 196));
      if (uy > -160 && uy < H + 20) for (let i = 0; i < bays.length; i++) {
        if (j % 2 === 0) { for (const s of [-1, 1]) { const b = spBanner(j * 6 + i * 2 + (s > 0 ? 1 : 0)), x = bays[i] + s * Math.min(70, W * 0.06) + Math.sin(time * 0.8 + i + j + s) * 2; spBlit(b, x - b.width * AP / 2, uy + Math.sin(time * 1.1 + i + s) * 1.5); } }
        else { const jr = spJersey(j * 3 + i), x = bays[i]; ctx.fillStyle = '#c9a24a'; ctx.fillRect(Math.round(x) - 14, uy - 10, 28, 4); halo(x, uy - 6, 12, '255,230,170', 0.6); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, uy - 6, 0, uy + 90); g.addColorStop(0, 'rgba(255,230,170,0.18)'); g.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = g; ctx.fillRect(x - 50, uy - 6, 100, 96); ctx.globalCompositeOperation = 'source-over'; spBlit(jr, x - jr.width * AP / 2, uy);
          if (wide) for (const s of [-1, 1]) { const pr = spPortrait(j * 5 + i * 2 + (s > 0 ? 1 : 0)), px = x + s * Math.min(96, W * 0.075); spBlit(pr, px - pr.width * AP / 2, uy + 14); } }
      }
      if (y > H + 60) continue;
      ctx.fillStyle = '#3a2616'; ctx.fillRect(0, y, W, 4); ctx.fillStyle = '#140c07'; ctx.fillRect(0, y + 4, W, 26); ctx.fillStyle = 'rgba(255,220,150,0.06)'; ctx.fillRect(0, y + 4, W, 2);
      for (let i = 0; i < bays.length; i++) {
        const x = Math.round(bays[i] + (j % 2 ? 1 : -1) * Math.min(40, W * 0.03)), kind = (j * 3 + i) % 8, tr = spTrophy(kind), tw = tr.width * AP, th = tr.height * AP, pt = y - 60, ct = pt - 10 - th - 14;
        if (pt < -th - 200) continue;
        ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, ct - 150, 0, pt); g.addColorStop(0, 'rgba(255,230,160,0)'); g.addColorStop(1, 'rgba(255,230,160,0.2)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 8, ct - 150); ctx.lineTo(x + 8, ct - 150); ctx.lineTo(x + 60, pt); ctx.lineTo(x - 60, pt); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#d9d2c3'; ctx.fillRect(x - 36, pt, 72, 60); ctx.fillStyle = '#efe9dc'; ctx.fillRect(x - 42, pt - 6, 84, 8); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x + 18, pt + 2, 18, 58); ctx.fillStyle = '#c9a24a'; ctx.fillRect(x - 16, pt + 18, 32, 10); ctx.fillStyle = '#7a5a1a'; ctx.fillRect(x - 12, pt + 21, 24, 1); ctx.fillRect(x - 10, pt + 24, 20, 1);
        halo(x, pt - 6 - th / 2, Math.min(50, tw * 0.9), '255,210,90', 0.32 + 0.12 * Math.sin(time * 2 + i + j));
        const turn = kind % 3 === 0 ? Math.max(0.2, Math.abs(Math.cos(time * 0.8 + j))) : 1; ctx.drawImage(tr, Math.round(x - tw * turn / 2), Math.round(pt - 6 - th), Math.round(tw * turn), th);
        ctx.fillStyle = 'rgba(170,220,255,0.07)'; ctx.fillRect(x - 40, ct, 80, pt - 6 - ct); ctx.fillStyle = 'rgba(200,235,255,0.4)'; ctx.fillRect(x - 40, ct, 80, 1); ctx.fillRect(x - 40, ct, 1, pt - 6 - ct); ctx.fillRect(x + 39, ct, 1, pt - 6 - ct);
        ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.moveTo(x - 30, ct + 2); ctx.lineTo(x - 22, ct + 2); ctx.lineTo(x - 38, pt - 30); ctx.lineTo(x - 38, pt - 46); ctx.fill();
        ctx.fillStyle = '#fffbe6'; for (let s = 0; s < 2; s++) { const tw2 = Math.sin(time * 3 + i * 2 + j + s * 2.5); if (tw2 > 0.75) { const sx = x - tw / 3 + hsh(i * 3 + j * 7 + s, 960) * tw * 0.66, sy2 = pt - 6 - th + hsh(i * 3 + j * 7 + s, 961) * th * 0.6; ctx.fillRect(Math.round(sx) - 4, Math.round(sy2), 9, 1); ctx.fillRect(Math.round(sx), Math.round(sy2) - 4, 1, 9); } }
        // velvet ropes between the cases
        if (i < bays.length - 1) { const nx = Math.round(bays[i + 1] + (j % 2 ? 1 : -1) * Math.min(40, W * 0.03)); ctx.fillStyle = '#c9a24a'; ctx.fillRect(x + 50, y - 26, 3, 26); ctx.fillRect(nx - 53, y - 26, 3, 26); ctx.strokeStyle = '#8a1c2a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 52, y - 24); ctx.quadraticCurveTo((x + nx) / 2, y - 6, nx - 52, y - 24); ctx.stroke(); }
      }
      { const vx = mod(time * (14 + j * 2) + j * 150, W + 60) - 30, dir = j % 2 ? -1 : 1; ctx.globalAlpha = 0.85; spFig(dir > 0 ? vx : W - vx, y, 2, '#0b0705', '#0b0705', '#0b0705', time * 6, 1, dir); ctx.globalAlpha = 1; }
    }
    // a slow sheen of light sliding across the hall
    if (!low) { const sx = mod(time * 70, W + 700) - 350; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,220,160,0.04)'; ctx.beginPath(); ctx.moveTo(sx, t0); ctx.lineTo(sx + 120, t0); ctx.lineTo(sx + 320, t1); ctx.lineTo(sx + 200, t1); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
  }

  // ---- the vault: curtains of medals, hills of gold and the greatest trophy of all at the very bottom
  const SP_MET = [['#ffd34d', '#fff1a8', '#b8860b'], ['#d8dde6', '#ffffff', '#8a93a3'], ['#d08a4a', '#f2b884', '#8a4f1e']];
  const spMedal = (mt, ri) => spPix('med' + mt + ri, ['rr.....ss', '.rr...ss.', '..rr.ss..', '...rss...', '...ooo...', '..ohhmo..', '.ohhmmmo.', '.ohmmmmo.', '.ommmmdo.', '..ommdo..', '...ooo...'], { r: TEAM[ri][0], s: TEAM[ri][1], o: SP_MET[mt][2], h: SP_MET[mt][1], m: SP_MET[mt][0], d: SP_MET[mt][2] });
  const spPile = () => spArt('pile', 160, 40, x => { for (let i = 0; i < 900; i++) { const px = hsh(i, 1540) * 160, top = 40 - 34 * Math.max(0, 1 - Math.pow((px - 80) / 80, 2)) * (0.8 + 0.2 * Math.sin(px * 0.2)), py = top + Math.pow(hsh(i, 1541), 0.6) * (40 - top); x.fillStyle = ['#b8860b', '#e0a92e', '#ffd34d', '#f3c64e'][Math.floor(hsh(i, 1542) * 4)]; x.fillRect(Math.round(px), Math.round(py), 3, 2); if (hsh(i, 1543) < 0.15) { x.fillStyle = '#fff1a8'; x.fillRect(Math.round(px), Math.round(py), 1, 1); } } });
  const spBars = () => spArt('bars', 44, 20, x => { for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - r; c++) { const bx = 2 + c * 10 + r * 5, by = 20 - (r + 1) * 5; x.fillStyle = '#9a6a14'; x.fillRect(bx, by, 10, 5); x.fillStyle = '#e0a92e'; x.fillRect(bx, by + 1, 9, 3); x.fillStyle = '#ffe28a'; x.fillRect(bx + 1, by, 8, 1); } });
  let spGBP = null;
  function spVault(low) {
    const top = spY(9300); if (top > H + 40) return;
    const t0 = Math.max(top, -2);
    if (!spGBP) spGBP = ctx.createPattern(spArt('gbrick', 32, 16, x => { x.fillStyle = '#22180a'; x.fillRect(0, 0, 32, 16); for (let r = 0; r < 2; r++) for (let c = -1; c < 2; c++) { x.fillStyle = ['#3a2a0c', '#33250b', '#42300e'][Math.floor(hsh(r * 3 + c + 1, 1550) * 3)]; x.fillRect(c * 16 + (r ? 8 : 0) + 1, r * 8 + 1, 15, 7); x.fillStyle = 'rgba(255,220,140,0.12)'; x.fillRect(c * 16 + (r ? 8 : 0) + 1, r * 8 + 1, 15, 1); } }), 'repeat');
    spGBP.setTransform(new DOMMatrix([AP / 1.5, 0, 0, AP / 1.5, 0, Math.round(top)])); ctx.fillStyle = spGBP; ctx.fillRect(0, t0, W, H - t0);
    const sy = spY(9330); if (sy > -80 && sy < H + 40) { const s = spSign('THE VAULT', 4, '#ffd36a', '#22180a'); spBlit(s, W / 2 - s.width / 2, sy, 1); halo(W / 2, sy + s.height / 2, 60, '255,210,90', 0.4); }
    // curtains of medals hanging on ribbons, swaying
    const cw = low ? 72 : 48, mTop = camS - AY * mpp, mBot = camS + (H - AY) * mpp, j0 = Math.max(0, Math.floor((mTop - 9400) / 24) - 1), j1 = Math.min(Math.floor((11250 - 9400) / 24), Math.ceil((mBot - 9400) / 24) + 1);
    if (j1 >= j0) { const l0 = Math.max(spY(9390), -2), l1 = Math.min(spY(11270), H + 2); ctx.fillStyle = 'rgba(255,220,150,0.16)'; for (let x = cw / 2; x < W; x += cw) if (l1 > l0) ctx.fillRect(Math.round(x), l0, 1, l1 - l0);
      for (let c = 0, x = cw / 2; x < W; c++, x += cw) for (let j = j0; j <= j1; j++) { if (hsh(c * 131 + j, 1400) < 0.3) continue; const y = spY(9400 + j * 24), s2 = Math.sin(time * 1.4 + c * 0.6 + j * 0.25) * 3, mt = Math.floor(hsh(c * 7 + j, 1401) * 3), md = spMedal(mt, (c + j) % TEAM.length); spBlit(md, x - 4.5 * AP + s2, y); }
      for (let q = 0; q < 8; q++) { const st = Math.floor(time * 3) + q * 17, c = Math.floor(hsh(st, 1402) * W / cw), j = j0 + Math.floor(hsh(st, 1403) * (j1 - j0 + 1)); if (hsh(c * 131 + j, 1400) < 0.3) continue; const x = cw / 2 + c * cw + Math.sin(time * 1.4 + c * 0.6 + j * 0.25) * 3, y = spY(9400 + j * 24) + 7.5 * AP, a = 1 - mod(time * 3, 1); ctx.fillStyle = 'rgba(255,255,240,' + a.toFixed(2) + ')'; ctx.fillRect(Math.round(x) - 6, Math.round(y), 13, 1); ctx.fillRect(Math.round(x), Math.round(y) - 6, 1, 13); halo(x, y, 10, '255,240,180', 0.7 * a); } }
    // hills of gold with stacked bars either side
    const pile = spPile(), bars = spBars(), pw = pile.width * AP;
    for (const m of [9860, 10360, 10860, 11330, 11820]) { const y = Math.round(spY(m)); if (y < -10 || y - pile.height * AP > H + 10) continue; halo(W / 2, y - 40, 90, '255,200,90', 0.35); for (let x = -pw * 0.3, i = 0; x < W; x += pw * 0.7, i++) ctx.drawImage(pile, Math.round(x), y - pile.height * AP, pw, pile.height * AP); spBlit(bars, 8, y - bars.height * AP); spBlit(bars, W - 8 - bars.width * AP, y - bars.height * AP);
      ctx.fillStyle = '#fff6d0'; for (let q = 0; q < 6; q++) { const tw = Math.sin(time * 4 + q * 1.7 + m); if (tw < 0.8) continue; const gx = hsh(q, 1560 + m) * W, gy = y - hsh(q, 1561 + m) * 60 - 10; ctx.fillRect(Math.round(gx) - 4, Math.round(gy), 9, 1); ctx.fillRect(Math.round(gx), Math.round(gy) - 4, 1, 9); } }
    // the greatest trophy of all, turning in its own light, ringed by orbiting medals
    const fy = spY(11660);
    if (fy > -80 && fy - 600 < H) {
      const cx = W / 2, big = spTrophy(0), s = AP * (W < 600 ? 2 : 3), tw = big.width * s, th = big.height * s, cyT = fy - 80 - th / 2, beat = 0.5 + 0.5 * Math.sin(time * 2);
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,220,130,0.06)'; const RR = Math.max(W, H);
      for (let i = 0; i < (low ? 8 : 14); i++) { const a = time * 0.15 + i * 6.283 / (low ? 8 : 14); ctx.beginPath(); ctx.moveTo(cx, cyT); ctx.lineTo(cx + Math.cos(a - 0.07) * RR, cyT + Math.sin(a - 0.07) * RR); ctx.lineTo(cx + Math.cos(a + 0.07) * RR, cyT + Math.sin(a + 0.07) * RR); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over';
      halo(cx, cyT, Math.min(150, th * 0.8), '255,214,120', 0.2 + 0.1 * beat);
      const orb = (front) => { for (let i = 0; i < 10; i++) { const a = time * 0.6 + i * 0.628, sa = Math.sin(a); if ((sa > 0) !== front) continue; const md = spMedal(i % 3, i % TEAM.length), sc2 = AP * (1.3 + 0.4 * sa); ctx.drawImage(md, Math.round(cx + Math.cos(a) * tw * 0.95 - md.width * sc2 / 2), Math.round(cyT + sa * th * 0.18 - md.height * sc2 / 2), md.width * sc2, md.height * sc2); } };
      orb(false);
      ctx.fillStyle = '#d9d2c3'; ctx.fillRect(Math.round(cx - 120), Math.round(fy - 40), 240, 40); ctx.fillStyle = '#efe9dc'; ctx.fillRect(Math.round(cx - 90), Math.round(fy - 80), 180, 40); ctx.fillStyle = '#c9a24a'; ctx.fillRect(Math.round(cx - 124), Math.round(fy - 44), 248, 4); ctx.fillRect(Math.round(cx - 94), Math.round(fy - 84), 188, 4);
      ctx.drawImage(big, Math.round(cx - tw / 2), Math.round(fy - 84 - th), tw, th);
      orb(true);
      ctx.fillStyle = '#fffbe6'; for (let q = 0; q < 6; q++) { const t2 = Math.sin(time * 3 + q * 1.3); if (t2 < 0.7) continue; const sx = cx + (hsh(q, 1570) - 0.5) * tw, sy2 = fy - 84 - th + hsh(q, 1571) * th * 0.7; ctx.fillRect(Math.round(sx) - 6, Math.round(sy2), 13, 1); ctx.fillRect(Math.round(sx), Math.round(sy2) - 6, 1, 13); halo(sx, sy2, 10, '255,250,220', 0.8); }
      const pl = spSign('THE OBSCURA CUP', 3, '#ffd36a', '#22180a'); spBlit(pl, cx - pl.width / 2, fy + 10, 1);
    }
  }

  // ---- things that float over every layer: ticker-tape, light beams, the drone camera, haze, sparks and the deep golden glow
  let spHazeP = null;
  function spHaze(a) {
    if (a <= 0.003 || window.__low) return;
    if (!spHazeP) spHazeP = ctx.createPattern(spArt('haze', 128, 128, x => { for (let i = 0; i < 24; i++) { const hx = hsh(i, 1600) * 128, hy = hsh(i, 1601) * 128, r = 14 + hsh(i, 1602) * 30; for (const ox of [-128, 0, 128]) for (const oy of [-128, 0, 128]) { const g = x.createRadialGradient(hx + ox, hy + oy, 0, hx + ox, hy + oy, r); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(hx + ox - r, hy + oy - r, r * 2, r * 2); } } }), 'repeat');
    spHazeP.setTransform(new DOMMatrix([4, 0, 0, 4, -mod(time * 10, 512), -mod(camS / mpp * 0.4, 512)]));
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = spHazeP; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  function spOverlay(dt, low, dim) {
    // ticker-tape over the stands
    if (camS > 1100 && camS < 4600) { const a = Math.min(1, (camS - 1100) / 300) * Math.min(1, (4600 - camS) / 300); for (let i = 0; i < (low ? 35 : 70); i++) { const y = mod(hsh(i, 940) * H + time * (40 + hsh(i, 941) * 60), H + 20) - 10, x = hsh(i, 942) * W + Math.sin(time * 2 + i) * 14, w = 3 + 5 * Math.abs(Math.cos(time * 4 + i)); ctx.fillStyle = (i % 3 ? '#ffffff' : TEAM[i % TEAM.length][0]); ctx.globalAlpha = a * 0.85; ctx.fillRect(sn(x), sn(y), w, 3); } ctx.globalAlpha = 1; }
    // floodlight beams raking down across the stands
    const sA = spCl((camS - 1150) / 250) * spCl((4500 - camS) / 250);
    if (sA > 0) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(225,235,255,0.11)'); g.addColorStop(1, 'rgba(225,235,255,0)'); ctx.fillStyle = g; ctx.globalAlpha = sA * (1 - 0.8 * dim);
      for (let i = 0; i < 3; i++) { const x0 = W * (0.12 + i * 0.36) + Math.sin(time * 0.2 + i * 2) * 40; ctx.beginPath(); ctx.moveTo(x0 - 30, -10); ctx.lineTo(x0 + 30, -10); ctx.lineTo(x0 + 240 + i * 30, H); ctx.lineTo(x0 + 20, H); ctx.fill(); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      // the drone camera buzzing over the crowd
      const dx = W * 0.5 + Math.sin(time * 0.23) * W * 0.42, dy = H * 0.22 + Math.sin(time * 0.61) * H * 0.08; ctx.fillStyle = '#1b2230'; ctx.fillRect(Math.round(dx) - 8, Math.round(dy) - 3, 16, 7); ctx.fillRect(Math.round(dx) - 15, Math.round(dy) - 5, 30, 2); ctx.fillStyle = 'rgba(200,210,230,0.55)'; const bl = Math.floor(time * 40) % 2 * 3; ctx.fillRect(Math.round(dx) - 21 + bl, Math.round(dy) - 7, 10, 1); ctx.fillRect(Math.round(dx) + 11 - bl, Math.round(dy) - 7, 10, 1); if (Math.sin(time * 5) > 0.3) halo(dx, dy + 5, 6, '255,60,60', 0.9); }
    // haze hanging in the light
    spHaze((camS < 4400 ? 0.07 * spCl((camS - 850) / 200) : camS < 5400 ? 0.03 : camS < 6900 ? 0.05 : 0.045));
    // world-anchored confetti and sparks
    const g2 = 160 * dt;
    for (let pi = 0; pi < SP_PP.length; pi++) { const p = SP_PP[pi]; if (p.l <= 0) continue; p.l -= dt; if (p.k === 0) { p.vx *= 1 - 1.5 * dt; p.vy += (40 - p.vy) * 1.8 * dt; p.x += (p.vx + Math.sin(time * 4 + p.r * 3) * 25) * dt; p.r += dt * 7; } else { p.vy += g2; p.vx *= 1 - 0.8 * dt; p.x += p.vx * dt; } p.m += p.vy * dt * mpp;
      const y = spY(p.m); if (y < -10 || y > H + 10) continue; ctx.fillStyle = p.c; ctx.globalAlpha = Math.min(1, p.l / Math.min(1, p.L * 0.5));
      if (p.k === 0) { const w = 2 + 6 * Math.abs(Math.cos(p.r)); ctx.fillRect(Math.round(p.x - w / 2), Math.round(y) - 2, Math.round(w), 4); } else { ctx.fillRect(Math.round(p.x) - 1, Math.round(y) - 1, 3, 3); if (!low && pi % 5 === 0) halo(p.x, y, 7, '255,230,180', 0.6 * Math.min(1, p.l)); } }
    ctx.globalAlpha = 1;
    // glitter drifting down through the vault, and the gold glow rising from below
    if (camS > 7000) {
      const a = spCl((camS - 9000) / 600); if (a > 0) { ctx.fillStyle = '#ffe9a0'; for (let i = 0; i < (low ? 30 : 60); i++) { const y = mod(hsh(i, 1610) * H + time * (20 + hsh(i, 1611) * 30), H + 20) - 10, x = hsh(i, 1612) * W + Math.sin(time + i) * 10, tw = 0.5 + 0.5 * Math.sin(time * 5 + i * 2); ctx.globalAlpha = a * tw; ctx.fillRect(sn(x), sn(y), 2, 2); } ctx.globalAlpha = 1; }
      ctx.globalCompositeOperation = 'lighter'; const deep = Math.min(1, (camS - 7000) / 4000), cg = ctx.createRadialGradient(W / 2, H * 1.1, 0, W / 2, H * 1.1, H); cg.addColorStop(0, 'rgba(255,210,100,' + (0.45 * deep).toFixed(2) + ')'); cg.addColorStop(1, 'rgba(255,180,60,0)'); ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
    }
  }

  function stadiumWorld(dt, sy) {
    if (window.__spProf === 2) ctx.getImageData(0, 0, 1, 1); // profiling only: flush queued GPU work so the timing below includes rasterising
    const prof = window.__spProf ? performance.now() : 0, low = !!window.__low;
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const bg = ctx.createLinearGradient(0, 0, 0, H); for (const s of [0, 0.5, 1]) bg.addColorStop(s, 'rgb(' + spCol(camS + (s * H - AY) * mpp).join(',') + ')'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // every so often the floodlights go down and the phones come out
    const tm = mod(time, 34), dim = reduce ? 0 : spCl(Math.min((tm - 24) / 1.5, (33 - tm) / 1.5));
    spMatchStep(Math.min(0.05, Math.max(0, dt || 0)));
    const skyA = spCl(1 - (camS - 500) / 700);
    if (skyA > 0) spSkyDraw(skyA, low);
    spStreet(low); spRoof(low, dim); spStands(low, dim); spPitch(low); spTunnel(low); spVaultDoor(); spHall(low); spVault(low);
    spOverlay(Math.min(0.05, Math.max(0, dt || 0)), low, dim);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (prof) { if (window.__spProf === 2) { fxFlush(); ctx.getImageData(0, 0, 1, 1); } window.__spM = SPM; const d = performance.now() - prof; (window.__spS || (window.__spS = [])).push(d); if (window.__spS.length > 240) window.__spS.shift(); window.__spT = window.__spT == null ? d : window.__spT * 0.95 + d * 0.05; window.__spMax = Math.max(window.__spMax || 0, d); }
  }
  // ---- Geography: a dive through the whole planet, sky to core
  const GEO_COL = [[-600, [5, 8, 28]], [-250, [14, 24, 64]], [0, [32, 64, 134]], [450, [104, 162, 226]], [800, [255, 186, 142]], [1150, [196, 160, 196]], [1350, [150, 180, 222]], [1800, [255, 168, 116]], [1990, [255, 136, 94]], [2000, [44, 140, 178]], [2800, [16, 80, 126]], [3900, [6, 30, 66]], [5200, [2, 9, 24]], [6900, [3, 4, 10]], [7000, [52, 32, 20]], [8800, [86, 34, 12]], [10400, [168, 64, 16]], [11400, [200, 98, 30]], [12000, [236, 146, 58]]];
  function geoCol(m) {
    if (m <= GEO_COL[0][0]) return GEO_COL[0][1]; const L = GEO_COL[GEO_COL.length - 1]; if (m >= L[0]) return L[1];
    for (let i = 0; i < GEO_COL.length - 1; i++) { const a = GEO_COL[i], b = GEO_COL[i + 1]; if (m <= b[0]) { const t = (m - a[0]) / Math.max(1, b[0] - a[0]); return a[1].map((v, k) => Math.round(v + (b[1][k] - v) * t)); } }
    return L[1];
  }
  const rgb = (c, a) => a == null ? 'rgb(' + c.join(',') + ')' : 'rgba(' + c.join(',') + ',' + a.toFixed(3) + ')';
  const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const fish = []; let fishInit = false;
  // small helpers: clamp, a fade-in/fade-out window on depth, parallax y for a depth, a dither threshold
  const gcl = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const gOn = (a0, a1, b0, b1) => gcl((camS - a0) / (a1 - a0)) * gcl((b1 - camS) / (b1 - b0));
  let gpx = 0;
  const gy = (m, f) => AY + (m / mpp - gpx) * f;
  const gDi = (x, y) => BAYER[(x & 3) + ((y & 3) << 2)];
  const gR = new Float32Array(4096), gFP = new Float32Array(720);
  // offscreen art, painted once per screen size
  const gC = {}; let gCK = '';
  function gCache(name, w, h, paint) {
    const k = W + 'x' + H; if (k !== gCK) { gCK = k; for (const n in gC) delete gC[n]; }
    let c = gC[name]; if (!c) { c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); const g = c.getContext('2d'); g.imageSmoothingEnabled = false; paint(g, c.width, c.height); gC[name] = c; }
    return c;
  }
  // a pixel moon, lit from the low sun on the right
  const gMoon = () => gCache('moon', 30, 30, g => {
    const CR = [[10, 9, 4], [18, 18, 3], [8, 19, 3], [20, 8, 2], [14, 24, 2], [23, 14, 2]];
    for (let y = 0; y < 30; y++) for (let x = 0; x < 30; x++) {
      const dx = (x - 14.5) / 13.5, dy = (y - 14.5) / 13.5, rr = dx * dx + dy * dy; if (rr > 1) continue;
      let v = 0.18 + 0.82 * gcl(dx * 0.7 - dy * 0.25 + Math.sqrt(1 - rr) * 0.6);
      for (const [cx, cy, r] of CR) { const q = ((x - cx) ** 2 + (y - cy) ** 2) / (r * r); if (q < 1) v *= q > 0.55 ? 1.12 : 0.78; }
      const lv = Math.min(4, Math.floor(v * 4 + gDi(x, y))) / 4; g.fillStyle = rgb(mixc([52, 58, 96], [244, 246, 255], lv)); g.fillRect(x, y, 1, 1);
    }
  });
  // the Milky Way: a dithered band of dust and stars at two screen pixels per dot
  const gMilky = () => gCache('milky', W / 2, H * 0.45, (g, w, h) => {
    const im = g.createImageData(w, h), d = im.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = x / w, c = h * (0.82 - 0.62 * u) + Math.sin(u * 7) * h * 0.05, dd = (y - c) / (h * 0.15), core = Math.exp(-dd * dd); if (core < 0.04) continue;
      const n = hsh(x * 1.7 + y * 0.31, y * 0.13 + 7), lane = Math.exp(-((dd + 0.12 + 0.3 * Math.sin(u * 11)) ** 2) / 0.05), star = n > 0.985;
      const lv = star ? 1 : Math.floor((core * (0.3 + 0.7 * n) * (1 - 0.85 * lane)) * 4 + gDi(x, y)) / 4; if (lv <= 0) continue;
      const i = (y * w + x) * 4, warm = core * core; d[i] = 150 + 105 * warm; d[i + 1] = 140 + 80 * warm; d[i + 2] = 235 + 20 * warm; d[i + 3] = star ? 255 : lv * 110;
    }
    g.putImageData(im, 0, 0);
  });
  // a vertical aurora ray: clear at the top, bright fringe at the foot with a pink hem
  const AUR = [[90, 255, 170], [80, 210, 255], [200, 120, 255]];
  const gAur = k => gCache('aur' + k, 1, 96, (g, w, h) => { const C = AUR[k], gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, rgb(C, 0)); gr.addColorStop(0.5, rgb(C, 0.3)); gr.addColorStop(0.88, rgb(C, 0.9)); gr.addColorStop(0.95, 'rgba(235,255,245,1)'); gr.addColorStop(1, 'rgba(255,110,170,0.7)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  // a far-off thunderhead, lit gold on its sunward side
  const gStorm = () => gCache('storm', 120, 84, g => {
    const P = [], r = rng(5);
    for (let j = 0; j < 8; j++) { const cy = 74 - j * 7.5, half = 30 - j * 2.6; for (let k = 0; k < 4; k++) P.push([44 + (k / 3 - 0.5) * 2 * half + (r() - 0.5) * 6, cy + (r() - 0.5) * 4, 9 + r() * 5 - j * 0.4]); }
    for (let k = 0; k < 13; k++) { const u = k / 12; P.push([30 + u * 86, 14 + u * 4 + (r() - 0.5) * 2, 9 - u * 5]); }
    const pass = (c, dx, dy, f) => { g.fillStyle = c; g.beginPath(); for (const [x, y, rr] of P) { g.moveTo(x + dx * rr + rr * f, y + dy * rr); g.arc(x + dx * rr, y + dy * rr, rr * f, 0, 6.283); } g.fill(); };
    pass('#6f638f', 0, 0.25, 1.05); pass('#a690b8', 0, 0, 0.95); pass('#dcbccb', 0.22, -0.2, 0.68); pass('#fff0e2', 0.36, -0.36, 0.34);
    g.globalCompositeOperation = 'destination-out'; g.fillRect(0, 0, 120, 7); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(70,56,104,0.85)'; g.fillRect(0, 76, 120, 8); g.fillStyle = 'rgba(70,56,104,0.35)'; g.fillRect(0, 70, 120, 6);
  });
  const BAL = [['#e8453c', '#ffd23f'], ['#2f7fd6', '#f4f1e8'], ['#8a4fd0', '#ff9f43']];
  const gBalloon = k => gCache('bal' + k, 15, 24, g => {
    for (let y = 0; y < 17; y++) { const hw = y <= 8 ? 7 * Math.sqrt(Math.max(0, 1 - ((8 - y) / 8.6) ** 2)) : 7 - (y - 8) * 0.55;
      for (let x = 0; x < 15; x++) { const u = (x + 0.5 - 7.5) / hw; if (Math.abs(u) > 1) continue;
        const st = Math.floor((Math.asin(u) / Math.PI + 0.5) * 6) % 2; g.fillStyle = BAL[k][st]; g.fillRect(x, y, 1, 1);
        if (u < -0.5) { g.fillStyle = 'rgba(20,10,40,0.3)'; g.fillRect(x, y, 1, 1); } else if (u > 0.2 && u < 0.6 && y > 1 && y < 8) { g.fillStyle = 'rgba(255,255,230,0.35)'; g.fillRect(x, y, 1, 1); } } }
    g.fillStyle = '#3a2a1c'; g.fillRect(5, 17, 1, 2); g.fillRect(9, 17, 1, 2); g.fillStyle = '#8a5a2b'; g.fillRect(5, 19, 5, 4); g.fillStyle = '#5e3a1a'; g.fillRect(5, 19, 5, 1);
  });
  // a soft dithered puff of cloud for the wisps that rush past
  const gPuff = () => gCache('puff', 96, 36, (g, w, h) => { g.save(); g.scale(1, h / w); const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,246,240,0.9)'); gr.addColorStop(0.6, 'rgba(255,240,236,0.45)'); gr.addColorStop(1, 'rgba(255,240,236,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.restore(); });
  // sunlight bent by the waves: a tiling net of caustics
  const gCaus = () => gCache('caus', 256, 256, g => {
    const pts = []; const r = rng(77); for (let i = 0; i < 30; i++) pts.push([r() * 128, r() * 128]);
    g.fillStyle = 'rgba(200,250,255,1)';
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) { let d1 = 1e9, d2 = 1e9; for (const [px2, py2] of pts) { let dx = Math.abs(x - px2), dy = Math.abs(y - py2); if (dx > 64) dx = 128 - dx; if (dy > 64) dy = 128 - dy; const d = dx * dx + dy * dy; if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
      const e = Math.sqrt(d2) - Math.sqrt(d1); if (e < 1.1 || (e < 2.2 && gDi(x, y) > 0.7)) g.fillRect(x * 2, y * 2, 2, 2); }
  });
  // coral heads, drawn once each
  const CORAL_C = ['#ff6f91', '#ffc75f', '#ff9671', '#c34a36', '#845ec2', '#00c9a7', '#f9f871'];
  const gCoral = (kind, ci, v) => gCache('cor' + kind + '_' + ci + '_' + v, 44, 52, g => {
    g.fillStyle = CORAL_C[ci]; const x = 22, y = 50;
    if (kind === 0) { for (let b = 0; b < 7; b++) { const a2 = -Math.PI / 2 + (b - 3) * 0.32; for (let s = 0; s < 30; s += 3) g.fillRect(Math.round(x + Math.cos(a2) * s), Math.round(y + Math.sin(a2) * s), 3, 3); } }
    else if (kind === 1) { g.beginPath(); g.arc(x, y - 12, 16, Math.PI, 0); g.fill(); g.fillRect(x - 16, y - 12, 32, 12); g.fillStyle = 'rgba(0,0,0,0.22)'; for (let s = 0; s < 5; s++) for (let t = 0; t < 3; t++) g.fillRect(x - 12 + s * 6, y - 22 + t * 6 + (s % 2) * 3, 4, 2); g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(x - 8, y - 25, 10, 2); }
    else { for (let b = 0; b < 4; b++) { const hh = 20 + hsh(v * 4 + b, 863) * 26, bx = x + (b - 1.5) * 8; g.fillRect(bx, y - hh, 5, hh); g.fillRect(bx - 2, y - hh, 9, 5); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(bx, y - hh + 1, 5, 2); g.fillStyle = CORAL_C[ci]; } }
  });
  // rock strata for the crust: six bands with grain and pebbles, tiled down the screen
  const STRATA = [[92, 58, 36], [120, 80, 48], [76, 48, 32], [138, 98, 60], [104, 70, 44], [66, 42, 30]];
  const STRATA_H = [44, 72, 38, 80, 52, 74];
  const gStrata = () => gCache('strata', W, 360, (g, w) => {
    const flat = document.createElement('canvas'); flat.width = w; flat.height = 360; const f = flat.getContext('2d'), r = rng(31); let y0 = 0;
    for (let b = 0; b < 6; b++) {
      const c = STRATA[b], bh = STRATA_H[b]; f.fillStyle = rgb(c); f.fillRect(0, y0, w, bh);
      f.fillStyle = rgb(mixc(c, [255, 230, 200], 0.12)); for (let i = 0; i < w * bh / 85; i++) f.fillRect((r() * w) & ~1, (y0 + r() * bh) & ~1, 2, 2);
      f.fillStyle = rgb(mixc(c, [0, 0, 0], 0.25)); for (let i = 0; i < w * bh / 85; i++) f.fillRect((r() * w) & ~1, (y0 + r() * bh) & ~1, 2, 2);
      if (b % 2) for (let i = 0; i < w / 30; i++) { const x = r() * w | 0, y = y0 + 6 + r() * (bh - 14) | 0, z = 3 + r() * 5 | 0; f.fillStyle = rgb(mixc(c, [210, 190, 170], 0.35)); f.fillRect(x, y, z * 2, z); f.fillStyle = rgb(mixc(c, [0, 0, 0], 0.4)); f.fillRect(x, y + z - 1, z * 2, 1); }
      else for (let k = 0; k < 3; k++) { f.fillStyle = rgb(mixc(c, [0, 0, 0], 0.12)); f.fillRect(0, y0 + Math.round(bh * (k + 1) / 4), w, 1); }
      f.fillStyle = rgb(mixc(c, [0, 0, 0], 0.4)); for (let x = 0; x < w; x += 3) f.fillRect(x, y0 + Math.round(Math.sin(x * 0.03 + b) * 3 + Math.sin(x * 0.011 + b * 2) * 3), 3, 2);
      f.fillStyle = rgb(mixc(c, [255, 240, 210], 0.2)); for (let x = 0; x < w; x += 3) f.fillRect(x, y0 + 2 + Math.round(Math.sin(x * 0.03 + b) * 3 + Math.sin(x * 0.011 + b * 2) * 3), 3, 1);
      y0 += bh;
    }
    for (let x = 0; x < w; x += 3) { const dy = Math.round(16 * Math.sin(x / w * Math.PI * 1.6 + 0.4) + 6 * Math.sin(x / w * Math.PI * 5.3)), cw = Math.min(3, w - x); for (const o of [-360, 0, 360]) g.drawImage(flat, x, 0, cw, 360, x, dy + o, cw, 360); }
  });
  // the mantle's slow convection: cells of darker rock with glowing seams, tiled
  const gMcell = () => gCache('mcell', 384, 384, g => {
    const pts = [], T = new Uint8Array(128 * 128); for (let i = 0; i < 9; i++) pts.push([((i % 3) + 0.5) * 128 / 3 + (hsh(i, 933) - 0.5) * 22 + ((i / 3 | 0) % 2) * 14, ((i / 3 | 0) + 0.5) * 128 / 3 + (hsh(i, 934) - 0.5) * 22]);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) { let d1 = 1e9, d2 = 1e9; for (const [px2, py2] of pts) { let dx = Math.abs(x - px2), dy = Math.abs(y - py2); if (dx > 64) dx = 128 - dx; if (dy > 64) dy = 128 - dy; const d = dx * dx + dy * dy; if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
      const e = Math.sqrt(d2) - Math.sqrt(d1), f1 = Math.sqrt(d1), b = gDi(x, y); T[y * 128 + x] = e < 1 ? 1 : e < 2.4 ? 2 : f1 < 9 ? 3 : 0; }
    for (const [k, c] of [[3, 'rgba(40,10,4,0.16)'], [2, 'rgba(255,110,30,0.16)'], [1, 'rgba(255,180,80,0.45)']]) { g.fillStyle = c; for (let i = 0; i < T.length; i++) if (T[i] === k) g.fillRect((i & 127) * 3, (i >> 7) * 3, 3, 3); }
  });
  // one crystal: a hexagonal prism seen side-on, a lit facet and a shadowed one
  function gXtal(x, y, w, h, ang, cl, cd) {
    const ux = Math.sin(ang), uy = -Math.cos(ang), vx = -uy, vy = ux, hw = w / 2;
    ctx.fillStyle = cl; ctx.beginPath(); ctx.moveTo(x - vx * hw, y - vy * hw); ctx.lineTo(x - vx * hw + ux * h * 0.78, y - vy * hw + uy * h * 0.78); ctx.lineTo(x + ux * h, y + uy * h); ctx.lineTo(x, y); ctx.fill();
    ctx.fillStyle = cd; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + ux * h, y + uy * h); ctx.lineTo(x + vx * hw + ux * h * 0.78, y + vy * hw + uy * h * 0.78); ctx.lineTo(x + vx * hw, y + vy * hw); ctx.fill();
  }
  // a whale, nose along +x; humpback by default (long flippers, knobbly head), a sperm whale with sperm = true
  function gWhale(x, y, s, ang, body, belly, sperm) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, Math.abs(s));
    const fl = Math.sin(time * 1.3) * 7;
    ctx.fillStyle = body; ctx.beginPath();
    if (sperm) { ctx.moveTo(-62, 0); ctx.quadraticCurveTo(-40, -10, -10, -13); ctx.lineTo(40, -15); ctx.quadraticCurveTo(64, -15, 64, -2); ctx.lineTo(64, 6); ctx.quadraticCurveTo(62, 12, 52, 12); ctx.lineTo(20, 12); ctx.lineTo(48, 9); ctx.lineTo(18, 13); ctx.quadraticCurveTo(-30, 12, -62, 2); }
    else { ctx.moveTo(-62, -1); ctx.quadraticCurveTo(-30, -10, 0, -14); ctx.quadraticCurveTo(40, -15, 60, -4); ctx.quadraticCurveTo(66, 0, 60, 5); ctx.quadraticCurveTo(30, 16, 0, 15); ctx.quadraticCurveTo(-35, 10, -62, 2); }
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-78, -12 + fl); ctx.lineTo(-74, 0 + fl * 0.5); ctx.lineTo(-78, 12 + fl); ctx.fill();
    if (!sperm) { const pf = Math.sin(time * 0.9) * 0.25; ctx.save(); ctx.translate(26, 9); ctx.rotate(2.3 + pf); ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(40, -3); ctx.lineTo(46, 0); ctx.lineTo(40, 3); ctx.lineTo(0, 5); ctx.fill(); ctx.fillStyle = belly; ctx.fillRect(4, 1, 36, 2); ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 0; k < 4; k++) ctx.fillRect(8 + k * 9, -4, 2, 2); ctx.restore();
      ctx.fillStyle = body; ctx.fillRect(-26, -12, 7, 3); ctx.fillStyle = belly; ctx.beginPath(); ctx.moveTo(56, 6); ctx.quadraticCurveTo(30, 15, 0, 14); ctx.lineTo(0, 10); ctx.quadraticCurveTo(30, 10, 56, 4); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 0; k < 4; k++) ctx.fillRect(10 + k * 9, 9 + (k > 1 ? 1 : 0), 6, 1); ctx.fillStyle = 'rgba(255,255,255,0.2)'; for (let k = 0; k < 4; k++) ctx.fillRect(42 + k * 4, -10 + k * 2, 2, 2); }
    else { ctx.fillStyle = belly; ctx.fillRect(-40, -6, 70, 1); ctx.fillRect(-30, -2, 55, 1); ctx.fillRect(-20, 2, 40, 1); }
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(sperm ? 30 : 46, sperm ? 2 : 2, 2, 2);
    ctx.restore();
  }
  // splashes: spray thrown up and falling back, worked out from the moment of impact so nothing has to be stored
  function gSplash(x, y, t, n, pw, seed) {
    if (t < 0 || t > 1.4) return; ctx.fillStyle = '#ffffff';
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (hsh(k, seed) - 0.5) * 1.8, v = pw * (0.5 + hsh(k, seed + 1)), sx = x + Math.cos(a) * v * t, sy = y + Math.sin(a) * v * t + 260 * t * t; if (sy > y + 4) continue; ctx.globalAlpha = gcl(1 - t / 1.4); ctx.fillRect(sn(sx), sn(sy), k % 3 ? 2 : 3, k % 3 ? 2 : 3); }
    ctx.globalAlpha = 1;
  }

  // ---------- night sky above the world: Milky Way, stars, aurora, the moon ----------
  const STAR_C = ['#ffffff', '#cfe0ff', '#ffe6c4', '#d8c8ff'];
  function gSpace(lo) {
    const st = gcl(1 - (camS + 150) / 700), sky = gcl(1 - (camS + 100) / 950);
    if (st > 0 && !lo) { const mw = gMilky(); ctx.globalAlpha = st * 0.95; ctx.drawImage(mw, 0, sn(-H * 0.02 - gpx * 0.05), W, mw.height * 2); }
    if (st > 0) {
      const n = lo ? 72 : 168;
      for (let c = 0; c < 4; c++) { ctx.fillStyle = STAR_C[c];
        for (let i = c; i < n; i += 4) { const f = 0.03 + (i % 3) * 0.045, yy = mod(hsh(i, 801) * H * 1.6 - gpx * f, H * 1.6) - H * 0.3; if (yy < -4 || yy > H) continue;
          const x = sn(hsh(i, 803) * W), y = sn(yy), tw = 0.5 + 0.5 * Math.sin(time * (0.8 + hsh(i, 802) * 3) + i * 1.7); ctx.globalAlpha = Math.min(1, st * (0.25 + 0.75 * tw) * (0.5 + f * 5));
          if (hsh(i, 804) < 0.08) { ctx.fillRect(x - 3, y, 7, 1); ctx.fillRect(x, y - 3, 1, 7); ctx.fillRect(x - 1, y - 1, 3, 3); } else { const s = f > 0.1 ? 2 : 1; ctx.fillRect(x, y, s, s); } } }
      // a satellite ticking across, and meteors
      const sx = mod(time * 26 + 300, W + 600) - 300, sy = H * 0.1 + sx * 0.08 - gpx * 0.07; ctx.globalAlpha = st; ctx.fillStyle = '#e8eeff'; ctx.fillRect(sn(sx), sn(sy), 2, 2); ctx.fillStyle = '#5a7bd6'; ctx.fillRect(sn(sx) - 5, sn(sy), 4, 2); ctx.fillRect(sn(sx) + 3, sn(sy), 4, 2); if (mod(time, 1.4) < 0.12) halo(sx, sy, 8, '255,90,90', 0.8 * st);
      ctx.fillStyle = '#ffffff';
      for (let q = 0; q < 2; q++) { const P = 5.3 + q * 2.9, ss = mod(time + q * 2.1, P) / 0.9; if (ss >= 1) continue; const seed = Math.floor((time + q * 2.1) / P), mx = W * (0.15 + 0.7 * hsh(seed, 805 + q)) + ss * 260, my = H * (0.06 + 0.3 * hsh(seed, 806 + q)) + ss * 100;
        for (let k = 0; k < 14; k++) { ctx.globalAlpha = st * (1 - ss) * (1 - k / 14); ctx.fillRect(sn(mx - k * 9), sn(my - k * 3.5), k < 2 ? 3 : 2, 2); } if (ss < 0.6) halo(mx, my, 10, '200,230,255', 0.7 * st * (1 - ss)); }
      ctx.globalAlpha = 1;
    }
    if (sky <= 0) return;
    // aurora curtains, ray by ray, folding and rippling
    ctx.globalCompositeOperation = 'lighter';
    const stp = lo ? 6 : 3;
    for (let b = 0; b < 3; b++) {
      const yb = gy(-170 + b * 95, 0.3); if (yb < -60 || yb - 260 > H) continue; const strip = gAur(b);
      for (let x = 0; x < W; x += stp) {
        const fold = 0.5 + 0.5 * Math.sin(x * 0.019 + time * 0.55 + b * 4), ray = 0.55 + 0.45 * Math.sin(x * 0.21 + time * 1.3 + Math.sin(x * 0.031 + time * 0.7) * 3), a = sky * 0.45 * (0.2 + 0.8 * fold) * (0.3 + 0.7 * ray); if (a < 0.03) continue;
        const y = yb + Math.sin(x * 0.0047 + time * 0.28 + b * 2) * 46 + Math.sin(x * 0.013 - time * 0.41 + b) * 16, hh = 70 + 120 * fold * (0.7 + 0.3 * ray);
        ctx.globalAlpha = Math.min(1, a); ctx.drawImage(strip, x, sn(y - hh), stp, hh);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // the moon
    const mx = W * 0.2, my = H * 0.22 - gpx * 0.1;
    if (my > -120 && my < H + 120) { ctx.globalCompositeOperation = 'lighter'; halo(mx, my, 34 * AP, '220,230,255', 0.45 * sky); const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 70 * AP); mg.addColorStop(0, 'rgba(160,180,255,' + (0.18 * sky).toFixed(3) + ')'); mg.addColorStop(1, 'rgba(160,180,255,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - 70 * AP, my - 70 * AP, 140 * AP, 140 * AP); ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = sky; ctx.drawImage(gMoon(), sn(mx - 15 * AP), sn(my - 15 * AP), 30 * AP, 30 * AP); ctx.globalAlpha = 1; }
  }

  // ---------- the high sky: a distant storm, balloons, geese, a jet and its contrail, cirrus ----------
  function gHighSky(lo) {
    // cirrus combed thin by the jet stream
    { const a = gOn(-350, -50, 700, 1000) * 0.5; if (a > 0) { ctx.fillStyle = '#fff3ee'; for (let i = 0; i < 12; i++) { const y = gy(60 + i * 55, 0.4 + (i % 3) * 0.08); if (y < -10 || y > H + 10) continue; const len = 140 + hsh(i, 821) * 280, x = mod(hsh(i, 820) * (W + 600) + time * (4 + hsh(i, 822) * 5), W + 600) - 300; ctx.globalAlpha = a * (0.4 + 0.6 * hsh(i, 823)); ctx.fillRect(sn(x), sn(y), len, 2); ctx.fillRect(sn(x + len * 0.15), sn(y - 3), len * 0.6, 1); ctx.fillRect(sn(x - len * 0.1), sn(y + 3), len * 0.5, 1); ctx.fillRect(sn(x + len * 0.5), sn(y + 6), len * 0.35, 1); } ctx.globalAlpha = 1; } }
    // a thunderhead far away, flickering with lightning
    { const a = gOn(-450, -150, 1100, 1350), s = AP * 1.5, art = gStorm(), bx = W * 0.02, by = gy(800, 0.3) - 80 * s; if (a > 0 && by < H && by + 84 * s > 0) {
      ctx.globalAlpha = a * 0.82; ctx.drawImage(art, sn(bx), sn(by), 120 * s, 84 * s); ctx.globalAlpha = 1;
      const P = 3.7, ph = mod(time, P), ev = Math.floor(time / P); if (!lo && ph < 0.32 && hsh(ev, 830) < 0.7) { const on = ph < 0.06 || (ph > 0.14 && ph < 0.2), lx = bx + (30 + hsh(ev, 831) * 30) * s, ly = by + (34 + hsh(ev, 832) * 26) * s;
        if (on) { ctx.globalCompositeOperation = 'lighter'; halo(lx, ly, 26 * s, '200,190,255', 0.9 * a); ctx.globalCompositeOperation = 'source-over';
          if (hsh(ev, 833) < 0.6) { ctx.strokeStyle = 'rgba(245,240,255,' + (0.95 * a).toFixed(2) + ')'; ctx.lineWidth = 2; ctx.beginPath(); let x = lx, y = by + 80 * s; ctx.moveTo(x, y); for (let k = 1; k < 7; k++) { x += (hsh(ev * 7 + k, 834) - 0.5) * 30; y += 14 + hsh(k, ev) * 12; ctx.lineTo(sn(x), sn(y)); } ctx.stroke(); } } } } }
    // a jet and its contrail
    { const a = gOn(-550, -350, 450, 750), y = gy(130, 0.22); if (a > 0 && y > -20 && y < H) { const x = mod(time * 48, W + 900) - 300; ctx.fillStyle = '#ffffff'; for (let k = 1; k < 46; k++) { ctx.globalAlpha = a * 0.45 * (1 - k / 46); ctx.fillRect(sn(x - k * 9), sn(y - 1 + Math.sin(k * 0.4 + time) * k * 0.03), 9, k > 12 ? 3 : 2); } ctx.globalAlpha = a; ctx.fillStyle = '#d8dce8'; ctx.fillRect(sn(x), sn(y - 1), 9, 2); ctx.fillRect(sn(x + 3), sn(y - 4), 2, 7); ctx.fillRect(sn(x), sn(y - 3), 2, 2); ctx.globalAlpha = 1; if (mod(time, 1) < 0.15) halo(x + 9, y, 5, '255,80,80', 0.9 * a); } }
    // hot-air balloons drifting at different heights
    for (let k = 0; k < 3; k++) { const f = [0.5, 0.72, 1.05][k], y = gy([150, 330, 640][k], f) + Math.sin(time * 0.4 + k * 2) * 8; if (y < -140 || y > H + 80) continue;
      const s = Math.max(1, Math.round(AP * f * 1.15)), x = mod(W * [0.72, 0.18, 0.55][k] + time * (3 + k * 2), W + 200) - 100; ctx.globalAlpha = 0.6 + 0.4 * Math.min(1, f); ctx.drawImage(gBalloon(k), sn(x - 7.5 * s), sn(y - 12 * s), 15 * s, 24 * s); ctx.globalAlpha = 1;
      if (mod(time + k * 1.7, 5) < 0.7) { ctx.fillStyle = '#ffd36b'; ctx.fillRect(sn(x - s), sn(y + 4 * s), 2 * s, 2 * s); halo(x, y + 4 * s, 7 * s, '255,170,60', 0.85); } }
    // geese in a long V
    { const a = gOn(-250, -50, 950, 1150); if (a > 0) for (let q = 0; q < 2; q++) { const f = q ? 0.95 : 0.6, y0 = gy(q ? 640 : 340, f), dir = q ? -1 : 1, run = mod(time * (q ? 30 : 34) + q * 400, W + 500) - 250, x0 = dir > 0 ? run : W - run; if (y0 < -90 || y0 > H + 90) continue;
      ctx.fillStyle = q ? '#2a2638' : '#4a4866'; ctx.globalAlpha = a * (q ? 0.95 : 0.7); const s = q ? 2 : 1.5;
      for (let k = 0; k < 11; k++) { const row = (k + 1) >> 1, sd = k % 2 ? 1 : -1, bx = sn(x0 - dir * row * 15 * f * 1.5), by = sn(y0 + sd * row * 8 * f * 1.5 + Math.sin(time * 1.5 + k) * 2), up = Math.sin(time * 7 + k * 0.8) > 0;
        ctx.fillRect(bx - 4 * s, by, 9 * s, s + 1); ctx.fillRect(bx + dir * 5 * s - (dir < 0 ? s : 0), by - 1, 2 * s, 2); ctx.fillRect(bx - s, up ? by - 4 * s : by + s, 3 * s, up ? 4 * s : 3 * s); } } ctx.globalAlpha = 1; }
  }

  // ---------- the sea of clouds ----------
  const CLOUD_L = [[540, 0.32, 0.5, 0.6], [660, 0.48, 0.62, 0.8], [780, 0.66, 0.75, 1], [900, 0.86, 0.85, 1.25], [1020, 1.1, 0.95, 1.6], [1150, 1.4, 1, 2]];
  const RAINBOW = ['#ff4d4d', '#ff9f43', '#ffe66d', '#7bed9f', '#4dabff', '#6c5ce7', '#b56cff'];
  function gClouds(lo) {
    // a rainbow standing over the cloud sea
    { const ra = gOn(560, 760, 1150, 1400) * 0.22; if (ra > 0) { const cx = W * 0.3, cy = gy(1260, 0.42), r0 = Math.max(W, H) * 0.5; if (cy - r0 < H) { ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 5; ctx.globalAlpha = ra; for (let k = 0; k < 7; k++) { ctx.strokeStyle = RAINBOW[k]; ctx.beginPath(); ctx.arc(cx, cy, r0 - k * 5, Math.PI, 2 * Math.PI); ctx.stroke(); } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } } }
    for (const L of CLOUD_L) {
      const by = gy(L[0], L[1]); if (by < -320 || by > H + 320) continue;
      const sc = L[3], al = L[2], cS = rgb(mixc(geoCol(L[0] + 300), [118, 98, 148], 0.6), al), cB = rgb(mixc(geoCol(L[0]), [236, 200, 210], 0.55), al), cL = rgb([255, 222, 178], al), cR = rgb([255, 244, 214], al * 0.9), n = W / (60 * sc) + 3;
      ctx.fillStyle = cS; ctx.fillRect(0, by + 14 * sc, W, 120 * sc + 40);
      const pass = (fill, dy, rr, dx) => { ctx.fillStyle = fill; ctx.beginPath(); for (let i = -2; i < n; i++) { const seed = i + L[0] * 7, x = mod(i * 60 * sc + hsh(seed, 806) * 40 * sc + time * 5 * L[1], W + 180 * sc) - 90 * sc, r = (22 + 30 * hsh(seed, 807)) * sc, cy = by - (hsh(seed, 808) * 26 + Math.sin(i * 1.3 + L[0]) * 8) * sc; ctx.moveTo(x + dx * r + r * rr, cy + dy * r); ctx.arc(x + dx * r, cy + dy * r, r * rr, 0, 6.283); } ctx.fill(); };
      pass(cS, 0.45, 1.05, 0); pass(cB, 0.1, 0.95, 0); pass(cL, -0.12, 0.7, -0.18); if (!lo) pass(cR, -0.32, 0.38, -0.28);
    }
    // swallows darting over the cloud tops
    { const a = gOn(420, 600, 1250, 1450); if (a > 0) { ctx.fillStyle = '#26243a'; ctx.globalAlpha = a; for (let i = 0; i < 7; i++) { const x = W * (0.5 + 0.46 * Math.sin(time * 0.45 * (1 + hsh(i, 870)) + i * 2)), y = gy(640 + i * 85, 0.9) + Math.sin(time * 1.3 * (1 + hsh(i, 871)) + i) * 40; if (y < -10 || y > H + 10) continue; const X = sn(x), Y = sn(y), d = Math.cos(time * 0.45 * (1 + hsh(i, 870)) + i * 2) > 0 ? 1 : -1, up = Math.sin(time * 16 + i) > 0;
      ctx.fillRect(X - 3, Y, 7, 2); ctx.fillRect(X + d * 4, Y - 1, 2, 2); ctx.fillRect(X - d * 6, Y + 1, 3, 1); if (up) { ctx.fillRect(X - 1, Y - 4, 2, 4); ctx.fillRect(X - 3 * d, Y - 6, 3, 2); } else { ctx.fillRect(X - 1, Y + 2, 2, 3); ctx.fillRect(X - 3 * d, Y + 4, 3, 2); } } ctx.globalAlpha = 1; } }
    // god rays breaking through the gaps
    if (camS > 400 && camS < 1500) { const a = Math.min(1, (camS - 400) / 200) * Math.min(1, (1500 - camS) / 300); ctx.globalCompositeOperation = 'lighter'; const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(255,214,160,' + (0.14 * a).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = gr;
      for (let k = 0; k < 6; k++) { const x0 = W * (0.1 + k * 0.17) + Math.sin(time * 0.2 + k) * 20, pul = 0.6 + 0.4 * Math.sin(time * 0.5 + k * 1.9); ctx.globalAlpha = pul; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 26, 0); ctx.lineTo(x0 + 110, H); ctx.lineTo(x0 + 40, H); ctx.fill(); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    // wisps of cloud rushing past close by while you fall through the banks
    { const a = gOn(560, 720, 1080, 1220) * 0.55; if (a > 0) { const pf = gPuff(); for (let i = 0; i < (lo ? 3 : 6); i++) { const y = gy(560 + i * 110, 1.8); if (y < -200 || y > H + 60) continue; const s = AP * (1.5 + hsh(i, 875) * 1.5), x = mod(hsh(i, 876) * W + time * (12 + i * 3), W + 96 * s) - 96 * s; ctx.globalAlpha = a; ctx.imageSmoothingEnabled = true; ctx.drawImage(pf, x, y - 18 * s, 96 * s, 36 * s); ctx.imageSmoothingEnabled = false; } ctx.globalAlpha = 1; } }
  }

  // ---------- mountains: five ranges, snow, pines, a waterfall, a lit village, spindrift off the peaks ----------
  const RANGES = [[1260, 0.36, 0.78, 801], [1360, 0.5, 0.62, 811], [1470, 0.66, 0.45, 821], [1590, 0.82, 0.26, 831], [1720, 1, 0.08, 841]];
  function gMountains(lo) {
    const step = Math.max(3, AP * 2), nx = Math.min(4000, Math.ceil(W / step) + 1);
    for (let ri = 0; ri < RANGES.length; ri++) {
      const R0 = RANGES[ri], base = gy(R0[0], R0[1]); if (base < -420 || base > H + 600) continue;
      const amp = 200 * R0[1] + 50, far = R0[2], sd = R0[3], foot = 140 + 140 * R0[1], top = mixc([58, 70, 110], geoCol(1300), far), bot = mixc([22, 26, 42], geoCol(1500), far * 0.8), snow = mixc([255, 250, 255], geoCol(1300), far * 0.6);
      let pk = 1e9, pkx = 0;
      for (let i = 0; i < nx; i++) { const x = i * step, y = sn(base - amp * (0.5 + 0.32 * Math.sin(x / W * 4.7 + sd) + 0.2 * Math.sin(x / W * 11.3 + sd * 2) + 0.1 * Math.sin(x / W * 27 + sd) + 0.05 * Math.sin(x / W * 61 + sd * 3))); gR[i] = y; if (y < pk) { pk = y; pkx = x; } }
      const gr = ctx.createLinearGradient(0, base - amp, 0, base + foot); gr.addColorStop(0, rgb(top)); gr.addColorStop(0.62, rgb(bot)); gr.addColorStop(1, rgb(mixc(bot, geoCol(R0[0] + 250), 0.6), 0));
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, base + foot); for (let i = 0; i < nx; i++) { ctx.lineTo(i * step, gR[i]); ctx.lineTo(i * step + step, gR[i]); } ctx.lineTo(W + step, base + foot); ctx.closePath(); ctx.fill();
      // shadowed slopes facing away from the sun, a warm rim on the sunward ones, then snow
      const line = base - amp * 0.72; ctx.fillStyle = rgb(snow); ctx.beginPath(); for (let i = 0; i < nx; i++) { const y = gR[i]; if (y < line) ctx.rect(i * step, y, step, Math.max(step, (line - y) * (0.55 + 0.3 * hsh(i, 842 + ri)))); } ctx.fill();
      ctx.fillStyle = rgb(mixc(snow, [255, 190, 140], 0.45), 0.7); ctx.beginPath(); for (let i = 1; i < nx; i++) if (gR[i] > gR[i - 1]) ctx.rect(i * step, gR[i], step, 2); ctx.fill();
      if (ri >= 3) { ctx.fillStyle = rgb(mixc([16, 40, 30], geoCol(1600), far)); ctx.beginPath(); for (let k = 0; k < W / 13; k++) { if (hsh(k, 853 + ri) < 0.25) continue; const x = k * 13 + hsh(k, 850 + ri) * 8, y = gR[Math.min(nx - 1, x / step | 0)] + 26 + hsh(k, 851 + ri) * 56, h3 = 16 + hsh(k, 852 + ri) * 22; for (let s = 0; s < h3; s += 3) ctx.rect(sn(x - s * 0.3), sn(y - h3 + s), Math.max(2, s * 0.6), 3); ctx.rect(sn(x - 1), sn(y), 2, 4); } ctx.fill(); }
      // a waterfall spilling from a notch in the fourth range
      if (ri === 3) { const i = (W * 0.56 / step) | 0, x = i * step, t0 = gR[i] + amp * 0.18, t1 = base + 70; if (t1 > 0 && t0 < H) { ctx.fillStyle = 'rgba(220,236,255,0.7)'; ctx.fillRect(sn(x), sn(t0), 6, t1 - t0); ctx.fillStyle = '#ffffff'; for (let k = 0; k < 9; k++) { const y = t0 + mod(time * 110 + k * 37, Math.max(1, t1 - t0)); ctx.fillRect(sn(x + (k % 3) * 2), sn(y), 2, 9); } halo(x + 3, t1, 22, '220,240,255', 0.5); } }
      // a mountain village lighting up for the evening
      if (ri === 4) { for (let k = 0; k < 6; k++) { const x = W * (0.08 + k * 0.035 + (k > 3 ? 0.3 : 0)), y = gR[Math.min(nx - 1, x / step | 0)] + 40 + hsh(k, 857) * 30; if (y < -20 || y > H + 20) continue; ctx.fillStyle = '#1d1a26'; ctx.fillRect(sn(x - 6), sn(y - 7), 12, 8); ctx.beginPath(); ctx.moveTo(sn(x - 8), sn(y - 7)); ctx.lineTo(sn(x), sn(y - 13)); ctx.lineTo(sn(x + 8), sn(y - 7)); ctx.fill(); ctx.fillStyle = '#ffd77a'; ctx.fillRect(sn(x - 3), sn(y - 4), 3, 3); if (k % 2) ctx.fillRect(sn(x + 2), sn(y - 4), 2, 3); halo(x - 1, y - 3, 9, '255,200,110', 0.55); } }
      // spindrift streaming off the highest peak of the far ranges
      if (ri <= 2 && !lo) { ctx.fillStyle = '#ffffff'; for (let k = 0; k < 14; k++) { const u = mod(time * 0.3 + k / 14, 1); ctx.globalAlpha = (1 - u) * 0.55 * (1 - far * 0.4); ctx.fillRect(sn(pkx + u * 130 * R0[1] + Math.sin(k * 3.1) * 6), sn(pk + 2 + u * 22 + Math.sin(u * 8 + k) * 5), 2, 2); } ctx.globalAlpha = 1; }
      const mist = ctx.createLinearGradient(0, base - 30, 0, base + 60); mist.addColorStop(0, rgb(geoCol(1400), 0)); mist.addColorStop(0.5, rgb(mixc(geoCol(1400), [255, 240, 230], 0.4), 0.45 * (1 - far * 0.3))); mist.addColorStop(1, rgb(geoCol(1400), 0)); ctx.fillStyle = mist; ctx.fillRect(0, base - 30, W, 90);
    }
    // eagles circling the peaks
    if (camS > 1000 && camS < 2000) { ctx.fillStyle = '#2a1e16'; for (let q = 0; q < 3; q++) { const ang = time * (0.3 + q * 0.07) + q * 2, cx2 = W * (0.3 + q * 0.2) + Math.cos(ang) * 90, cy2 = gy(1420 + q * 60, 0.75) + Math.sin(ang) * 30, fl = Math.round(Math.sin(time * 2.5 + q) * 2), X = sn(cx2), Y = sn(cy2); if (Y < -20 || Y > H + 20) continue;
      ctx.fillRect(X - 16, Y + fl, 13, 3); ctx.fillRect(X + 3, Y + fl, 13, 3); ctx.fillRect(X - 19, Y + fl + 1, 3, 2); ctx.fillRect(X + 16, Y + fl + 1, 3, 2); ctx.fillRect(X - 3, Y - 1, 6, 5); ctx.fillRect(X - 2, Y + 4, 4, 3); ctx.fillStyle = '#f2efe6'; ctx.fillRect(X - 2, Y - 3, 4, 2); ctx.fillStyle = '#2a1e16'; } }
  }

  // ---------- the coast at sunset: the sun, islands, a headland and lighthouse, boats, whales and dolphins ----------
  function gSun(ys) {
    const sunY = gy(1880, 0.42) - 40, sunX = W * 0.68; if (camS > 2600 || sunY < -200 || sunY > H + 200) return;
    ctx.globalCompositeOperation = 'lighter';
    const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, Math.min(W, H) * 0.7); sg.addColorStop(0, 'rgba(255,220,160,0.55)'); sg.addColorStop(0.15, 'rgba(255,180,120,0.25)'); sg.addColorStop(1, 'rgba(255,150,100,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#fff1c8'; ctx.beginPath(); ctx.arc(sunX, sunY, 46, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,200,120,0.6)'; for (let k = 0; k < 4; k++) ctx.fillRect(sunX - 50, sunY + 10 + k * 9, 100, 2);
    // long sunset clouds, lit gold from below
    for (let k = 0; k < 6; k++) { const y = gy(1770 + k * 32, 0.45 + k * 0.03); if (y < -10 || y > ys - 4) continue; const len = 160 + hsh(k, 886) * 260, x = mod(hsh(k, 885) * W + time * (2 + k * 0.6), W + len + 200) - len - 100;
      ctx.fillStyle = 'rgba(150,84,130,0.7)'; ctx.fillRect(sn(x), sn(y), len, 5); ctx.fillRect(sn(x + len * 0.2), sn(y - 3), len * 0.5, 3); ctx.fillStyle = 'rgba(255,196,120,0.85)'; ctx.fillRect(sn(x + 4), sn(y + 5), len - 8, 2); ctx.fillStyle = 'rgba(255,150,170,0.6)'; ctx.fillRect(sn(x + len * 0.25), sn(y - 3), len * 0.4, 1); }
  }
  function gCoast(lo, ys) {
    const sunX = W * 0.68, sil = rgb(mixc(geoCol(1985), [40, 24, 52], 0.65));
    // islands on the horizon, one with palms, one a smoking volcano
    ctx.fillStyle = sil; ctx.beginPath(); ctx.moveTo(W * 0.02, ys + 1);
    for (let x = W * 0.02; x <= W * 0.22; x += 4) { const u = (x - W * 0.02) / (W * 0.2); ctx.lineTo(x, sn(ys - Math.sin(u * Math.PI) * 26 - Math.sin(u * 17) * 3)); }
    ctx.lineTo(W * 0.22, ys + 1); ctx.moveTo(W * 0.3, ys + 1); ctx.lineTo(W * 0.37, sn(ys - 58)); ctx.lineTo(W * 0.385, sn(ys - 56)); ctx.lineTo(W * 0.45, ys + 1); ctx.fill();
    for (let p = 0; p < 3; p++) { const x = W * (0.07 + p * 0.05), y = ys - 22 - p * 3; ctx.fillRect(sn(x), sn(y - 26), 3, 26); for (let f = 0; f < 5; f++) { const a2 = -2.6 + f * 0.55 + Math.sin(time * 1.2 + p + f) * 0.06; for (let s = 2; s < 16; s += 2) ctx.fillRect(sn(x + Math.cos(a2) * s), sn(y - 26 + Math.sin(a2) * s * 0.6 + s * s * 0.03), 3, 2); } }
    for (let k = 0; k < 9; k++) { const u = mod(time * 0.12 + k / 9, 1); ctx.fillStyle = 'rgba(110,90,110,' + (0.5 * (1 - u)).toFixed(2) + ')'; ctx.beginPath(); ctx.arc(W * 0.378 + u * 60 + Math.sin(u * 6 + k) * 6, ys - 62 - u * 90, 5 + u * 16, 0, 6.283); ctx.fill(); }
    halo(W * 0.378, ys - 58, 10, '255,110,50', 0.6);
    // the sun's path glittering on the water
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#ffe6aa';
    for (let k = 0; k < (lo ? 24 : 48); k++) { const gy2 = ys + 3 + hsh(k, 830) * 70, gx = sunX + (hsh(k, 831) - 0.5) * (30 + (gy2 - ys) * 2.4), tw = Math.max(0, Math.sin(time * 4 + k * 1.7)); if (tw < 0.05) continue; ctx.globalAlpha = 0.75 * tw * (1 - (gy2 - ys) / 90); ctx.fillRect(sn(gx), sn(gy2), 4 + (k % 4) * 2, 2); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // the headland: cliff above the waterline, its face running on down under the sea
    const cx = W * 0.79, topY = ys - 112, botY = ys + 280, cg = ctx.createLinearGradient(0, topY, 0, botY);
    cg.addColorStop(0, '#3a3438'); cg.addColorStop(gcl(112 / 392), '#2a2629'); cg.addColorStop(gcl(113 / 392), '#163a4a'); cg.addColorStop(1, 'rgba(10,40,60,0)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(W + 2, topY - 6); ctx.lineTo(cx + 40, topY - 6);
    for (let y = topY; y <= botY; y += 6) { const m = y - topY, x = cx + 34 - m * 0.06 + (y > ys ? -(y - ys) * 0.25 : 0) + Math.round(hsh(Math.floor(m / 6), 887) * 3) * 4 - (m < 20 ? 0 : 6); ctx.lineTo(sn(x), sn(y)); ctx.lineTo(sn(x), sn(y + 6)); }
    ctx.lineTo(W + 2, botY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let k = 0; k < 6; k++) ctx.fillRect(sn(cx + 50 + k * 4), sn(topY + 16 + k * 15), W, 2);
    ctx.fillStyle = '#4f7a3a'; ctx.fillRect(sn(cx + 36), sn(topY - 8), W, 5); ctx.fillStyle = '#6f9a4a'; for (let x = cx + 38; x < W; x += 6) ctx.fillRect(sn(x), sn(topY - 10 - (hsh(x | 0, 888) < 0.4 ? 2 : 0)), 3, 3);
    // underwater weed on the cliff face
    ctx.fillStyle = 'rgba(60,140,90,0.7)'; for (let k = 0; k < 7; k++) { const y = ys + 30 + k * 34, x = cx + 20 - (y - ys) * 0.25; for (let s = 0; s < 22; s += 3) ctx.fillRect(sn(x - s * 0.3 + Math.sin(time * 1.5 + k + s * 0.2) * 3), sn(y - s), 3, 3); }
    // the lighthouse on top, sweeping its beam
    const lx = Math.min(W - 24, cx + 80), ly = topY - 8;
    ctx.fillStyle = '#e8e2d6'; ctx.fillRect(lx - 7, ly - 70, 14, 70); ctx.fillStyle = '#c0392b'; for (let k = 0; k < 3; k++) ctx.fillRect(lx - 7, ly - 62 + k * 22, 14, 8); ctx.fillStyle = '#d8d0c0'; ctx.fillRect(lx - 11, ly - 4, 22, 4); ctx.fillStyle = '#ffe9a8'; ctx.fillRect(lx - 6, ly - 82, 12, 10); ctx.fillStyle = '#333'; ctx.fillRect(lx - 9, ly - 86, 18, 4); ctx.fillRect(lx - 3, ly - 90, 6, 4);
    ctx.globalCompositeOperation = 'lighter'; const ba = time * 0.9, bx = Math.cos(ba), bz = Math.abs(Math.sin(ba)) * 0.5 + 0.5;
    const beam = ctx.createLinearGradient(lx, ly - 77, lx + bx * W, ly - 77); beam.addColorStop(0, 'rgba(255,240,180,' + (0.35 * bz).toFixed(2) + ')'); beam.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(lx, ly - 77); ctx.lineTo(lx + bx * W, ly - 77 - 60 * bz); ctx.lineTo(lx + bx * W, ly - 77 + 60 * bz); ctx.fill();
    halo(lx, ly - 77, 40, '255,240,180', 0.6); ctx.globalCompositeOperation = 'source-over';
    // surf breaking against the cliff foot
    { const P = 2.8, t = mod(time, P), wx = cx + 34; gSplash(wx, ys, t, lo ? 10 : 20, 120, 889); }
    // a humpback breaching: up out of the sea, over, and back down in a burst of spray
    { const P = 12, t = mod(time, P), ev = Math.floor(time / P), wx = W * (0.32 + 0.22 * hsh(ev, 890)), D2 = 2.2;
      if (t < D2) { const u = t / D2, x = wx + u * 150, y = ys + 50 - Math.sin(u * Math.PI) * 150, ang = -1.25 + u * 2.3;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ys + 2); ctx.clip(); gWhale(x, y, 1.15, ang, '#2c3540', '#c9d2d8'); ctx.restore();
        ctx.save(); ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.rect(0, ys + 2, W, H); ctx.clip(); gWhale(x, y, 1.15, ang, '#14303e', '#3c6474'); ctx.restore(); }
      gSplash(wx + 20, ys, t - 0.25, lo ? 14 : 30, 150, 891); gSplash(wx + 150, ys, t - D2 + 0.25, lo ? 18 : 40, 210, 893);
      // and between breaches, a blow from another whale further out
      const bt = mod(time + 5, 7); if (bt < 1.6) { ctx.fillStyle = '#eef6ff'; const bx2 = W * 0.58; for (let k = 0; k < 12; k++) { const u = bt / 1.6, a2 = -Math.PI / 2 + (hsh(k, 894) - 0.5) * 0.7, v = 70 * (0.6 + hsh(k, 895)); ctx.globalAlpha = (1 - u) * 0.8; ctx.fillRect(sn(bx2 + Math.cos(a2) * v * u * 0.6), sn(ys - 4 + Math.sin(a2) * v * Math.min(1, u * 2) + u * u * 30), 2, 2); } ctx.globalAlpha = 1; ctx.fillStyle = '#2c3540'; ctx.fillRect(sn(bx2 - 10), sn(ys - 3), 22, 4); } }
    // a pod of dolphins arcing through the waves
    for (let d = 0; d < 3; d++) { const P = 4.5, t = mod(time - d * 0.35, P), D2 = 1; if (t > D2) continue; const u = t / D2, x = W * 0.12 + mod(Math.floor((time - d * 0.35) / P) * 97, W * 0.4) + d * 26 + u * 80, y = ys + 6 - Math.sin(u * Math.PI) * 42, ang = -0.9 + u * 1.8;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = '#5d7488'; ctx.fillRect(-13, -3, 26, 7); ctx.fillRect(13, -1, 6, 3); ctx.fillRect(-2, -7, 5, 4); ctx.fillRect(-18, -4, 5, 3); ctx.fillRect(-18, 2, 5, 3); ctx.fillStyle = '#c8d4dc'; ctx.fillRect(-10, 2, 22, 2); ctx.restore(); }
    // waves along the surface
    ctx.fillStyle = '#ffffff'; for (let r = 0; r < 4; r++) { ctx.globalAlpha = 0.5 - r * 0.1; for (let x = 0; x < W; x += 8) { const y = ys + r * 7 + Math.sin(x * 0.04 + time * (1.5 + r * 0.3) + r) * 2.5; ctx.fillRect(x, sn(y), 5, 2); } } ctx.globalAlpha = 1;
    // a sailing boat and a fishing boat with its lamp lit
    { const xx = mod(W * 0.2 + time * 8, W + 120) - 60, y = ys - 2 + Math.sin(time * 1.4) * 2; ctx.fillStyle = '#3a2a1c'; ctx.beginPath(); ctx.moveTo(xx - 18, y - 4); ctx.lineTo(xx + 18, y - 4); ctx.lineTo(xx + 12, y + 3); ctx.lineTo(xx - 13, y + 3); ctx.fill(); ctx.fillRect(xx - 1, y - 34, 2, 30);
      ctx.fillStyle = '#f4ead6'; ctx.beginPath(); ctx.moveTo(xx + 2, y - 33); ctx.lineTo(xx + 16, y - 7); ctx.lineTo(xx + 2, y - 7); ctx.fill(); ctx.fillStyle = '#e6c9a8'; ctx.beginPath(); ctx.moveTo(xx - 2, y - 28); ctx.lineTo(xx - 2, y - 7); ctx.lineTo(xx - 14, y - 7); ctx.fill(); }
    { const xx = mod(W * 0.62 - time * 6, W + 120) - 60, y = ys - 1 + Math.sin(time * 1.7 + 2) * 2; ctx.fillStyle = '#4a2f24'; ctx.fillRect(sn(xx - 16), sn(y - 5), 32, 6); ctx.fillRect(sn(xx - 12), sn(y + 1), 24, 3); ctx.fillStyle = '#d9cbb0'; ctx.fillRect(sn(xx - 4), sn(y - 13), 10, 8); ctx.fillStyle = '#3a2a1c'; ctx.fillRect(sn(xx + 9), sn(y - 24), 2, 19); ctx.fillStyle = '#ffd77a'; ctx.fillRect(sn(xx - 2), sn(y - 11), 3, 3); halo(xx + 10, y - 24, 10, '255,210,120', 0.7); }
    // gulls
    ctx.fillStyle = 'rgba(30,30,40,0.7)'; for (let q = 0; q < 6; q++) { const gx = mod(hsh(q, 840) * W + time * (20 + q * 4), W + 60) - 30, gy3 = ys - 140 - hsh(q, 841) * 160 + Math.sin(time * 2 + q) * 6, fl = Math.round(Math.sin(time * 8 + q) * 2); ctx.fillRect(sn(gx - 6), sn(gy3 + fl), 6, 2); ctx.fillRect(sn(gx), sn(gy3), 2, 2); ctx.fillRect(sn(gx + 2), sn(gy3 + fl), 6, 2); }
  }

  // ---------- the sunlit shallows ----------
  function gShallows(lo, ys) {
    // caustic light netting the upper water
    const ca = gOn(1950, 2050, 2500, 3000); if (ca > 0) { const tile = gCaus(), pat = gC.causPat && gC.causPatSrc === tile ? gC.causPat : (gC.causPatSrc = tile, gC.causPat = ctx.createPattern(tile, 'repeat'));
      const top = Math.max(0, ys + 4); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = pat;
      for (let L = 0; L < (lo ? 1 : 2); L++) { const ox = L ? -time * 9 : time * 13, oy = (L ? time * 5 : -time * 4) - gpx * (0.9 + L * 0.1); ctx.save(); ctx.translate(ox, oy);
        for (let s = 0; s < 4; s++) { const y0 = top + s * (H - top) / 4, m = camS + (y0 - AY) * mpp; ctx.globalAlpha = ca * 0.09 * gcl(1 - (m - 2000) / 700) * (L ? 0.7 : 1); if (ctx.globalAlpha < 0.01) continue; ctx.fillRect(-ox, y0 - oy, W, (H - top) / 4 + 1); }
        ctx.restore(); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    // rays of light reaching down, and the shimmer of the surface overhead
    if (camS > 1500 && camS < 4200) {
      const a = Math.max(0, Math.min(1, (camS - 1700) / 400)) * Math.max(0, 1 - (camS - 2600) / 1600);
      if (a > 0.01) { ctx.globalCompositeOperation = 'lighter'; const top = Math.max(ys, -50), gr = ctx.createLinearGradient(0, top, 0, top + H * 0.9); gr.addColorStop(0, 'rgba(170,230,255,' + (0.16 * a).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(170,230,255,0)'); ctx.fillStyle = gr;
        for (let k = 0; k < 7; k++) { const x0 = W * (0.05 + k * 0.15) + Math.sin(time * 0.3 + k) * 30, w0 = 30 + k * 6; ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time * 0.7 + k * 2.3); ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0 + w0, top); ctx.lineTo(x0 + w0 * 3 + 120, top + H * 0.9); ctx.lineTo(x0 + 120, top + H * 0.9); ctx.fill(); }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
      if (ys > -10 && ys < H) { ctx.fillStyle = 'rgba(200,240,255,0.25)'; for (let x = 0; x < W; x += 10) for (let r = 1; r < 5; r++) ctx.fillRect(x + Math.sin(time * 2 + x * 0.05 + r) * 4, sn(ys + 14 + r * 9 + Math.sin(x * 0.07 + time * 1.3 + r * 2) * 3), 6, 1); }
    }
    if (camS < 1900 || camS > 4300) return;
    // far reef walls in the blue haze, for depth
    { const f = 0.55, c = mixc(geoCol(2700), [10, 46, 74], 0.3), rg = ctx.createLinearGradient(0, gy(2120, f), 0, gy(2500, f)); rg.addColorStop(0, rgb(c, 0)); rg.addColorStop(1, rgb(c, 0.85)); ctx.fillStyle = rg;
      for (const side of [0, 1]) { ctx.beginPath(); let open = false, ly = 0;
        for (let y = 0; y <= H + 6; y += 6) { const m = ((y - AY) / f + gpx) * mpp; if (m < 2080 || m > 4600) { continue; } ly = y; const w2 = (30 + 60 * (0.5 + 0.5 * Math.sin(m * 0.012 + side * 2)) + 30 * gcl((m - 2080) / 300)) * Math.min(1, W / 800) + Math.round(hsh(Math.floor(m / 14), 896 + side) * 2) * 10, x = side ? W - w2 : w2;
          if (!open) { ctx.moveTo(side ? W : 0, y); open = true; } ctx.lineTo(x, y); ctx.lineTo(x, y + 6); }
        if (open) { ctx.lineTo(side ? W : 0, ly + 6); ctx.fill(); } } }
    // a humpback and her calf cruising past in the blue
    { const y = gy(2480, 0.6); if (y > -120 && y < H + 120) { const x = mod(W + 300 - time * 16, W + 700) - 300, c = rgb(mixc(geoCol(2600), [8, 26, 44], 0.45)), b2 = rgb(mixc(geoCol(2600), [140, 180, 200], 0.3)); gWhale(x, y + Math.sin(time * 0.5) * 6, -2.4, 0.04, c, b2); gWhale(x + 150, y + 64 + Math.sin(time * 0.5 + 1) * 5, -1.1, 0.04, c, b2); } }
    // a kelp forest swaying up the sides
    for (const side of [0, 1]) {
      ctx.fillStyle = side ? '#347a3e' : '#46903c'; ctx.globalAlpha = 0.85; ctx.beginPath();
      for (let k = 0; k < 9; k++) { const ry = gy(2600 + k * 120, 0.95); if (ry < -50 || ry > H + 500) continue; const rx = side ? W - 20 - hsh(k, 855 + side) * 110 : 20 + hsh(k, 855 + side) * 110, len = 260 + hsh(k, 856) * 240;
        for (let s = 0; s < len; s += 6) { const y = ry - s; if (y < -8 || y > H + 8) continue; ctx.rect(sn(rx + Math.sin(time * 1.1 + s * 0.012 + k) * (s / len) * 24), sn(y), 4, 7); } }
      ctx.fill(); ctx.fillStyle = 'rgba(120,180,70,0.8)'; ctx.globalAlpha = 1; ctx.beginPath();
      for (let k = 0; k < 9; k++) { const ry = gy(2600 + k * 120, 0.95); if (ry < -50 || ry > H + 500) continue; const rx = side ? W - 20 - hsh(k, 855 + side) * 110 : 20 + hsh(k, 855 + side) * 110, len = 260 + hsh(k, 856) * 240;
        for (let s = 0; s < len; s += 30) { const y = ry - s; if (y < -8 || y > H + 8) continue; const x = rx + Math.sin(time * 1.1 + s * 0.012 + k) * (s / len) * 24; ctx.rect(sn(x + (s % 60 ? 4 : -10)), sn(y), 10, 4); } }
      ctx.fill();
    }
    // corals and anemones at the reef's feet
    for (const side of [0, 1]) for (let k = 0; k < 30; k++) { const y = gy(2200 + k * 55, 1); if (y < -60 || y > H + 60) continue;
      const x = side ? W - 14 - hsh(k, 860 + side) * 90 : 14 + hsh(k, 860 + side) * 90, kind = Math.floor(hsh(k, 861 + side) * 3), ci = Math.floor(hsh(k, 862 + side) * 7); ctx.drawImage(gCoral(kind, ci, k % 3), sn(x - 22), sn(y - 50)); }
    if (!lo) for (let k = 0; k < 8; k++) { const y = gy(2250 + k * 190, 1) + 2; if (y < -40 || y > H + 40) continue; const side = k % 2, x = side ? W - 60 - hsh(k, 864) * 70 : 60 + hsh(k, 864) * 70; ctx.fillStyle = k % 3 ? '#ff8fb0' : '#ffd6a0'; ctx.beginPath(); for (let t = 0; t < 9; t++) for (let s = 0; s < 6; s++) ctx.rect(sn(x - 12 + t * 3 + Math.sin(time * 2 + t + s * 0.5) * s * 0.8), sn(y - 6 - s * 3), 2, 3); ctx.fill(); ctx.fillStyle = '#9b3d5a'; ctx.fillRect(sn(x - 10), sn(y - 6), 22, 6); }
    // fish schools, one balled up tight and wheeling
    if (!fishInit) { fishInit = true; for (let s = 0; s < 6; s++) for (let i = 0; i < 30; i++) fish.push({ s, ox: R() * 120 - 60, oy: R() * 50 - 25, ph: R() * 6 }); }
    const FC = ['#ffd166', '#7fdbff', '#ff9f80', '#c3f0ca', '#ff7ad9', '#ffffff'], nf = lo ? 14 : 30; let nP = 0;
    for (let s = 0; s < 6; s++) { const y0 = gy(2200 + s * 300, 0.9); if (y0 < -110 || y0 > H + 110) continue; const dir = s % 2 ? -1 : 1, cx = mod(W * hsh(s, 868) + dir * time * (34 + s * 6), W + 300) - 150, ball = s === 2, bcx = W * 0.5 + Math.sin(time * 0.15) * W * 0.25;
      ctx.fillStyle = FC[s]; ctx.beginPath();
      for (let i = 0; i < nf; i++) { const f = fish[s * 30 + i]; let x, y, d = dir;
        if (ball) { const ang = time * (1.1 + f.ph * 0.04) + f.ph * 7, r = 14 + Math.abs(f.ox) * 0.7; x = bcx + Math.cos(ang) * r * 1.5; y = y0 + Math.sin(ang) * r * 0.55 + f.oy * 0.35; d = Math.sin(ang) < 0 ? 1 : -1; }
        else { x = cx + f.ox + Math.sin(time * 2 + f.ph) * 8; y = y0 + f.oy + Math.sin(time * 1.3 + f.ph + s) * 10; }
        if (y < -10 || y > H + 10) continue; const X = sn(x), Y = sn(y); ctx.rect(X - 4, Y - 2, 9, 4); ctx.rect(d > 0 ? X - 7 : X + 5, Y - 3, 2, 6); ctx.rect(X - 1, Y - 3, 3, 1);
        if (nP < 240) { gFP[nP * 3] = X; gFP[nP * 3 + 1] = Y; gFP[nP * 3 + 2] = d; nP++; } }
      ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); for (let i = 0; i < nP; i++) ctx.rect(gFP[i * 3] - 3, gFP[i * 3 + 1] - 2, 6, 1); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.beginPath(); for (let i = 0; i < nP; i++) ctx.rect(gFP[i * 3] + 2 * gFP[i * 3 + 2], gFP[i * 3 + 1] - 1, 1, 1); ctx.fill();
    // a manta ray and a sea turtle gliding past
    { const y = gy(2550, 0.8); if (y > -80 && y < H + 80) { const x = mod(W - time * 18, W + 260) - 130, fl = Math.sin(time * 1.6) * 10; ctx.fillStyle = 'rgba(20,40,60,0.9)'; ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.quadraticCurveTo(x, y - 20 - fl, x + 50, y - 34 - fl); ctx.lineTo(x + 20, y); ctx.lineTo(x + 50, y + 34 + fl); ctx.quadraticCurveTo(x, y + 20 + fl, x - 40, y); ctx.fill(); ctx.fillRect(x + 20, y - 1, 60, 2); ctx.fillStyle = 'rgba(220,235,245,0.5)'; ctx.fillRect(x - 30, y - 1, 30, 2); } }
    { const y = gy(2900, 0.85); if (y > -60 && y < H + 60) { const x = mod(time * 24, W + 200) - 100, fl = Math.sin(time * 2) * 6, s2 = 1.6; ctx.fillStyle = '#3d7a4f'; ctx.fillRect(x - 18 * s2, y - 9 * s2, 36 * s2, 18 * s2); ctx.fillStyle = '#5fa36b'; for (let a2 = 0; a2 < 3; a2++) for (let b2 = 0; b2 < 2; b2++) ctx.fillRect(x - 14 * s2 + a2 * 10 * s2, y - 6 * s2 + b2 * 6 * s2, 8 * s2, 5 * s2); ctx.fillStyle = '#c9a66b'; ctx.fillRect(x + 18 * s2, y - 4 * s2, 10 * s2, 8 * s2); ctx.fillRect(x - 10 * s2, y - 17 * s2 + fl, 8 * s2, 10 * s2); ctx.fillRect(x - 10 * s2, y + 9 * s2 - fl, 8 * s2, 10 * s2); ctx.fillRect(x + 8 * s2, y - 13 * s2 + fl, 7 * s2, 6 * s2); ctx.fillRect(x + 8 * s2, y + 7 * s2 - fl, 7 * s2, 6 * s2); } }
    // moon jellies pulsing upward
    for (let i = 0; i < 6; i++) { const y = gy(2350 + i * 160, 0.85) + Math.sin(time * 0.6 + i) * 10 + Math.sin(time * 0.17 + i * 3) * 24; if (y < -40 || y > H + 40) continue; const x = W * (0.2 + 0.6 * hsh(i, 865)) + Math.sin(time * 0.3 + i) * 16, p = 1 + 0.12 * Math.sin(time * 2.4 + i), r = 13 * p;
      ctx.fillStyle = 'rgba(220,235,255,0.32)'; ctx.beginPath(); ctx.ellipse(x, y, r, 9 / p, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x - r, y - 1, r * 2, 2); ctx.fillStyle = 'rgba(255,170,210,0.65)'; for (let q = 0; q < 4; q++) ctx.fillRect(sn(x - 7 + q * 4), sn(y - 4 - (q % 2) * 2), 3, 3);
      ctx.fillStyle = 'rgba(220,235,255,0.35)'; for (let t = 0; t < 7; t++) ctx.fillRect(sn(x - r + 2 + t * r * 0.3), sn(y + 1), 1, 6 + Math.sin(time * 3 + t) * 2); }
    // rising bubbles
    ctx.fillStyle = 'rgba(220,245,255,0.6)'; ctx.beginPath(); for (let i = 0; i < (lo ? 20 : 40); i++) { const y = mod(hsh(i, 864) * H - time * (30 + hsh(i, 865) * 40), H), x = hsh(i, 866) * W + Math.sin(time * 2 + i) * 5, s = 2 + (hsh(i, 867) * 3 | 0); ctx.rect(sn(x), sn(y), s, s); } ctx.fill();
  }

  // ---------- the twilight and midnight zones ----------
  const COMB = ['#ff5f7e', '#ffb35f', '#fff35f', '#5fff9a', '#5fd0ff', '#b75fff'];
  function gDeep(lo, vel) {
    // plankton glittering past, streaking when you fall fast
    if (camS > 3300 && camS < 5600) { const a = Math.min(1, (camS - 3300) / 400) * Math.min(1, (5600 - camS) / 400), str = Math.min(28, Math.abs(vel) / mpp * 0.5 * 0.035);
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#5af0ff'; for (let i = 0; i < (lo ? 40 : 90); i++) { const y = mod(hsh(i, 874) * H * 2 - gpx * 0.5, H * 2) - H * 0.5; if (y < -30 || y > H) continue; const x = hsh(i, 875) * W + Math.sin(time * 0.7 + i) * 10, tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 1.5 + i * 3)); ctx.globalAlpha = 0.9 * a * tw; ctx.fillRect(sn(x), sn(y), 3, Math.max(3, str)); } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    // a sperm whale cruising down to hunt
    { const y = gy(4440, 0.75); if (y > -140 && y < H + 140) { const x = mod(W * 0.8 - time * 13, W + 800) - 400; gWhale(x, y + Math.sin(time * 0.4) * 8, -2.3, 0.1, '#1c2a3c', 'rgba(120,150,180,0.35)', true); } }
    // the giant squid and the shipwreck with its treasure
    if (camS > 3300 && camS < 5600) { const a = Math.min(1, (camS - 3300) / 400) * Math.min(1, (5600 - camS) / 400);
      { const y = gy(4300, 0.7); if (y > -200 && y < H + 300) { const x = W * 0.75 + Math.sin(time * 0.3) * 20; ctx.fillStyle = 'rgba(70,14,24,0.85)'; ctx.beginPath(); ctx.ellipse(x, y, 22, 60, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 22, y - 50); ctx.lineTo(x, y - 90); ctx.lineTo(x + 22, y - 50); ctx.fill(); ctx.beginPath(); for (let t2 = 0; t2 < 8; t2++) for (let s = 0; s < 18; s++) ctx.rect(sn(x - 14 + t2 * 4 + Math.sin(time * 1.5 + s * 0.4 + t2) * s * 1.2), sn(y + 55 + s * 7), 3, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,120,0.9)'; ctx.fillRect(x - 8, y + 30, 4, 4); ctx.fillRect(x + 4, y + 30, 4, 4); } }
      { const y = gy(4900, 1); if (y > -140 && y < H + 80) { const x = W * 0.3; ctx.fillStyle = 'rgba(30,24,18,0.95)'; ctx.beginPath(); ctx.moveTo(x - 110, y - 20); ctx.lineTo(x + 110, y - 36); ctx.lineTo(x + 90, y + 10); ctx.lineTo(x - 90, y + 20); ctx.fill(); ctx.fillRect(x - 20, y - 120, 6, 90); ctx.fillRect(x + 40, y - 96, 5, 64); ctx.fillStyle = 'rgba(60,50,40,0.9)'; ctx.fillRect(x - 60, y - 100, 50, 4); for (let w2 = 0; w2 < 4; w2++) ctx.fillRect(x - 70 + w2 * 40, y - 10, 10, 8);
        ctx.fillStyle = 'rgba(70,60,48,0.8)'; ctx.fillRect(x - 46, y - 104, 26, 3); ctx.fillRect(x - 40, y - 100, 2, 50); ctx.globalCompositeOperation = 'lighter'; halo(x + 20, y - 4, 50, '255,210,90', 0.7 * a); ctx.fillStyle = '#ffe68c'; for (let s = 0; s < 10; s++) { const tw = Math.max(0, Math.sin(time * 4 + s * 1.3)); ctx.globalAlpha = tw * a; ctx.fillRect(sn(x + 4 + hsh(s, 876) * 34), sn(y - 10 + hsh(s, 877) * 10), 2, 2); } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#8a5a2b'; ctx.fillRect(x + 8, y - 8, 24, 12); ctx.fillStyle = '#ffd34d'; ctx.fillRect(x + 8, y - 10, 24, 4); } } }
    // marine snow, glowing jellyfish
    if (camS > 3000 && camS < 7400) {
      const a = Math.min(1, (camS - 3000) / 600) * Math.min(1, (7400 - camS) / 400), str = Math.min(20, Math.abs(vel) / mpp * 0.03);
      ctx.fillStyle = '#dcebff'; ctx.globalAlpha = 0.5 * a; ctx.beginPath(); for (let i = 0; i < (lo ? 40 : 80); i++) { const y = mod(hsh(i, 870) * H - gpx * (0.6 + hsh(i, 871) * 0.6) - time * 6, H); ctx.rect(sn(hsh(i, 872) * W + Math.sin(time + i) * 4), sn(y), 2, Math.max(2, str * (0.6 + hsh(i, 871) * 0.6))); } ctx.fill(); ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 30; i++) { const y = gy(3400 + i * 125, 0.8) + Math.sin(time * 0.8 + i) * 14; if (y < -70 || y > H + 70) continue; const x = W * (0.1 + 0.8 * hsh(i, 873)) + Math.sin(time * 0.4 + i) * 20, pulse = 0.7 + 0.3 * Math.sin(time * 3 + i), c = ['255,120,220', '120,220,255', '190,140,255'][i % 3], js = 0.8 + 1.2 * hsh(i, 878);
        halo(x, y, 46 * js, c, 0.6 * a * pulse); ctx.fillStyle = 'rgb(' + c + ')'; ctx.globalAlpha = 0.75 * a; ctx.beginPath(); ctx.arc(x, y, 16 * js * pulse, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 0.55 * a; ctx.beginPath(); for (let t2 = 0; t2 < 6; t2++) for (let s = 0; s < 10; s++) ctx.rect(sn(x - 12 * js + t2 * 5 * js + Math.sin(time * 2 + s * 0.6 + t2) * 3), sn(y + 2 + s * 6 * js), 2, 5); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.5 * a; ctx.fillRect(sn(x - 6 * js), sn(y - 10 * js), 4, 3); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    // comb jellies: rainbow ripples running down their rows of cilia
    { const a = gOn(3300, 3700, 5200, 5600); if (a > 0) { ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) { const y = gy(3550 + i * 330, 0.78) + Math.sin(time * 0.5 + i * 2) * 12; if (y < -50 || y > H + 50) continue; const x = W * (0.15 + 0.7 * hsh(i, 879)) + Math.sin(time * 0.25 + i) * 30, rw = 15 + hsh(i, 880) * 9, rh = rw * 1.6;
        ctx.strokeStyle = 'rgba(190,225,255,' + (0.35 * a).toFixed(2) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, rw, rh, 0, 0, 6.283); ctx.stroke();
        for (let r = 0; r < 6; r++) { const ox = Math.cos((r + 0.5) / 6 * Math.PI) * rw * 0.85; for (let j = 0; j < 8; j++) { const v = (j + 0.5) / 8 * 2 - 1, yy = y + v * rh * 0.85, xx = x + ox * Math.sqrt(1 - v * v); ctx.fillStyle = COMB[mod(Math.floor(time * 9 - j + r * 2), 6)]; ctx.globalAlpha = a * (0.45 + 0.55 * Math.max(0, Math.sin(time * 6 - j * 0.9))); ctx.fillRect(sn(xx) - 1, sn(yy) - 1, 3, 2); } }
        ctx.globalAlpha = 1; halo(x, y, rw * 2.2, '160,200,255', 0.25 * a); }
      ctx.globalCompositeOperation = 'source-over'; } }
    // lanternfish: rows of blue photophores winking in the dark
    { const y0 = gy(4100, 0.85), a = gOn(3500, 3800, 5000, 5400); if (a > 0 && y0 > -100 && y0 < H + 100) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#8fd8ff'; const cx = mod(time * 22, W + 400) - 200;
      for (let i = 0; i < (lo ? 14 : 28); i++) { const x = cx + (hsh(i, 881) - 0.5) * 220 + Math.sin(time * 1.6 + i) * 6, y = y0 + (hsh(i, 882) - 0.5) * 90 + Math.sin(time + i * 2) * 5, bl = Math.sin(time * 2.2 + i * 1.9) > -0.2; if (!bl) continue; ctx.globalAlpha = a * 0.9; ctx.fillRect(sn(x), sn(y), 2, 2); ctx.fillRect(sn(x - 4), sn(y + 1), 2, 2); ctx.fillRect(sn(x - 8), sn(y + 1), 2, 2); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } }
    // a swarm of glowing krill wheeling in a slow figure-eight, parting around you as you sink through
    { const cy = gy(4620, 0.85), a = gOn(3900, 4200, 5300, 5600); if (a > 0 && cy > -200 && cy < H + 200) { const cx = W * 0.5 + Math.sin(time * 0.13) * W * 0.28, n = lo ? 60 : 150; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#7ae8ff';
      for (let i = 0; i < n; i++) { const ang = time * (0.45 + hsh(i, 883) * 0.5) * (i % 2 ? 1 : -1) + hsh(i, 884) * 6.283, r = 30 + hsh(i, 885) * 120; let x = cx + Math.cos(ang) * r * 1.4 + Math.sin(time * 0.7 + i) * 6, y = cy + Math.sin(ang * 2) * r * 0.3 + Math.sin(ang) * r * 0.22;
        const dx = x - W / 2, dy = y - AY, d2 = dx * dx + dy * dy; if (d2 < 8100 && d2 > 1) { const d = Math.sqrt(d2), k = (90 - d) / d * 0.8; x += dx * k; y += dy * k; }
        ctx.globalAlpha = a * (0.45 + 0.55 * Math.abs(Math.sin(time * 3 + i))); ctx.fillRect(sn(x), sn(y), i % 5 ? 2 : 3, 2); }
      ctx.globalAlpha = 1; halo(cx - 60, cy, 60, '90,200,255', 0.3 * a); halo(cx + 60, cy, 60, '90,200,255', 0.3 * a); ctx.globalCompositeOperation = 'source-over'; } }
    // siphonophores: long glowing chains
    if (camS > 3600 && camS < 7200) {
      const a = Math.min(1, (camS - 3600) / 500) * Math.min(1, (7200 - camS) / 400);
      ctx.globalCompositeOperation = 'lighter';
      const col = ctx.createLinearGradient(W * 0.3, 0, W * 0.7, 0); col.addColorStop(0, 'rgba(60,120,200,0)'); col.addColorStop(0.5, 'rgba(60,120,200,' + (0.1 * a * Math.max(0, 1 - (camS - 3600) / 3000)).toFixed(3) + ')'); col.addColorStop(1, 'rgba(60,120,200,0)'); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#b4e6ff'; for (let c2 = 0; c2 < 5; c2++) { const y0 = gy(4200 + c2 * 520, 0.75), x0 = W * (0.12 + 0.19 * c2) + Math.sin(time * 0.3 + c2) * 30; if (y0 < -400 || y0 > H + 100) continue; for (let b = 0; b < 26; b++) { const bx = x0 + Math.sin(time * 0.9 + b * 0.35 + c2) * (8 + b * 1.2), by = y0 + b * 12, tw = 0.5 + 0.5 * Math.sin(time * 4 - b * 0.5 + c2); if (by < -10 || by > H + 10) continue; if (!lo) halo(bx, by, 8, '120,200,255', 0.35 * a * tw); ctx.globalAlpha = 0.8 * a * tw; ctx.fillRect(sn(bx) - 1, sn(by) - 1, 3, 3); } }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ---------- the trench: black walls closing in, strange fish, and the vents on the floor ----------
  function gTrench(lo) {
    const a = gcl((camS - 4400) / 500); if (a <= 0) return; const y7 = gy(7000, 1), kW = Math.min(1, W / 800);
    // far walls, then near walls with a cold rim of light and glowing colonies
    for (const L of [[0.6, '#0d1c2c', 46], [1, '#060c14', 0]]) { const f = L[0];
      ctx.fillStyle = L[1]; ctx.globalAlpha = 0.97 * a;
      for (const side of [0, 1]) { ctx.beginPath(); let open = false;
        for (let y = 0; y <= H + 6; y += 6) { const m = ((y - AY) / f + gpx) * mpp; if (m < 4600 || (f === 1 && y > y7)) continue; const w2 = (40 + L[2] + 18 * Math.sin(m * 0.02 + side * 3 + f) + 10 * hsh(Math.floor(m / 20), 880 + side)) * kW + gcl((m - 4600) / 2400) * W * (0.18 + (f < 1 ? 0.05 : 0)), x = side ? W - w2 : w2;
          if (!open) { ctx.moveTo(side ? W : 0, y); open = true; } ctx.lineTo(x, y); ctx.lineTo(x, y + 6); if (f === 1) { gR[(y / 6) * 2 + side] = x; } }
        if (open) { ctx.lineTo(side ? W : 0, Math.min(H + 6, f === 1 ? y7 + 6 : H + 6)); ctx.fill(); } } }
    ctx.globalAlpha = 1;
    { const rim = 'rgba(40,120,140,' + (0.55 * a).toFixed(2) + ')'; ctx.fillStyle = rim; ctx.beginPath(); for (let y = 0; y <= H; y += 6) { const m = camS + (y - AY) * mpp; if (m < 4620 || y > y7) continue; for (let side = 0; side < 2; side++) { const x = gR[(y / 6) * 2 + side]; ctx.rect(side ? x : x - 2, y, 2, 6); } } ctx.fill();
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#50ffdc'; ctx.globalAlpha = 0.9 * a; ctx.beginPath(); for (let y = 0; y <= H; y += 6) { const m = camS + (y - AY) * mpp; if (m < 4620 || y > y7) continue; const mi = Math.floor(m / 6); for (let side = 0; side < 2; side++) { if (hsh(mi, 882 + side) > 0.22) continue; const x = gR[(y / 6) * 2 + side], o = 3 + hsh(mi, 883) * 20; ctx.rect(side ? x + o : x - o - 3, y, 3, 3); } } ctx.fill(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    // anglerfish dangling their lures
    for (let i = 0; i < 9; i++) { const y = gy(5200 + i * 200, 0.9); if (y < -40 || y > H + 40) continue; const x = W * (0.18 + 0.64 * hsh(i, 881)) + Math.sin(time * 0.5 + i) * 30, bob = Math.sin(time * 2 + i) * 4, d = i % 2 ? 1 : -1;
      ctx.fillStyle = '#0a0e14'; ctx.beginPath(); ctx.arc(x, y + 18, 13, 0, 6.283); ctx.fill(); ctx.fillRect(x - d * 12 - 6, y + 12, 8, 12); ctx.fillStyle = '#d8ecff'; for (let t = 0; t < 4; t++) { ctx.fillRect(sn(x + d * (6 + t * 2)), sn(y + 19), 1, 3); ctx.fillRect(sn(x + d * (7 + t * 2)), sn(y + 25), 1, 2); }
      ctx.fillStyle = '#1a2230'; ctx.fillRect(sn(x + d * 2), sn(y + 2 + bob), 2, 6); ctx.fillRect(sn(x + d * 4), sn(y + bob), 2 * d, 2); ctx.fillStyle = '#c8ffe0'; ctx.fillRect(sn(x + d * 6) - 2, sn(y + bob) - 2, 4, 4); ctx.globalCompositeOperation = 'lighter'; halo(x + d * 6, y + bob, 26, '140,255,200', 0.7 * a); ctx.globalCompositeOperation = 'source-over'; }
    // a gulper eel snaking by, its tail tip glowing
    { const y = gy(5960, 0.85); if (y > -60 && y < H + 60) { const hx = mod(time * 30, W + 400) - 200, op = 0.5 + 0.5 * Math.sin(time * 1.3); ctx.fillStyle = '#121822'; ctx.beginPath(); for (let k = 0; k < 40; k++) { const x = hx - k * 5, yy = y + Math.sin(time * 3 - k * 0.3) * (2 + k * 0.25); ctx.rect(sn(x), sn(yy), 5, Math.max(2, 5 - k * 0.1)); } ctx.moveTo(hx + 4, y); ctx.lineTo(hx + 22, y - 10 - op * 6); ctx.lineTo(hx + 22, y + 10 + op * 6); ctx.fill();
      const tx = hx - 200, ty = y + Math.sin(time * 3 - 12) * 12; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#ff7ab0'; ctx.fillRect(sn(tx) - 1, sn(ty) - 1, 3, 3); halo(tx, ty, 14, '255,110,170', 0.7 * a); ctx.globalCompositeOperation = 'source-over'; } }
    // a dumbo octopus flapping its ear fins
    { const y = gy(6170, 0.9) + Math.sin(time * 1.1) * 10; if (y > -60 && y < H + 60) { const x = W * 0.66 + Math.sin(time * 0.2) * 60, fl = Math.sin(time * 3.2) * 0.5; ctx.fillStyle = 'rgba(255,176,196,0.9)'; ctx.beginPath(); ctx.ellipse(x, y, 15, 13, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - 15, y - 6, 8, 4, -0.6 + fl, 0, 6.283); ctx.ellipse(x + 15, y - 6, 8, 4, 0.6 - fl, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 16, y); ctx.lineTo(x + 16, y); ctx.lineTo(x + 12 + fl * 6, y + 12); ctx.lineTo(x - 12 - fl * 6, y + 12); ctx.fill(); ctx.fillStyle = 'rgba(200,110,140,0.9)'; for (let k = 0; k < 5; k++) ctx.fillRect(sn(x - 11 + k * 5), sn(y + 9), 2, 5 + (k % 2) * 2); ctx.fillStyle = '#1a0d12'; ctx.fillRect(sn(x - 6), sn(y - 5), 3, 3); ctx.fillRect(sn(x + 4), sn(y - 5), 3, 3); } }
    { const vg = gcl((camS - 6250) / 500); if (vg > 0 && y7 > 0) { const rg = ctx.createRadialGradient(W * 0.55, y7, 0, W * 0.55, y7, H * 0.9); rg.addColorStop(0, 'rgba(255,100,40,' + (0.22 * vg).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,100,40,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; } }
    // the trench floor: soft sediment, black smokers, tube worms, white crabs and a shining brine pool
    if (y7 < H + 140 && y7 > -40) {
      const fl = '#1e1c22'; ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(0, H + 4); for (let x = 0; x <= W + 6; x += 6) ctx.lineTo(x, sn(y7 - 8 - 10 * Math.sin(x * 0.009) - 5 * Math.sin(x * 0.031))); ctx.lineTo(W + 6, H + 4); ctx.fill();
      ctx.fillStyle = '#2c2a32'; for (let x = 0; x <= W; x += 6) ctx.fillRect(x, sn(y7 - 8 - 10 * Math.sin(x * 0.009) - 5 * Math.sin(x * 0.031)), 6, 2);
      { const px0 = W * 0.08, pw = W * 0.16, py = y7 - 4; ctx.fillStyle = '#0b2a3a'; ctx.fillRect(sn(px0), sn(py), pw, 6); ctx.fillStyle = 'rgba(140,220,255,0.6)'; for (let k = 0; k < 6; k++) ctx.fillRect(sn(px0 + mod(k * 31 + time * 12, pw - 8)), sn(py + 1), 6, 1); }
      for (let v = 0; v < 3; v++) { const x = W * [0.32, 0.55, 0.8][v], hgt = [96, 64, 120][v], by = y7 - 10, ty = by - hgt;
        ctx.fillStyle = '#16100e'; for (let s = 0; s < hgt; s += 8) { const w = 12 + (hgt - s) * 0.12 + hsh(s, v + 897) * 6; ctx.fillRect(sn(x - w / 2), sn(by - s - 8), w, 9); } ctx.fillRect(sn(x - 22), sn(by - 6), 44, 8);
        ctx.fillStyle = 'rgba(255,120,50,0.8)'; ctx.fillRect(sn(x - 3), sn(ty - 2), 6, 3); ctx.globalCompositeOperation = 'lighter'; halo(x, ty, 22, '255,110,40', 0.65); halo(x, by - 2, 26, '255,90,30', 0.35); ctx.globalCompositeOperation = 'source-over';
        for (let p2 = 0; p2 < (lo ? 7 : 14); p2++) { const t2 = mod(time * 0.4 + p2 / 14, 1); ctx.fillStyle = 'rgba(70,58,58,' + (0.55 * (1 - t2)).toFixed(2) + ')'; const r2 = 6 + t2 * 30; ctx.beginPath(); ctx.arc(x + Math.sin(t2 * 6 + p2 + v) * 10 * t2, ty - 4 - t2 * 220, r2, 0, 6.283); ctx.fill(); }
        ctx.beginPath(); ctx.fillStyle = '#efe9dc'; for (let t = 0; t < 7; t++) { const tx = x + 16 + t * 4 + (t > 3 ? 4 : 0), th = 12 + hsh(t + v * 7, 898) * 22; ctx.rect(sn(tx), sn(by - th), 3, th); } ctx.fill();
        ctx.fillStyle = '#e8303f'; ctx.beginPath(); for (let t = 0; t < 7; t++) { const tx = x + 16 + t * 4 + (t > 3 ? 4 : 0), th = 12 + hsh(t + v * 7, 898) * 22, sw = Math.round(Math.sin(time * 2 + t) * 1.5); ctx.rect(sn(tx - 1 + sw), sn(by - th - 4), 5, 5); } ctx.fill(); }
      ctx.fillStyle = '#e6e2dc'; for (let k = 0; k < 4; k++) { const x = mod(W * hsh(k, 899) + Math.sin(time * 0.7 + k * 2) * 40 * (k % 2 ? 1 : -1), W), y = y7 - 12 - hsh(k, 900) * 6, lg = Math.sin(time * 9 + k) > 0 ? 1 : 0; ctx.fillRect(sn(x - 4), sn(y - 3), 8, 4); ctx.fillRect(sn(x - 6), sn(y - 1 + lg), 2, 2); ctx.fillRect(sn(x + 4), sn(y - lg), 2, 2); ctx.fillRect(sn(x - 3), sn(y - 6), 2, 3); ctx.fillRect(sn(x + 1), sn(y - 6), 2, 3); }
    }
  }

  // ---------- into the rock: strata, fossils, a buried giant, crystal caverns and the first magma ----------
  function gCave(cx, cy, rw, rh, seed, lo) {
    if (cy + rh < -20 || cy - rh > H + 20) return;
    ctx.save(); ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const t = i / 40 * 6.283, r = 1 + 0.13 * Math.sin(t * 3 + seed) + 0.07 * Math.sin(t * 7 + seed * 2), x = cx + Math.cos(t) * rw * r, y = cy + Math.sin(t) * rh * r * (Math.sin(t) > 0 ? 0.75 : 1); i ? ctx.lineTo(sn(x), sn(y)) : ctx.moveTo(sn(x), sn(y)); }
    ctx.closePath(); ctx.strokeStyle = '#1c120c'; ctx.lineWidth = 8; ctx.stroke(); ctx.clip();
    const ig = ctx.createLinearGradient(0, cy - rh, 0, cy + rh); ig.addColorStop(0, '#120c1c'); ig.addColorStop(0.7, '#241634'); ig.addColorStop(1, '#3a1f4a'); ctx.fillStyle = ig; ctx.fillRect(cx - rw * 1.3, cy - rh * 1.3, rw * 2.6, rh * 2.6);
    // the back of the cavern, sliding by slower than the rock face: pillars and far crystals
    const by = cy - (cy - AY) * 0.35;
    ctx.fillStyle = '#2a1c3a'; for (let k = 0; k < 6; k++) { const x = cx - rw + (k + 0.5) * rw * 2 / 6 + hsh(k, seed) * 20, w = 10 + hsh(k, seed + 1) * 18; ctx.fillRect(sn(x - w / 2), sn(by - rh * 1.2), w, rh * 2.4); ctx.fillStyle = '#3a2850'; ctx.fillRect(sn(x - w / 2), sn(by - rh * 1.2), 3, rh * 2.4); ctx.fillStyle = '#2a1c3a'; }
    for (let k = 0; k < 8; k++) { const x = cx - rw * 0.9 + hsh(k, seed + 2) * rw * 1.8, y = by + rh * 0.35 + hsh(k, seed + 3) * rh * 0.3; gXtal(x, y, 5, 10 + hsh(k, seed + 4) * 14, (hsh(k, seed + 5) - 0.5) * 0.8, '#6a4a9a', '#4a3470'); }
    // stalactites, crystal clusters on the floor and ceiling, a still pool
    ctx.fillStyle = '#3c2a22'; ctx.beginPath(); for (let k = 0; k < 9; k++) { const x = cx - rw * 0.85 + k * rw * 0.21, l = 14 + hsh(k, seed + 6) * 30, ty = cy - rh * (0.86 - 0.12 * Math.abs(k - 4) / 4); ctx.moveTo(sn(x - 5), ty - 10); ctx.lineTo(sn(x + 5), ty - 10); ctx.lineTo(sn(x), ty + l); } ctx.fill();
    const C = [['#d6a8ff', '#8f5cd6', '200,140,255'], ['#a8f0ff', '#4cb4d6', '120,220,255'], ['#ffb0d8', '#d65c9a', '255,130,200']][seed % 3];
    if (seed % 2) { const py = cy + rh * 0.58; ctx.fillStyle = 'rgba(70,130,180,0.55)'; ctx.fillRect(cx - rw * 0.5, sn(py), rw, rh); ctx.fillStyle = 'rgba(200,240,255,0.6)'; for (let k = 0; k < 7; k++) ctx.fillRect(sn(cx - rw * 0.45 + mod(k * 47 + time * 8, rw * 0.9)), sn(py + 2 + (k % 3) * 4), 8, 1); }
    for (let k = 0; k < 7; k++) { const x = cx - rw * 0.75 + k * rw * 0.25 + hsh(k, seed + 7) * 10, y = cy + rh * 0.62 - Math.abs(k - 3) * 3, n = 3; for (let j = 0; j < n; j++) gXtal(x + (j - 1) * 7, y, 7 + hsh(k * 3 + j, seed + 8) * 4, 16 + hsh(k * 3 + j, seed + 9) * 28, (j - 1) * 0.35 + (hsh(k, seed + 10) - 0.5) * 0.3, C[0], C[1]); if (!lo || k % 2) halo(x, y - 12, 24, C[2], 0.45); }
    for (let k = 0; k < 4; k++) { const x = cx - rw * 0.5 + k * rw * 0.33, y = cy - rh * 0.78; gXtal(x, y, 6, 12 + hsh(k, seed + 11) * 14, Math.PI + (hsh(k, seed + 12) - 0.5) * 0.6, C[0], C[1]); }
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#ffffff'; for (let k = 0; k < 10; k++) { const tw = Math.sin(time * 3 + k * 2.1); if (tw < 0.6) continue; ctx.globalAlpha = (tw - 0.6) * 2.5; const x = cx - rw * 0.8 + hsh(k, seed + 13) * rw * 1.6, y = cy + rh * (hsh(k, seed + 14) > 0.5 ? 0.45 : -0.6); ctx.fillRect(sn(x) - 2, sn(y), 5, 1); ctx.fillRect(sn(x), sn(y) - 2, 1, 5); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(170,220,255,0.8)'; for (let k = 0; k < 3; k++) { const x = cx - rw * 0.85 + (k * 3 + 1) * rw * 0.21, ty = cy - rh * 0.7; ctx.fillRect(sn(x), sn(ty + mod(time * 70 + k * 41, rh * 1.3)), 2, 3); }
    ctx.restore();
  }
  function gCrust(lo) {
    const y7 = gy(7000, 1), y88 = gy(8800, 1); if (y7 > H || y88 < -40) return;
    const top = Math.max(0, sn(y7 + 14)), bot = Math.min(H, y88 + 30); if (bot <= top) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, top, W, bot - top); ctx.clip();
    const tile = gStrata(); for (let k = Math.floor((top - y7) / 360); y7 + k * 360 < bot; k++) ctx.drawImage(tile, 0, sn(y7 + k * 360));
    const al = m => 0.25 + 0.45 * gcl((m - 7900) / 900), m0 = toM(top), m1 = toM(bot), tg = ctx.createLinearGradient(0, top, 0, bot); tg.addColorStop(0, rgb(geoCol(m0), al(m0))); tg.addColorStop(1, rgb(geoCol(m1), al(m1))); ctx.fillStyle = tg; ctx.fillRect(0, top, W, bot - top);
    // fossils, geodes and veins of ore, band by band
    const band = 60, b0 = Math.max(0, Math.floor((top - y7) / band)), b1 = Math.ceil((bot - y7) / band);
    for (let b = b0; b <= b1; b++) { const y = sn(y7 + b * band), m = 7000 + b * band * mpp;
      if (hsh(b, 890) < 0.35) { const fx2 = W * (0.1 + 0.8 * hsh(b, 891)), fy = y + band * 0.5, kind = (hsh(b, 895) * 3) | 0; ctx.strokeStyle = 'rgba(240,226,200,0.7)'; ctx.fillStyle = 'rgba(240,226,200,0.7)'; ctx.lineWidth = 2;
        if (kind === 0) { ctx.beginPath(); for (let t2 = 0; t2 < 12; t2 += 0.3) { const r2 = t2 * 1.4; t2 ? ctx.lineTo(fx2 + Math.cos(t2) * r2, fy + Math.sin(t2) * r2) : ctx.moveTo(fx2, fy); } ctx.stroke(); }
        else if (kind === 1) { ctx.beginPath(); ctx.ellipse(fx2, fy, 9, 13, 0, 0, 6.283); ctx.stroke(); for (let s = -9; s <= 9; s += 4) ctx.fillRect(sn(fx2 - 8), sn(fy + s), 16, 1); ctx.fillRect(sn(fx2 - 1), sn(fy - 13), 2, 26); }
        else { ctx.fillRect(sn(fx2 - 16), sn(fy), 30, 2); for (let s = 0; s < 6; s++) { ctx.fillRect(sn(fx2 - 12 + s * 4), sn(fy - 6 + Math.abs(s - 2.5)), 1, 12 - Math.abs(s - 2.5) * 2); } ctx.beginPath(); ctx.moveTo(fx2 + 14, fy - 6); ctx.lineTo(fx2 + 22, fy + 1); ctx.lineTo(fx2 + 14, fy + 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(fx2 - 16, fy + 1); ctx.lineTo(fx2 - 24, fy - 5); ctx.lineTo(fx2 - 24, fy + 7); ctx.closePath(); ctx.stroke(); } }
      if (hsh(b, 892) < 0.3) { const gx = W * (0.1 + 0.8 * hsh(b, 893)), gy4 = y + band * 0.5, gc = ['200,150,255', '130,225,255', '255,130,190'][b % 3]; ctx.globalCompositeOperation = 'lighter'; halo(gx, gy4, 22, gc, 0.5); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgb(' + gc + ')'; for (let c2 = 0; c2 < 5; c2++) { const h3 = 6 + hsh(b * 5 + c2, 894) * 12; ctx.fillRect(gx - 10 + c2 * 4, gy4 - h3 / 2, 3, h3); } }
      if (hsh(b, 896) < 0.22) { ctx.strokeStyle = 'rgba(255,214,90,0.75)'; ctx.lineWidth = 2; ctx.beginPath(); let x = W * hsh(b, 897), yy = y + 8; ctx.moveTo(x, yy); for (let k = 0; k < 8; k++) { x += 14 + hsh(b * 8 + k, 898) * 20; yy += (hsh(b * 8 + k, 899) - 0.5) * 22; ctx.lineTo(sn(x), sn(yy)); } ctx.stroke(); if (Math.sin(time * 2.5 + b) > 0.85) halo(x, yy, 10, '255,220,120', 0.9); }
      if (m > 8300 && hsh(b, 901) < 0.4) { ctx.strokeStyle = 'rgba(255,120,30,' + (0.4 + 0.3 * Math.sin(time * 2 + b)).toFixed(2) + ')'; ctx.lineWidth = 2; ctx.beginPath(); let x = W * hsh(b, 902), yy = y + band; ctx.moveTo(x, yy); for (let k = 0; k < 5; k++) { x += (hsh(b * 5 + k, 903) - 0.5) * 30; yy -= 10 + hsh(k, b) * 8; ctx.lineTo(sn(x), sn(yy)); } ctx.stroke(); }
    }
    // a long-necked giant, millions of years asleep in the rock
    { const cx = W * 0.62, cy = gy(7640, 1); if (cy > -140 && cy < H + 140) { ctx.fillStyle = 'rgba(236,224,196,0.85)'; ctx.beginPath(); const sp = gFP; for (let k = 0; k <= 34; k++) { const u = k / 34, x = cx - 170 + u * 340, y = cy - Math.sin(u * Math.PI) * 26 - (u > 0.72 ? (u - 0.72) * 260 : 0) + (u < 0.25 ? (0.25 - u) * 50 : 0); sp[k * 2] = x; sp[k * 2 + 1] = y; ctx.rect(sn(x) - 2, sn(y) - 2, 5, 4); }
      for (let k = 9; k < 20; k++) { const x = sp[k * 2], y = sp[k * 2 + 1]; ctx.rect(sn(x), sn(y + 3), 2, 18 + Math.sin((k - 9) / 11 * Math.PI) * 10); }
      for (const [k, dx] of [[10, -8], [18, 6]]) { const x = sp[k * 2], y = sp[k * 2 + 1]; ctx.rect(sn(x + dx * 0.3), sn(y + 4), 5, 26); ctx.rect(sn(x + dx), sn(y + 30), 5, 24); ctx.rect(sn(x + dx - 3), sn(y + 53), 10, 3); }
      ctx.fill(); const hx = sp[68], hy = sp[69]; ctx.beginPath(); ctx.moveTo(hx, hy - 6); ctx.lineTo(hx + 18, hy - 2); ctx.lineTo(hx + 16, hy + 5); ctx.lineTo(hx - 2, hy + 4); ctx.fill(); ctx.fillStyle = '#3a2416'; ctx.fillRect(sn(hx + 6), sn(hy - 3), 3, 3); } }
    // crystal caverns
    gCave(W * 0.3, gy(7330, 1), Math.min(W * 0.26, 300), 95, 1, lo); gCave(W * 0.7, gy(7960, 1), Math.min(W * 0.24, 280), 85, 2, lo); gCave(W * 0.42, gy(8420, 1), Math.min(W * 0.3, 340), 105, 3, lo);
    ctx.restore();
  }

  // ---------- the mantle: rivers of lava, rising plumes of hot rock, floating crags ----------
  function gMantle(lo) {
    const y88 = gy(8800, 1), y104 = gy(10400, 1); if (y88 > H + 20 || y104 < -60) return; const top = Math.max(0, y88);
    { const pat = gC.mPat && gC.mPatSrc === gMcell() ? gC.mPat : (gC.mPatSrc = gMcell(), gC.mPat = ctx.createPattern(gC.mPatSrc, 'repeat')), ox = time * 3, oy = -gpx * 0.7; ctx.save(); ctx.translate(ox, oy); ctx.fillStyle = pat; ctx.globalAlpha = gcl((camS - 8600) / 400) * 0.6; ctx.fillRect(-ox, top - oy, W, Math.min(H, y104 + 10) - top); ctx.restore(); }
    // plumes of hot rock rising slowly like a lava lamp
    for (let i = 0; i < (lo ? 4 : 8); i++) { const m = 8900 + mod(hsh(i, 904) * 1500 - time * (9 + hsh(i, 905) * 6), 1500), y = gy(m, 0.6), x = W * (0.08 + 0.84 * hsh(i, 906)) + Math.sin(time * 0.2 + i) * 30, r = 26 + hsh(i, 907) * 40; if (y < top - r * 2 || y > H + r * 2) continue;
      ctx.fillStyle = 'rgba(255,110,30,0.22)'; ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.3, 0, 0, 6.283); ctx.ellipse(x, y + r * 1.6, r * 0.45, r * 0.9, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,160,60,0.3)'; ctx.beginPath(); ctx.ellipse(x, y - r * 0.1, r * 0.68, r * 0.9, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = 'rgba(255,225,130,0.35)'; ctx.beginPath(); ctx.ellipse(x, y - r * 0.2, r * 0.36, r * 0.48, 0, 0, 6.283); ctx.fill(); }
    // glowing veins
    ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 3;
    for (let v = 0; v < 5; v++) { ctx.strokeStyle = 'rgba(255,' + (120 + v * 18) + ',40,0.22)'; ctx.beginPath(); const x0 = W * (0.06 + v * 0.2 + hsh(v, 921) * 0.08), fq = 0.012 + hsh(v, 922) * 0.02; for (let y = top; y <= H; y += 12) { const x = x0 + Math.sin(y * fq + time * 0.5 + v) * (20 + hsh(v, 923) * 30) + Math.sin(y * 0.05 + v * 3 + gpx * 0.02) * 10; y > top ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
    // rivers of lava winding across, crusted plates riding the current
    for (let i = 0; i < 5; i++) { const yr = gy([9000, 9310, 9620, 9930, 10230][i], 1); if (yr < -70 || yr > H + 70) continue; const th = 14 + i * 4, dir = i % 2 ? -1 : 1, rv = x => yr + Math.sin(x * 0.004 + i * 2) * 40 + Math.sin(x * 0.011 + i) * 14;
      ctx.fillStyle = '#2a0e06'; ctx.beginPath(); ctx.moveTo(0, sn(rv(0) - th - 6)); for (let x = 6; x <= W + 6; x += 6) ctx.lineTo(x, sn(rv(x) - th - 6)); for (let x = W + 6; x >= 0; x -= 6) ctx.lineTo(x, sn(rv(x) + th + 6)); ctx.fill();
      ctx.fillStyle = '#ff6a1a'; ctx.beginPath(); ctx.moveTo(0, sn(rv(0) - th)); for (let x = 6; x <= W + 6; x += 6) ctx.lineTo(x, sn(rv(x) - th)); for (let x = W + 6; x >= 0; x -= 6) ctx.lineTo(x, sn(rv(x) + th)); ctx.fill();
      ctx.fillStyle = '#ffd27a'; ctx.beginPath(); for (let x = 0; x <= W; x += 6) { const w2 = th * 0.35 * (0.6 + 0.4 * Math.sin(x * 0.03 - time * 2 * dir)); ctx.rect(x, sn(rv(x) - w2), 6, w2 * 2); } ctx.fill();
      ctx.fillStyle = '#fff4c8'; for (let k = 0; k < (lo ? 10 : 24); k++) { const x = mod(hsh(k, 908 + i) * W + time * 40 * dir, W + 20) - 10; ctx.fillRect(sn(x), sn(rv(x) + (hsh(k, 909) - 0.5) * th), 6, 2); }
      ctx.fillStyle = '#3a160a'; for (let k = 0; k < 6; k++) { const x = mod(hsh(k, 910 + i) * W + time * 26 * dir, W + 60) - 30, y = rv(x) + (hsh(k, 911) - 0.5) * th * 0.8; ctx.fillRect(sn(x - 10), sn(y - 3), 20, 6); ctx.fillStyle = '#ff8a3a'; ctx.fillRect(sn(x - 10), sn(y + 3), 20, 1); ctx.fillStyle = '#3a160a'; }
      ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 4; k++) { const x = W * (k + 0.5) / 4; halo(x, rv(x), 36, '255,140,40', 0.4); } ctx.globalCompositeOperation = 'source-over'; }
    // dark crags drifting past in front, rimmed by the glow below
    for (let i = 0; i < 6; i++) { const y = gy(9000 + i * 260, 1.35); if (y < top - 60 || y > H + 60) continue; const x = W * (i % 2 ? 0.04 + hsh(i, 912) * 0.12 : 0.84 + hsh(i, 912) * 0.12), r = 30 + hsh(i, 913) * 34;
      ctx.fillStyle = '#ff8a3a'; ctx.beginPath(); for (let k = 0; k < 9; k++) { const t = k / 9 * 6.283, rr = r * (0.7 + 0.3 * hsh(k, i + 914)) + 3; ctx.lineTo(sn(x + Math.cos(t) * rr * 1.3), sn(y + 3 + Math.sin(t) * rr * 0.8)); } ctx.fill();
      ctx.fillStyle = '#2c1209'; ctx.beginPath(); for (let k = 0; k < 9; k++) { const t = k / 9 * 6.283, rr = r * (0.7 + 0.3 * hsh(k, i + 914)); ctx.lineTo(sn(x + Math.cos(t) * rr * 1.3), sn(y + Math.sin(t) * rr * 0.8)); } ctx.fill();
      ctx.strokeStyle = 'rgba(255,140,50,' + (0.55 + 0.3 * Math.sin(time * 2 + i)).toFixed(2) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.2); ctx.lineTo(x - r * 0.1, y + r * 0.1); ctx.lineTo(x + r * 0.2, y - r * 0.3); ctx.lineTo(x + r * 0.7, y + r * 0.05); ctx.stroke(); }
    // the underside of the crust: jagged, dripping with melt
    if (y88 > -40 && y88 < H + 40) { ctx.fillStyle = '#2a140c'; ctx.beginPath(); ctx.moveTo(0, y88 - 40); for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, sn(y88 + 6 + hsh(x / 8 | 0, 915) * 22 + Math.sin(x * 0.02) * 6)); ctx.lineTo(W + 8, y88 - 40); ctx.fill();
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,140,40,0.8)'; for (let x = 0; x <= W; x += 8) ctx.fillRect(x, sn(y88 + 6 + hsh(x / 8 | 0, 915) * 22 + Math.sin(x * 0.02) * 6), 8, 2);
      ctx.fillStyle = '#ffb040'; for (let k = 0; k < 10; k++) { const x = W * hsh(k, 916), t = mod(time * 0.6 + hsh(k, 917), 1), y = y88 + 24 + t * 160; ctx.globalAlpha = 1 - t; ctx.fillRect(sn(x), sn(y), 3, 5); } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    // heat shimmer and rising embers
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,220,170,0.07)'; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k < 8; k++) { const y = mod(k * H / 8 - time * 30, H); if (y < top) continue; ctx.moveTo(0, y); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, y + Math.sin(x * 0.03 + time * 3 + k) * 3); } ctx.stroke();
    const ea = gcl((camS - 8600) / 800); for (let c = 0; c < 3; c++) { ctx.fillStyle = ['#ff8c3c', '#ffb24a', '#ffdc6a'][c]; for (let i = c; i < (lo ? 30 : 60); i += 3) { const y = mod(hsh(i, 900) * H - time * (40 + hsh(i, 901) * 80) - gpx * 0.3, H + 20) - 10; if (y < top) continue; const x = hsh(i, 902) * W + Math.sin(time * 2 + i) * 8; ctx.globalAlpha = ea * (0.5 + 0.5 * Math.sin(time * 9 + i)); ctx.fillRect(sn(x), sn(y), 3, 3); } }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  // ---------- the core: swirling liquid iron, the magnetic field, and the white-hot inner core ----------
  function gCore(lo) {
    const y104 = gy(10400, 1); if (y104 > H + 20) return; const top = Math.max(0, y104), a = gcl((camS - 10000) / 600);
    // the boundary: a rolling surface of molten metal
    if (y104 > -30) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,230,160,0.8)'; for (let x = 0; x <= W; x += 6) ctx.fillRect(x, sn(y104 + Math.sin(x * 0.02 + time * 1.5) * 5 + Math.sin(x * 0.051 - time) * 3), 6, 3); ctx.globalCompositeOperation = 'source-over'; }
    // dark currents of liquid iron sweeping across
    ctx.strokeStyle = 'rgba(96,26,6,0.3)'; ctx.lineCap = 'round'; for (let k = 0; k < 6; k++) { const yb = gy(10500 + k * 260, 0.8); if (yb < top - 80 || yb > H + 80) continue; ctx.lineWidth = 8 + (k % 3) * 6; ctx.beginPath(); for (let x = -20; x <= W + 20; x += 16) { const y = yb + Math.sin(x * 0.006 + time * 0.4 + k * 1.7) * 50 + Math.sin(x * 0.017 - time * 0.7 + k) * 14; x > -20 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } ctx.lineCap = 'butt';
    // helical columns of churning iron, all turning with the planet
    ctx.globalCompositeOperation = 'lighter';
    for (let v = 0; v < 3; v++) { const vy = gy(10650 + v * 420, 0.8), vx = W * (0.22 + 0.28 * v) + Math.sin(time * 0.1 + v) * 40, R2 = 150 + v * 25; if (vy < top - R2 || vy > H + R2) continue; ctx.lineWidth = 6;
      for (let arm = 0; arm < 6; arm++) { ctx.strokeStyle = arm % 2 ? 'rgba(255,220,140,0.26)' : 'rgba(150,40,8,0.3)'; ctx.globalCompositeOperation = arm % 2 ? 'lighter' : 'source-over'; ctx.beginPath(); for (let k = 0; k <= 26; k++) { const r = 6 + k / 26 * R2, th = arm * Math.PI / 3 + time * (v % 2 ? 0.35 : -0.35) + r * 0.035 * (v % 2 ? -1 : 1), x = vx + Math.cos(th) * r, y = vy + Math.sin(th) * r * 0.6; if (y < top) { ctx.moveTo(x, y); continue; } k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      ctx.globalCompositeOperation = 'lighter'; halo(vx, vy, 22, '255,230,160', 0.6); }
    ctx.fillStyle = 'rgba(255,232,170,0.4)'; for (let i = 0; i < (lo ? 30 : 70); i++) { const yb = mod(hsh(i, 929) * H * 1.5 - gpx * 0.8, H * 1.5) - H * 0.25, dir = hsh(i, 930) < 0.5 ? 1 : -1, x = mod(hsh(i, 931) * W + time * (30 + hsh(i, 932) * 50) * dir, W + 40) - 20, y = yb + Math.sin(x * 0.008 + i) * 30; if (y < top || y > H) continue; ctx.fillRect(sn(x), sn(y), 10 + (i % 4) * 6, 2); }
    for (let c = 0; c < 3; c++) { const cx = W * (0.1 + c * 0.4) + hsh(c, 924) * 30, w = 26 + hsh(c, 925) * 26, sp = (c % 2 ? -1 : 1) * (1.4 + hsh(c, 926)), fq = 0.025 + hsh(c, 927) * 0.02; for (const back of [1, 0]) { ctx.fillStyle = back ? 'rgba(255,110,30,0.1)' : 'rgba(255,214,130,0.22)'; ctx.beginPath(); for (let y = top; y < H; y += 8) for (let s = 0; s < 2; s++) { const ph = y * fq + time * sp + s * Math.PI, z = Math.cos(ph); if ((z < 0) !== !!back) continue; ctx.rect(sn(cx + Math.sin(ph) * w * (0.8 + 0.2 * Math.sin(y * 0.01 + c))), y, back ? 4 : 6, 8); } ctx.fill(); } }
    // the inner core rising into view: a white-hot ball of iron crystal, its field arching out around it
    const R0 = H * 0.36, yc = gy(12150, 0.35), cxc = W / 2;
    if (yc - R0 * 2.2 < H) { const cg = ctx.createRadialGradient(cxc, yc, R0 * 0.6, cxc, yc, R0 * 2.2); cg.addColorStop(0, 'rgba(255,220,140,0.5)'); cg.addColorStop(1, 'rgba(255,170,60,0)'); ctx.fillStyle = cg; ctx.fillRect(0, Math.max(0, yc - R0 * 2.2), W, H); }
    if (!lo) { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = 'rgba(40,100,210,' + (0.5 * a).toFixed(2) + ')'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.lineDashOffset = -time * 30; ctx.beginPath();
      for (let k = 1; k <= 5; k++) { const L = R0 * (1.25 + k * 0.55); for (const sd of [-1, 1]) { let first = true; for (let t = 0.12; t <= Math.PI - 0.12; t += 0.06) { const r = L * Math.sin(t) ** 2; if (r < R0 * 1.02) { first = true; continue; } const x = cxc + sd * r * Math.sin(t), y = yc - r * Math.cos(t); if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); } } }
      ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.globalCompositeOperation = 'lighter'; }
    if (yc - R0 - 30 < H) { ctx.globalCompositeOperation = 'source-over';
      const bg2 = ctx.createRadialGradient(cxc - R0 * 0.3, yc - R0 * 0.35, R0 * 0.05, cxc, yc, R0); bg2.addColorStop(0, '#fffbe8'); bg2.addColorStop(0.45, '#ffe08a'); bg2.addColorStop(0.82, '#ffab3c'); bg2.addColorStop(1, '#f07818'); ctx.fillStyle = bg2; ctx.beginPath(); ctx.arc(cxc, yc, R0, 0, 6.283); ctx.fill();
      ctx.save(); ctx.clip(); ctx.translate(cxc, yc); ctx.rotate(time * 0.04); ctx.strokeStyle = 'rgba(210,100,30,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); for (let d = 0; d < 3; d++) { const c = Math.cos(d * Math.PI / 3), s2 = Math.sin(d * Math.PI / 3); for (let o = -R0; o <= R0; o += 46) { ctx.moveTo(c * -R0 - s2 * o, s2 * -R0 + c * o); ctx.lineTo(c * R0 - s2 * o, s2 * R0 + c * o); } } ctx.stroke(); ctx.restore();
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,170,60,0.75)'; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k < 64; k++) { const t = k / 64 * 6.283 + time * 0.05, f = Math.max(0, Math.sin(time * 3 + k * 1.7)) * (8 + 18 * hsh(k, 928)); if (f < 2) continue; ctx.moveTo(cxc + Math.cos(t) * R0, yc + Math.sin(t) * R0); ctx.lineTo(cxc + Math.cos(t) * (R0 + f), yc + Math.sin(t) * (R0 + f)); } ctx.stroke(); }
    // sparks streaming upward
    ctx.fillStyle = '#fff2c0'; for (let i = 0; i < (lo ? 20 : 44); i++) { const y = mod(hsh(i, 918) * H - time * (80 + hsh(i, 919) * 120), H + 20) - 10; if (y < top) continue; ctx.globalAlpha = a * (0.4 + 0.6 * Math.sin(time * 11 + i)); ctx.fillRect(sn(hsh(i, 920) * W + Math.sin(time * 3 + i) * 10), sn(y), 2, 4); }
    ctx.globalAlpha = 1;
    const core = gcl((camS - 10200) / 1500) * gcl((11900 - camS) / 600); if (core > 0) { const cg = ctx.createRadialGradient(W / 2, H * 1.15, 0, W / 2, H * 1.15, H * 1.1); cg.addColorStop(0, 'rgba(255,240,170,' + (0.45 * core).toFixed(2) + ')'); cg.addColorStop(0.4, 'rgba(255,170,60,' + (0.22 * core).toFixed(2) + ')'); cg.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H); }
    ctx.globalCompositeOperation = 'source-over';
  }

  function earthWorld(dt) {
    gpx = camS / mpp; const lo = !!window.__low, SURF = 2000, ys = gy(SURF, 1);
    // the air or water, coloured by depth all the way down the screen
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    for (let k = 0; k <= 6; k++) { const s = k / 6; let m = camS + (s * H - AY) * mpp; if (ys > 0 && ys < H) { const above = s * H < ys; if (above && m > SURF - 1) m = SURF - 1; if (!above && m < SURF) m = SURF; } bg.addColorStop(s, rgb(geoCol(m))); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    if (camS < 950) gSpace(lo);
    if (camS > -600 && camS < 1500) gHighSky(lo);
    gSun(ys);
    if (camS > 250 && camS < 1700) gClouds(lo);
    if (camS > 250 && camS < 2050) gMountains(lo);
    if (ys > -260 && ys < H + 320) gCoast(lo, ys);
    if (camS > 1500 && camS < 4300) gShallows(lo, ys);
    if (camS > 3000 && camS < 7600) gDeep(lo, vel);
    if (camS > 4400 && camS < 7700) gTrench(lo);
    if (camS > 6700 && camS < 9300) gCrust(lo);
    if (camS > 8300 && camS < 11000) gMantle(lo);
    if (camS > 9900) gCore(lo);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
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
    const TH = window.__theme;
    if (TH === 'geo') earthWorld(dt); else if (TH === 'sports') stadiumWorld(dt, sy); else {
    // dawn above the treetops
    if (sy > -60) foSky(sy);
    const low = !!window.__low;
    const fog = camS > FLOOR ? 0.75 : Math.min(1, camS / 220) * Math.max(0.25, 1 - camS / 5200);
    if (!low) trunks(0.2, Math.max(5, Math.round(W / 110)), 8, 10, 31, 0.12);
    if (!low) { farFoliage(0.24, 70, 201, 0.18, AP * 0.67, 0.5); mist(0.27, 62, 211, 0.2 * fog); waterfall(); }
    foFar(low);
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
    foMid(low);
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
    foFloor();
    if (near(1750, 100)) for (let r = 0; r < 8; r++) { ctx.fillStyle = 'rgba(125,255,176,' + (0.2 + 0.25 * Math.sin(4 * time + 3 * r)).toFixed(3) + ')'; ctx.fillRect(sn((0.13 * r + 0.05) * W + 14 * Math.sin(0.8 * time + 2 * r)), sn(yOf(1750) + 18 * Math.sin(1.3 * time + r) + (r % 3) * 10), 3, 3); }
    deepLandmarks();
    foLife(low);
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
      foCanopyBloom(sy);
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
    foFront(low);
    // the trunks you are climbing down between
    for (const side of [0, 1]) {
      const w = Math.max(26, Math.min(70, W * 0.06)), x = side ? W - w : 0, top = Math.max(0, sy - 20), bot = Math.min(H, yOf(FLOOR) + 30);
      if (bot > 0 && top < H) {
        fillBark(x, top, w, bot - top, camS / mpp, css(lerp3(air(camS + H * mpp * 0.2), [2, 7, 4], 0.86)), 90 + side);
        foTrunkFlora(side, w);
      }
      if (camS > FLOOR - 200) { ctx.fillStyle = css(lerp3(air(camS + H * mpp * 0.3), rockAt(camS + H * mpp * 0.3), 0.85)); const t2 = Math.max(0, yOf(FLOOR) + 20); ctx.beginPath(); ctx.moveTo(side ? W : 0, t2); for (let y = t2; y <= H + 30; y += 30) ctx.lineTo(side ? W - w * (0.7 + hsh((y + camS / mpp) / 30 | 0, 80 + side) * 0.9) : w * (0.7 + hsh((y + camS / mpp) / 30 | 0, 80 + side) * 0.9), y); ctx.lineTo(side ? W : 0, H + 30); ctx.closePath(); ctx.fill(); foWall(side, w); }
    }
    if (camS < FLOOR + 200) foFronds();
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
    if (TH) themeFront(TH, dt);
    // depth ruler, notes, vignette
    const trek = bc.contains('trek');
    if (vig) { const o = Math.min(0.4, 0.25 + Math.max(0, camS) / 8000).toFixed(2); if (vig.style.opacity !== o) vig.style.opacity = o; }
    if (ruler) ruler.hidden = !trek;
    if (notes) notes.hidden = !trek || bc.contains('quiet') || !!window.__theme;
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
    if (time - ambT > 0.5) { ambT = time; if (window.__amb) window.__amb(window.__theme === 'sports' ? 'stadium' : window.__theme === 'geo' ? 'atlas' : camS < 300 ? 'canopy' : camS < FLOOR ? 'forest' : biomeOf(camS).kind); }
    // the view trails the camera slightly and breathes when idle
    camS += (cam - camS) * (reduce ? 1 : 1 - Math.exp(-6 * dt)); if (Math.abs(cam - camS) < 0.02) camS = cam;
    camS += reduce ? 0 : 0.012 * Math.sin(0.45 * time);
    vel = dt ? (camS - prevS) / dt : 0;
    { let z = -1; for (let i = 0; i < NOTES.length; i++) if (NOTES[i][2] && cam >= NOTES[i][0]) z = i;
      if (zoneAt === -1 && !document.body.classList.contains('trek')) zoneAt = z;
      else if (z > zoneAt && document.body.classList.contains('trek') && !window.__theme) { zoneAt = z; const el = $('zone'); if (el) { el.firstChild.textContent = ''; el.lastChild.textContent = '── ' + NOTES[z][1]; restart(el, 'show'); } snd('zone'); }
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
    if (bloomX && !window.__low && cv.width > 0 && cv.height > 0 && W > 0 && H > 0 && (bloomN++ & 1) === 0) { const bw = Math.max(1, Math.ceil(W / 4)), bh = Math.max(1, Math.ceil(H / 4)); if (bloomC.width !== bw || bloomC.height !== bh) { bloomC.width = bw; bloomC.height = bh; } bloomX.drawImage(cv, 0, 0, bw, bh); const bo = (window.__theme === 'geo' ? (camS > 1900 && camS < 6800 ? 0.75 : 0.5) : window.__theme === 'sports' ? 0.55 : camS > FLOOR ? 0.78 : 0.5).toFixed(2); if (bloomC.style.opacity !== bo) bloomC.style.opacity = bo; }
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
