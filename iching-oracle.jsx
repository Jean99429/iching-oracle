import { useState, useEffect, useCallback } from "react";

/* ─── TRIGRAMS ─────────────────────────────────── */
const TRIGRAMS = {
  "000": { symbol: "☷", zh: "坤", en: "Earth",    nature: "地" },
  "001": { symbol: "☶", zh: "艮", en: "Mountain", nature: "山" },
  "010": { symbol: "☵", zh: "坎", en: "Water",    nature: "水" },
  "011": { symbol: "☴", zh: "巽", en: "Wind",     nature: "风" },
  "100": { symbol: "☳", zh: "震", en: "Thunder",  nature: "雷" },
  "101": { symbol: "☲", zh: "离", en: "Fire",     nature: "火" },
  "110": { symbol: "☱", zh: "兑", en: "Lake",     nature: "泽" },
  "111": { symbol: "☰", zh: "乾", en: "Heaven",   nature: "天" },
};

/* ─── 64 HEXAGRAMS EXTRA DATA ───────────────────── */
const HEX_EXTRA = {
  1:  { grade:`上上卦`, verse:`象曰：困龙得水好运交，不由喜气上眉梢，一切谋望皆如意，向后时运渐渐高。`, desc:`这个卦是同卦（下乾上乾）相叠。象征天，喻龙（德才的君子），又象征纯粹的阳和健，表明兴盛强健。乾卦是根据万物变通的道理，以「元、亨、利、贞」为卦辞，示吉祥如意，教导人遵守天道的德行。` },
  2:  { grade:`上上卦`, verse:`象曰：肥羊失群入山岗，饿虎逢之把口张，适口充肠心欢喜，卦若占之大吉昌。`, desc:`这个卦是同卦（下坤上坤）相叠，阴性。象征地（与乾卦相反），顺从天。承载万物，伸展无穷无尽。坤卦以雌马为象征，表明地道生育抚养万物，而又依天顺时，性情温顺。它以「先迷后得」证明「坤」顺从「乾」，依随「乾」，才能把握正确方向，遵循正道，获取吉利。` },
  3:  { grade:`下下卦`, verse:`象曰：风刮乱丝不见头，颠三倒四犯忧愁，慢从款来左顺遂，急促反惹不自由。`, desc:`这个卦是异卦（下震上坎）相叠，震为雷，喻动；坎为雨，喻险。雷雨交加，险象丛生，环境恶劣。「屯」原指植物萌生大地。万物始生，充满艰难险阻，然而顺时应运，必欣欣向荣。` },
  4:  { grade:`中下卦`, verse:`象曰：卦中爻象犯小耗，君子占之运不高，婚姻合伙有琐碎，做事必然受苦劳。`, desc:`这个卦是异卦（下坎上艮）相叠，艮是山的形象，喻止；坎是水的形象，喻险。卦形为山下有险，仍不停止前进，是为蒙昧，故称蒙卦。但因把握时机，行动切合时宜，因此，具有启蒙和通达的卦象。` },
  5:  { grade:`中上卦`, verse:`象曰：明珠土埋日久深，无光无亮到如今，忽然大风吹土去，自然显露有重新。`, desc:`这个卦是异卦（下乾上坎）相叠，下卦是乾，刚健之意；上卦是坎，险陷之意。以刚逢险，宜稳健之妥，不可冒失行动，观时待变，所往一定成功。` },
  6:  { grade:`中下卦`, verse:`象曰：心中有事事难做，恰是二人争路走，雨下俱是要占先，谁肯让谁走一步。`, desc:`这个卦是异卦（下坎上乾）相叠。同需卦相反，互为「综卦」。乾为刚健，坎为险陷。刚与险，健与险，彼此反对，定生争讼。争讼非善事，务必慎重戒惧。` },
  7:  { grade:`中上卦`, verse:`象曰：将帅领旨去出征，骑着烈马拉硬弓，百步穿杨去得准，箭中金钱喜气生。`, desc:`这个卦是异卦（下坎上坤）相叠。师卦象征军队。坎为水、为险；坤为地、为顺，喻寓兵于农。兵凶战危，用兵乃圣人不得已而为之，顺乎形势，师出有名，故能化凶为吉。` },
  8:  { grade:`上上卦`, verse:`象曰：顺风行船撒起帆，上天又助一蓬风，不用费力逍遥去，任意而行大亨通。`, desc:`这个卦是异卦（下坤上坎）相叠，坤为地；坎为水。水附大地，地纳河海，相互依赖，亲密无间。此卦与师卦完全相反，互为综卦。它阐述的是相亲相辅，宽宏无私，精诚团结的道理。` },
  9:  { grade:`下下卦`, verse:`象曰：苗逢旱天尽焦梢，水想云浓雨不浇，农人仰面长吁气，是从款来莫心高。`, desc:`这个卦是异卦（下乾上巽）相叠，乾为天；巽为风。喻风调雨顺，谷物滋长，故卦名小畜（蓄）。力量有限，须待发展到一定程度，才可大有作为。` },
  10: { grade:`中上卦`, verse:`象曰：凤凰落在西岐山，长鸣几声出圣贤，天降文王开基业，富贵荣华八百年。`, desc:`这个卦是异卦（下兑上乾）相叠，乾为天；兑为泽，以天喻君，以泽喻民，原文：「履（踩）虎尾、不咥（咬）人。」因此，结果吉利。君上民下，各得其位。兑柔遇乾刚，所履危。履意为实践，卦义是脚踏实地的向前进取的意思。` },
  11: { grade:`中中卦`, verse:`象曰：学文满腹入场闱，三元及第得意回，从今解去愁和闷，喜庆平地一声雷。`, desc:`这个卦是异卦（下乾上坤）相叠，乾为天，为阳；坤为地，为阴，阴阳交感，上下互通，天地相交，万物纷纭。反之则凶。万事万物，皆对立，转化，盛极必衰，衰而转盛，故应时而变者泰（通）。` },
  12: { grade:`中中卦`, verse:`象曰：虎落陷坑不堪言，进前容易退后难，谋望不遂自己便，疾病口舌事牵连。`, desc:`这个卦是异卦（下坤上乾）相叠，其结构同泰卦相反，系阳气上升，阴气下降，天地不交，万物不通。它们彼此为「综卦」，表明泰极而否，否极泰来，互为因果。` },
  13: { grade:`中上卦`, verse:`象曰：心中有事犯猜疑，谋望从前不着实，幸遇明人来指引，诸般忧闷自消之。`, desc:`这个卦是异卦（下离上乾）相叠，乾为天，为君；离为火，为臣民百姓，上天下火，火性上升，同于天，上下和同，同舟共济，人际关系和谐，天下大同。` },
  14: { grade:`上上卦`, verse:`象曰：砍树摸雀作事牢，是非口舌自然消，婚姻合伙不费力，若问走失未逃脱。`, desc:`这个卦是异卦（下乾上离）相叠。上卦为离，为火；下卦为乾，为天。火在天上，普照万物，万民归顺，顺天依时，大有所成。` },
  15: { grade:`中中卦`, verse:`象曰：天赐贫人一封金，不争不抢两平分，彼此分得金到手，一切谋望皆遂心。`, desc:`这个卦是异卦（下艮上坤）相叠，艮为山，坤为地。地面有山，地卑（低）而山高，是为内高外低，比喻功高不自居，名高不自誉，位高不自傲。这就是谦。` },
  16: { grade:`中中卦`, verse:`象曰：太公插下杏黄旗，收妖为徒归西岐，自此青龙得了位，一旦谋望百事宜。`, desc:`这个卦是异卦（下坤上震）相叠，坤为地，为顺；震为雷，为动。雷依时出，预示大地回春。因顺而动，和乐之源。此卦与谦卦互为综卦，交互作用。` },
  17: { grade:`中中卦`, verse:`象曰：泥里步踏这几年，推车靠崖在眼前，目下就该再使力，扒上崖去发财源。`, desc:`这个卦是异卦（下震上兑）相叠，震为雷、为动；兑为悦。动而悦就是「随」。随指相互顺从，己有随物，物能随己，彼此沟通。随必依时顺势，有原则和条件，以坚贞为前提。` },
  18: { grade:`中中卦`, verse:`象曰：卦中爻象如推磨，顺当为福反为祸，心中有益且迟迟，凡事尽从忙处错。`, desc:`这个卦是异卦（下巽上艮）相叠，与随卦互为综卦。蛊本意为事，引申为多事、混乱。器皿久不用而生虫称「蛊」，喻天下久安而因循、腐败，必须革新创造，治理整顿，挽救危机，重振事业。` },
  19: { grade:`中上卦`, verse:`象曰：君王无道民倒悬，常想拨云见青天，幸逢明主施仁政，重又安居乐自然。`, desc:`这个卦是异卦（下兑上坤）相叠。坤为地；兑为泽，地高于泽，泽容于地。喻君主亲临天下，治国安邦，上下融洽。` },
  20: { grade:`中上卦`, verse:`象曰：卦遇蓬花旱逢河，生意买卖利息多，婚姻自有人来助，出门永不受折磨。`, desc:`这个卦是异卦（下坤上巽）相叠，风行地上，喻德教遍施。观卦与临卦互为综卦，交相使用。在上者以道义观天下；在下者以敬仰瞻上，人心顺服归从。` },
  21: { grade:`上上卦`, verse:`象曰：运拙如同身受饥，幸得送饭又送食，适口充腹心欢喜，忧愁从此渐消移。`, desc:`这个卦是异卦（下震上离）相叠。离为阴卦；震为阳卦。阴阳相交，咬碎硬物，喻恩威并施，宽严结合，刚柔相济。噬嗑为上下颚咬合，咀嚼。` },
  22: { grade:`中上卦`, verse:`象曰：近来运转瑞气周，窈窕淑女君子求，钟鼓乐之大吉庆，占者逢之喜临头。`, desc:`这个卦是异卦（下离上艮）相叠。离为火为明；艮为山为止。文明而有节制。贲卦论述文与质的关系，以质为主，以文调节。贲，文饰、修饰。` },
  23: { grade:`中下卦`, verse:`象曰：鹊遇天晚宿林中，不知林内先有鹰，虽然同处心生恶，卦若逢之是非轻。`, desc:`这个卦是异卦（下坤上艮）相叠。五阴在下，一阳在上，阴盛而阳孤；高山附于地。二者都是剥落象，故为「剥卦」。此卦阴盛阳衰，喻小人得势，君子困顿，事业败坏。` },
  24: { grade:`中中卦`, verse:`象曰：马氏太公不相合，世人占之忧疑多，恩人无义反为怨，是非平地起风波。`, desc:`这个卦是异卦（下震上坤）相叠。震为雷、为动；坤为地、为顺，动则顺，顺其自然。动在顺中，内阳外阴，循序运动，进退自如，利于前进。` },
  25: { grade:`下下卦`, verse:`象曰：飞鸟失机落笼中，纵然奋飞不能腾，目下只宜守本分，妄想扒高万不能。`, desc:`这个卦是异卦（下震上乾）相叠。乾为天为刚为健；震为雷为刚为动。动而健，刚阳盛，人心振奋，必有所得，但唯循纯正，不可妄行。无妄必有获，必可致福。` },
  26: { grade:`中上卦`, verse:`象曰：忧愁常锁两眉头，千头万绪挂心间，从今以后防开阵，任意行而不相干。`, desc:`这个卦是异卦（下乾上艮）相叠。乾为天，刚健；艮为山，笃实。畜者积聚，大畜意为大积蓄。为此不畏严重的艰难险阻，努力修身养性以丰富德业。` },
  27: { grade:`上上卦`, verse:`象曰：太公独钓渭水河，手执丝杆忧愁多，时来又遇文王访，自此永不受折磨。`, desc:`这个卦是异卦（下震上艮）相叠。震为雷，艮为山。山在上而雷在下，外实内虚。春暖万物养育，依时养贤育民。阳实阴虚，实者养人，虚者为人养。自食其力。` },
  28: { grade:`中下卦`, verse:`象曰：夜晚梦里梦金银，醒来仍不见一文，目下只宜求本分，思想络是空劳神。`, desc:`这个卦是异卦（下巽上兑）相叠。兑为泽、为悦，巽为木、为顺，泽水淹舟，遂成大错。阴阳爻相反，阳大阴小，行动非常，有过度形象，内刚外柔。` },
  29: { grade:`下下卦`, verse:`象曰：一轮明月照水中，只见影儿不见踪，愚夫当财下去取，摸来摸去一场空。`, desc:`这个卦是同卦（下坎上坎）相叠。坎为水、为险，两坎相重，险上加险，险阻重重。一阳陷二阴。所幸阴虚阳实，诚信可豁然贯通。虽险难重重，却方能显人性光彩。` },
  30: { grade:`中上卦`, verse:`象曰：官人来占主高升，庄农人家产业增，生意买卖利息厚，匠艺占之大亨通。`, desc:`这个卦是同卦（下离上离）相叠。离者丽也，附着之意，一阴附丽，上下二阳，该卦象征火，内空外明。离为火、为明、太阳反复升落，运行不息，柔顺为心。` },
  31: { grade:`中上卦`, verse:`象曰：运去黄金失色，时来棒槌发芽，月令无差，且喜心宽意大。`, desc:`这个卦是异卦（下艮上兑）相叠。艮为山；泽为水。兑柔在上，艮刚在下，水向下渗，柔上而刚下，交相感应。感则成。` },
  32: { grade:`中上卦`, verse:`象曰：渔翁寻鱼运气好，鱼来撞网跑不了，别人使本挣不来，谁想一到就凑合。`, desc:`这个卦是异卦（下巽上震）相叠。震为男、为雷；巽为女、为风。震刚在上，巽柔在下。刚上柔下，造化有常，相互助长。阴阳相应，常情，故称为恒。` },
  33: { grade:`下下卦`, verse:`象曰：浓云蔽日不光明，劝君且莫出远行，婚姻求财皆不利，提防口舌到门庭。`, desc:`这个卦是异卦（下艮上乾）相叠。乾为天，艮为山。天下有山，山高天退。阴长阳消，小人得势，君子退隐，明哲保身，伺机救天下。` },
  34: { grade:`中上卦`, verse:`象曰：卦占工师得大木，眼前该着走上路，时来运转多顺当，有事自管放心宽。`, desc:`这个卦是异卦（下乾上震）相叠。震为雷；乾为天。乾刚震动。天鸣雷，云雷滚，声势宏大，阳气盛壮，万物生长。刚壮有力故曰壮。大而且壮，故名大壮。四阳壮盛，积极而有所作为。` },
  35: { grade:`中上卦`, verse:`象曰：锄地锄去苗里草，谁想财帛将人找，一锄锄出银子来，这个运气也算好。`, desc:`这个卦是异卦（下坤上离）相叠。离为日，为光明；坤为地。太阳高悬，普照大地，大地卑顺，万物生长，光明磊落，柔进上行，喻事业蒸蒸日上。` },
  36: { grade:`中下卦`, verse:`象曰：时乖运拙走不着，急忙过河拆了桥，恩人无义反为怨，凡事无功枉受劳。`, desc:`这个卦是异卦（下离上坤）相叠。离为明，坤为顺；离为日；坤为地。日没入地，光明受损，前途不明，环境困难，宜遵时养晦，坚守正道，外愚内慧，韬光养晦。` },
  37: { grade:`下下卦`, verse:`象曰：一朵鲜花镜中开，看着取不来，劝君休把镜花恋，卦若逢之主可怪。`, desc:`这个卦是异卦（下离上巽）相叠。离为火；巽为风。火使热气上升，成为风。一切事物皆应以内在为本，然后伸延到外。发生于内，形成于外。喻先治家而后治天下，家道正，天下安乐。` },
  38: { grade:`下下卦`, verse:`象曰：此卦占来运气歹，如同太公作买卖，贩猪牛快贩羊迟，猪羊齐贩断了宰。`, desc:`这个卦是异卦（下兑上离）相叠。离为火；兑为泽。上火下泽，相违不相济。克则生，往复无空。万物有所不同，必有所异，相互矛盾。睽即矛盾。` },
  39: { grade:`下下卦`, verse:`象曰：大雨倾地雪满天，路上行人苦又寒，拖泥带水费尽力，事不遂心且耐烦。`, desc:`这个卦是异卦（下艮上坎）相叠。坎为水；艮为山。山高水深，困难重重，人生险阻，见险而止，明哲保身，可谓智慧。蹇，跋行艰难。` },
  40: { grade:`中上卦`, verse:`象曰：目下月令如过关，千辛万苦受熬煎，时来恰相有人救，任意所为不相干。`, desc:`这个卦是异卦（下坎上震）相叠。震为雷、为动；坎为水、为险。险在内，动在外。严冬天地闭塞，静极而动。万象更新，冬去春来，一切消除，是为解。` },
  41: { grade:`下下卦`, verse:`象曰：时运不至费心多，比作推车受折磨，山路崎岖吊下耳，左插右按按不着。`, desc:`这个卦是异卦（下兑上艮）相叠。艮为山；兑为泽。上山下泽，大泽浸蚀山根。损益相间，损中有益，益中有损。二者之间，不可不慎重对待。损下益上，治理国家，过度会损伤国基。应损则损，但必量力、适度。` },
  42: { grade:`上上卦`, verse:`象曰：时来运转吉气发，多年枯木又开花，枝叶重生多茂盛，几人见了几人夸。`, desc:`这个卦是异卦（下震上巽）相叠。巽为风；震为雷。风雷激荡，其势愈强，雷愈响，风雷相助互长，交相助益。此卦与损卦相反。它是损上以益下，后者是损下以益上。二卦阐述的是损益的原则。` },
  43: { grade:`上上卦`, verse:`象曰：蜘蛛脱网赛天军，粘住游蜂翅翎毛，幸有大风吹破网，脱离灾难又逍遥。`, desc:`这个卦是异卦（下乾上兑）相叠。乾为天为健；兑为泽为悦。泽气上升，决注成雨，雨施大地，滋润万物。五阳去一阴，去之不难，决即可，故名为夬，夬即决。` },
  44: { grade:`上卦`,  verse:`象曰：他乡遇友喜气欢，须知运气福重添，自今交了顺当运，向后管保不相干。`, desc:`这个卦是异卦（下巽上乾）相叠。乾为天；巽为风。天下有风，吹遍大地，阴阳交合，万物茂盛。姤卦与夬卦相反，互为「综卦」。姤即遘，阴阳相遇。但五阳一阴，不能长久相处。` },
  45: { grade:`中上卦`, verse:`象曰：游鱼戏水被网惊，跳过龙门身化龙，三尺杨柳垂金线，万朵桃花显其能。`, desc:`这个卦是异卦相叠（下坤上兑）。坤为地、为顺；兑为泽、为水。泽泛滥淹没大地，人众多相互斗争，危机必四伏，务必顺天任贤，未雨绸缪，柔顺而又和悦，彼此相得益彰，安居乐业。萃，聚集、团结。` },
  46: { grade:`上上卦`, verse:`象曰：士人来占必得名，生意买卖也兴隆，匠艺逢之交易好，农间庄稼亦收成。`, desc:`这个卦是异卦相叠（下巽上坤）。坤为地、为顺；巽为木、为逊。大地生长树木，逐步的成长，日渐高大成材，喻事业步步高升，前程远大，故名「升」。` },
  47: { grade:`中上卦`, verse:`象曰：时运不来好伤怀，撮上押去把梯抬，一筒虫翼无到手，转了上去下不来。`, desc:`这个卦是异卦（下坎上兑）相叠。兑为阴为泽喻悦；坎为阳为水喻险。泽水困，陷入困境，才智难以施展，仍坚守正道，自得其乐，必可成事，摆脱困境。` },
  48: { grade:`上上卦`, verse:`象曰：枯井破费已多年，一朝流泉出来鲜，资生济渴人称羡，时来运转喜自然。`, desc:`这个卦是异卦（下巽上坎）相叠。坎为水；巽为木。树木得水而蓬勃生长。人靠水井生活，水井由人挖掘而成。相互为养，井以水养人，经久不竭，人应取此德而勤劳自勉。` },
  49: { grade:`上上卦`, verse:`象曰：苗逢旱天渐渐衰，幸得天恩降雨来，忧去喜来能变化，求谋干事遂心怀。`, desc:`这个卦是异卦（下离上兑）相叠。离为火；兑为泽，泽内有水。水在上而下浇，火在下而上升。火旺水干；水大火熄。二者相生亦相克，必然出现变革。变革是宇宙的基本规律。` },
  50: { grade:`中下卦`, verse:`象曰：莺鹜蛤蜊落沙滩，蛤蜊莺鹜两翅扇，渔人进前双得利，失走行人却自在。`, desc:`这个卦是异卦（下巽上离）相叠。燃木煮食，化生为熟，除旧布新的意思。鼎为重宝大器，三足稳重之象。煮食，喻食物充足，不再有困难和困扰。在此基础上宜变革，发展事业。` },
  51: { grade:`中上卦`, verse:`象曰：一口金钟在淤泥，人人拿着当玩石，忽然一日钟悬起，响亮一声天下知。`, desc:`这个卦是同卦（下震上震）相叠。震为雷，两震相叠，反响巨大，可消除沉闷之气，亨通畅达。平日应居安思危，怀恐惧心理，不敢有所怠慢，遇到突发事变，也能安然自若，谈笑如常。` },
  52: { grade:`中下卦`, verse:`象曰：财帛常打心头走，可惜眼前难到手，不如意时且忍耐，逢着闲事休开口。`, desc:`这个卦是同卦（下艮上艮）相叠。艮为山，二山相重，喻静止。它和震卦相反。高潮过后，必然出现低潮，进入事物的相对静止阶段。静止如山，宜止则止，宜行则行。行止即动和静，都不可失机，应恰到好处，动静得宜，适可而止。` },
  53: { grade:`上上卦`, verse:`象曰：俊鸟幸得出笼中，脱离灾难显威风，一朝得意福力至，东西南北任意行。`, desc:`这个卦是异卦（下艮上巽）相叠。艮为山；巽为木。山上有木，逐渐成长，山也随着增高。这是逐渐进步的过程，所以称渐，渐即进，渐渐前进而不急速。` },
  54: { grade:`下下卦`, verse:`象曰：求鱼须当向水中，树上求之不顺情，受尽爬揭难随意，劳而无功运平平。`, desc:`这个卦是异卦（下兑上震）相叠。震为动、为长男；兑为悦、为少女。以少女从长男，产生爱慕之情，有婚姻之动，有嫁女之象，故称归妹。男婚女嫁，天地大义，人的开始和终结。` },
  55: { grade:`上上卦`, verse:`象曰：古镜昏暗好几年，一朝磨明似月圆，君子谋事逢此卦，时来运转喜自然。`, desc:`这个卦是异卦（下离上震）相叠，电闪雷鸣，成就巨大，喻达到顶峰，如日中天。告诫务必注意事物向相反方面发展。治乱相因，盛衰无常，不可不警惕。` },
  56: { grade:`下下卦`, verse:`象曰：飞鸟树上垒窝巢，小人使计举火烧，君占此卦为不吉，一切谋望枉徒劳。`, desc:`这个卦是异卦（下艮上离）相叠。此卦与丰卦相反，互为「综卦」。山中燃火，烧而不止，火势不停地向前蔓延，如同途中行人，急于赶路。因而称旅卦。` },
  57: { grade:`中上卦`, verse:`象曰：一叶孤舟落沙滩，有篙无水进退难，时逢大雨江湖溢，不用费力任往返。`, desc:`这个卦是同卦（下巽上巽）相叠，巽为风，两风相重，长风不绝，无孔不入，巽义为顺。谦逊的态度和行为可无往不利。` },
  58: { grade:`上上卦`, verse:`象曰：这个卦象真可取，觉着做事不费力，休要错过这机关，事事觉得随心意。`, desc:`这个卦是同卦（下泽上泽）相叠。泽为水。两泽相连，两水交流，上下相和，团结一致，朋友相助，欢欣喜悦。兑为悦也。同秉刚健之德，外抱柔和之姿，坚行正道，导民向上。` },
  59: { grade:`下下卦`, verse:`象曰：隔河望见一锭金，欲取岸宽水又深，指望资财难到手，昼思夜想枉费心。`, desc:`这个卦是异卦（下坎上巽）相叠。风在水上行，推波助澜，四方流溢。涣，水流流散之意。象征组织和人心涣散，必用积极的手段和方法克服，战胜弊端，挽救涣散，转危为安。` },
  60: { grade:`上上卦`, verse:`象曰：时来运转喜气生，登台封神姜太公，到此诸神皆退位，纵然有祸不成凶。`, desc:`这个卦是异卦（下兑上坎）相叠。兑为泽；坎为水。泽有水而流有限，多必溢于泽外。因此要有节度，故称节。节卦与涣卦相反，互为综卦，交相使用。天地有节度才能常新，国家有节度才能安稳，个人有节度才能完美。` },
  61: { grade:`下下卦`, verse:`象曰：路上行人色匆匆，急忙无桥过薄冰，小心谨慎过得去，一步错了落水中。`, desc:`这个卦是异卦（下兑上巽）相叠。孚本义孵，孵卵出壳的日期非常准确，有信的意义。卦形外实内虚，喻心中诚信，所以称中孚卦。这是立身处世的根本。` },
  62: { grade:`中上卦`, verse:`象曰：行人路过独木桥，心内惶恐眼里瞧，爽利保其过得去，慢行一定不安牢。`, desc:`这个卦是异卦（下艮上震）相叠。艮为山；震为雷。过山雷鸣，不可不畏惧。阳为大，阴为小，卦外四阴超过中二阳，故称「小过」，小有越过。` },
  63: { grade:`中上卦`, verse:`象曰：金榜以上题姓名，不负当年苦用功，人逢此卦名吉庆，一切谋望大亨通。`, desc:`这个卦是异卦（下离上坎）相叠。坎为水；离为火。水火相交，水在火上，水势压倒火势，救火大功告成。既，已经；济，成也。既济就是事情已经成功，但终将发生变故。` },
  64: { grade:`中下卦`, verse:`象曰：离地着人几丈深，是防偷营劫寨人，后封太岁为凶煞，时加谨慎祸不侵。`, desc:`这个卦是异卦（下坎上离）相叠。离为火；坎为水。火上水下，火势压倒水势，救火大功未成，故称未济。《周易》以乾坤二卦为始，以既济、未济二卦为终，充分反映了变化发展的思想。` },
};



/* ─── 64 HEXAGRAMS ─────────────────────────────── */
// Key = 6-bit binary, line1(bottom) → line6(top), 1=yang 0=yin
const HEX_RAW = [
  ["111111",1,"乾","Qián","The Creative","Supreme success. Perseverance furthers."],
  ["000000",2,"坤","Kūn","The Receptive","Supreme success through quiet perseverance."],
  ["100010",3,"屯","Zhūn","Difficulty at the Beginning","Success through perseverance. Do not act alone."],
  ["010001",4,"蒙","Méng","Youthful Folly","Success. I seek not the youth; the youth seeks me."],
  ["111010",5,"需","Xū","Waiting","Sincerity in the face of danger brings success."],
  ["010111",6,"讼","Sòng","Conflict","Seek counsel. Avoid great undertakings."],
  ["010000",7,"师","Shī","The Army","Discipline and strong leadership bring good fortune."],
  ["000010",8,"比","Bǐ","Holding Together","Union and loyalty bring good fortune."],
  ["111011",9,"小畜","Xiǎo Xù","Small Taming","Success. Clouds gather but no rain yet."],
  ["110111",10,"履","Lǚ","Treading","Tread carefully. Good fortune follows the humble."],
  ["111000",11,"泰","Tài","Peace","The small departs, the great arrives. Good fortune."],
  ["000111",12,"否","Pǐ","Standstill","Stagnation. Small men prevail; retreat inwardly."],
  ["101111",13,"同人","Tóng Rén","Fellowship","Fellowship in the open brings great success."],
  ["111101",14,"大有","Dà Yǒu","Great Possession","Supreme success. Strength and clarity align."],
  ["001000",15,"谦","Qiān","Humility","Success. The noble one brings all to completion."],
  ["000100",16,"豫","Yù","Enthusiasm","Favorable to install helpers and take action."],
  ["100110",17,"随","Suí","Following","Supreme success. No blame."],
  ["011001",18,"蛊","Gǔ","Decay","Supreme success. Renewal requires bold action."],
  ["110000",19,"临","Lín","Approach","Supreme success. But caution as the year turns."],
  ["000011",20,"观","Guān","Contemplation","Wash hands before the offering. Observe with devotion."],
  ["100101",21,"噬嗑","Shì Kè","Biting Through","Success. It furthers to apply the law."],
  ["101001",22,"贲","Bì","Grace","Success in small matters only."],
  ["000001",23,"剥","Bō","Splitting Apart","It does not further to undertake anything."],
  ["100000",24,"复","Fù","Return","Success. The turning point arrives without force."],
  ["100111",25,"无妄","Wú Wàng","Innocence","Supreme success. Do not act without true inner calling."],
  ["111001",26,"大畜","Dà Xù","Great Taming","Perseverance furthers. Nourish great power within."],
  ["100001",27,"颐","Yí","Nourishment","Perseverance brings good fortune. Observe what you nourish."],
  ["011110",28,"大过","Dà Guò","Great Exceeding","The ridgepole sags. Act swiftly before collapse."],
  ["010010",29,"坎","Kǎn","The Abysmal","Sincere action succeeds even in danger."],
  ["101101",30,"离","Lí","The Clinging","Perseverance furthers. Tend to the cow for good fortune."],
  ["001110",31,"咸","Xián","Influence","Success through receptive and persevering openness."],
  ["011100",32,"恒","Héng","Duration","Success. No blame. Constancy furthers."],
  ["001111",33,"遁","Dùn","Retreat","Success. Know when to withdraw gracefully."],
  ["111100",34,"大壮","Dà Zhuàng","Great Power","Perseverance furthers. Do not use power recklessly."],
  ["000101",35,"晋","Jìn","Progress","The powerful prince receives many gifts of horses."],
  ["101000",36,"明夷","Míng Yí","Darkening of Light","Perseverance through adversity. Hide your light."],
  ["101011",37,"家人","Jiā Rén","The Family","Perseverance of the woman furthers. Order within."],
  ["110101",38,"睽","Kuí","Opposition","Good fortune in small matters. Polarity is creative."],
  ["001010",39,"蹇","Jiǎn","Obstruction","Seek counsel in the southwest. Perseverance furthers."],
  ["010100",40,"解","Jiě","Deliverance","The southwest furthers. Act swiftly once liberated."],
  ["110001",41,"损","Sǔn","Decrease","Supreme success through sincere, simple offering."],
  ["100011",42,"益","Yì","Increase","Favorable to undertake something. Cross the great water."],
  ["111110",43,"夬","Guài","Breakthrough","Proclaim truth firmly. Act with caution but resolve."],
  ["011111",44,"姤","Gòu","Coming to Meet","The woman is bold and strong. Proceed with caution."],
  ["000110",45,"萃","Cuì","Gathering Together","Success. The king approaches his temple."],
  ["011000",46,"升","Shēng","Pushing Upward","Supreme success. Seek out the great man. No fear."],
  ["010110",47,"困","Kùn","Oppression","Success through perseverance of the great man."],
  ["011010",48,"井","Jǐng","The Well","The town may change but the well endures. Clean it."],
  ["101110",49,"革","Gé","Revolution","On your own day you will be believed. Supreme success."],
  ["011101",50,"鼎","Dǐng","The Cauldron","Supreme good fortune and success. New beginnings."],
  ["100100",51,"震","Zhèn","The Arousing","Success. Shock brings fear, then laughter."],
  ["001001",52,"艮","Gèn","Keeping Still","Stillness of the back. No blame. Inner quiet."],
  ["001011",53,"渐","Jiàn","Development","The maiden is given in marriage. Good fortune."],
  ["110100",54,"归妹","Guī Mèi","The Marrying Maiden","Undertakings bring misfortune. Proceed with caution."],
  ["101100",55,"丰","Fēng","Abundance","The king attains fullness. Be like the sun at noon."],
  ["001101",56,"旅","Lǚ","The Wanderer","Success in small matters through perseverance."],
  ["011011",57,"巽","Xùn","The Gentle","Success in small matters. Seek counsel of the great."],
  ["110110",58,"兑","Duì","The Joyous","Success through perseverance and genuine joy."],
  ["010011",59,"涣","Huàn","Dispersion","The king approaches his temple. Perseverance furthers."],
  ["110010",60,"节","Jié","Limitation","Success. Galling limitation must not persist."],
  ["110011",61,"中孚","Zhōng Fú","Inner Truth","Even pigs and fishes can be moved. Supreme good fortune."],
  ["001100",62,"小过","Xiǎo Guò","Small Exceeding","Success in small matters only. Do not fly too high."],
  ["101010",63,"既济","Jì Jì","After Completion","Success in small matters. Vigilance at the end."],
  ["010101",64,"未济","Wèi Jì","Before Completion","Success. The young fox nearly crosses the river."],
];

const HEX_MAP = {};
HEX_RAW.forEach(([key, num, zh, pinyin, en, judgment]) => {
  HEX_MAP[key] = { num, zh, pinyin, en, judgment, key,
    lower: TRIGRAMS[key.slice(0, 3)],
    upper: TRIGRAMS[key.slice(3, 6)],
  };
});

/* ─── HELPERS ─────────────────────────────────── */
function castSixLines() {
  return Array.from({ length: 6 }, () => {
    const c = () => Math.random() < 0.5 ? 3 : 2;
    return c() + c() + c(); // 6=old-yin | 7=young-yang | 8=young-yin | 9=old-yang
  });
}
function linesKey(lines) {
  return lines.map(v => v === 7 || v === 9 ? "1" : "0").join("");
}
function changingKey(lines) {
  if (!lines.some(v => v === 6 || v === 9)) return null;
  return lines.map(v => v === 6 ? "1" : v === 9 ? "0" : v === 7 ? "1" : "0").join("");
}

/* ─── LINE COMPONENT ───────────────────────────── */
function HexLine({ value, animate = true }) {
  const isYang = value === 7 || value === 9;
  const isChanging = value === 6 || value === 9;
  return (
    <div style={{ display:"flex", alignItems:"center", height:18, marginBottom:14, gap:6,
      animation: animate ? "lineIn 0.35s ease-out" : "none" }}>
      {isYang ? (
        <div style={{ flex:1, height:5, background:"linear-gradient(90deg,#b8902a,#f0c040,#b8902a)",
          boxShadow:"0 0 10px rgba(240,192,64,0.6)", borderRadius:2 }} />
      ) : (
        <>
          <div style={{ flex:1, height:5, background:"linear-gradient(90deg,#b8902a,#f0c040,#b8902a)",
            boxShadow:"0 0 10px rgba(240,192,64,0.6)", borderRadius:2 }} />
          <div style={{ width:22 }} />
          <div style={{ flex:1, height:5, background:"linear-gradient(90deg,#b8902a,#f0c040,#b8902a)",
            boxShadow:"0 0 10px rgba(240,192,64,0.6)", borderRadius:2 }} />
        </>
      )}
      {isChanging && (
        <div style={{ fontSize:12, color: value===9 ? "#00e87a" : "#ff5555", minWidth:16 }}>
          {value===9 ? "○" : "×"}
        </div>
      )}
    </div>
  );
}

/* ─── CSS ───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}

  .root{min-height:100vh;background:#000;color:#00e87a;font-family:'Share Tech Mono','Courier New',monospace;overflow-x:hidden;}

  .grid-bg{position:fixed;inset:0;
    background-image:linear-gradient(rgba(0,232,122,0.04) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(0,232,122,0.04) 1px,transparent 1px);
    background-size:52px 52px;pointer-events:none;z-index:0;}

  .scanlines{position:fixed;inset:0;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 3px);
    pointer-events:none;z-index:50;}

  .bracket{position:fixed;width:28px;height:28px;border-color:rgba(0,232,122,0.3);border-style:solid;pointer-events:none;z-index:10;}
  .tl{top:14px;left:14px;border-width:1px 0 0 1px;}
  .tr{top:14px;right:14px;border-width:1px 1px 0 0;}
  .bl{bottom:14px;left:14px;border-width:0 0 1px 1px;}
  .br{bottom:14px;right:14px;border-width:0 1px 1px 0;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  @keyframes lineIn{from{opacity:0;transform:scaleX(0.2);}to{opacity:1;transform:scaleX(1);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes glitch{0%,100%{clip-path:inset(0);transform:translate(0);}20%{clip-path:inset(10% 0 60% 0);transform:translate(-2px,2px);color:#0ff;}60%{clip-path:inset(60% 0 10% 0);transform:translate(2px,-2px);color:#f0f;}80%{clip-path:inset(0);transform:translate(0);color:#00e87a;}}
  @keyframes coinAir{0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1;}100%{transform:translateY(-95px) rotate(700deg) scale(0.82);opacity:0.75;}}
  @keyframes coinLand{0%{transform:translateY(-95px) rotate(700deg) scale(0.82);}75%{transform:translateY(5px) rotate(1040deg) scale(1.06);}100%{transform:translateY(0) rotate(1080deg) scale(1);}}
  @keyframes coinIdle{0%,100%{transform:translateY(0) scale(1);opacity:0.3;}50%{transform:translateY(-3px) scale(1.03);opacity:0.45;}}
  @keyframes coinShow{0%{transform:scale(0.9);opacity:0.6;}100%{transform:scale(1);opacity:1;}}

  .screen{animation:fadeUp 0.45s ease-out;position:relative;z-index:1;}

  .T{font-family:'Orbitron',monospace;font-weight:900;letter-spacing:.08em;text-shadow:0 0 28px rgba(0,232,122,0.35);}
  .glitch-anim{animation:glitch 0.25s linear;}

  .btn{background:transparent;font-family:'Share Tech Mono',monospace;cursor:pointer;
    letter-spacing:3px;text-transform:uppercase;transition:all 0.18s;padding:11px 26px;font-size:12px;border:none;}
  .btn-g{color:#00e87a;border:1px solid #00e87a;}
  .btn-g:hover{background:rgba(0,232,122,0.08);box-shadow:0 0 16px rgba(0,232,122,0.25);}
  .btn-gold{color:#c8a030;border:1px solid #c8a030;}
  .btn-gold:hover{background:rgba(200,160,48,0.08);box-shadow:0 0 16px rgba(200,160,48,0.3);color:#ffd700;}
  .btn:active{transform:scale(0.97);}

  .inp{background:rgba(0,232,122,0.025);border:1px solid rgba(0,232,122,0.2);
    color:#00e87a;font-family:'Share Tech Mono',monospace;font-size:13px;
    padding:16px;width:100%;resize:none;outline:none;line-height:1.7;letter-spacing:.04em;transition:border-color .2s;}
  .inp:focus{border-color:rgba(0,232,122,0.55);box-shadow:0 0 10px rgba(0,232,122,0.08);}
  .inp::placeholder{color:rgba(0,232,122,0.22);}

  .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(0,232,122,0.4),transparent);}
  .divider-gold{height:1px;background:linear-gradient(90deg,transparent,rgba(200,160,48,0.4),transparent);}

  .hex-box{border:1px solid rgba(200,160,48,0.3);background:rgba(200,160,48,0.02);}
  .tag-box{border:1px solid rgba(0,232,122,0.12);background:rgba(0,232,122,0.02);}

  .ring{width:28px;height:28px;border:2px solid rgba(0,232,122,0.15);border-top-color:#00e87a;border-radius:50%;animation:spin 1s linear infinite;}
  .dot-g{display:inline-block;width:4px;height:4px;background:#00e87a;border-radius:50%;box-shadow:0 0 5px #00e87a;}
  .dot-gold{display:inline-block;width:4px;height:4px;background:#c8a030;border-radius:50%;box-shadow:0 0 5px #c8a030;}

  .interp{line-height:1.9;font-size:13px;white-space:pre-wrap;animation:fadeUp .6s ease-out;color:rgba(0,232,122,0.88);}

  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:rgba(0,232,122,0.2);}
`;

/* ─── COIN SVG (传统铜钱 · 开元通宝) ──────────────── */
function CoinSVG({ isYang, size = 62 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{display:"block"}}>
      {/* outer glow ring */}
      <circle cx="32" cy="32" r="31" fill="none" stroke="rgba(200,160,48,0.15)" strokeWidth="1"/>
      {/* coin body */}
      <circle cx="32" cy="32" r="29" fill={isYang ? "#1c1000" : "#0e0a00"}
        stroke={isYang ? "#a07828" : "#5a4010"} strokeWidth="1.5"/>
      {/* raised rim */}
      <circle cx="32" cy="32" r="26" fill="none"
        stroke={isYang ? "#c8a030" : "#6a5018"} strokeWidth="0.6" opacity="0.5"/>
      {/* inner ring */}
      <circle cx="32" cy="32" r="20" fill="none"
        stroke={isYang ? "#c8a030" : "#6a5018"} strokeWidth="0.4" opacity="0.3"/>
      {/* square hole */}
      <rect x="24.5" y="24.5" width="15" height="15" fill="#000"
        stroke={isYang ? "#9a7820" : "#4a3808"} strokeWidth="0.8"/>
      {isYang ? (
        /* 字面 · 开元通宝 */
        <>
          <text x="32" y="21" textAnchor="middle" fill="#d4a832" fontSize="8"
            fontFamily="'Noto Serif SC','STSong','SimSun',serif" fontWeight="bold">通</text>
          <text x="32" y="47" textAnchor="middle" fill="#d4a832" fontSize="8"
            fontFamily="'Noto Serif SC','STSong','SimSun',serif" fontWeight="bold">宝</text>
          <text x="20" y="36" textAnchor="middle" fill="#d4a832" fontSize="8"
            fontFamily="'Noto Serif SC','STSong','SimSun',serif" fontWeight="bold">开</text>
          <text x="44" y="36" textAnchor="middle" fill="#d4a832" fontSize="8"
            fontFamily="'Noto Serif SC','STSong','SimSun',serif" fontWeight="bold">元</text>
        </>
      ) : (
        /* 背面 · plain decorative */
        <>
          <circle cx="32" cy="32" r="23" fill="none" stroke="#5a4010" strokeWidth="0.4" opacity="0.4"/>
          <line x1="32" y1="7"  x2="32" y2="12" stroke="#6a5010" strokeWidth="1" opacity="0.35"/>
          <line x1="32" y1="52" x2="32" y2="57" stroke="#6a5010" strokeWidth="1" opacity="0.35"/>
          <line x1="7"  y1="32" x2="12" y2="32" stroke="#6a5010" strokeWidth="1" opacity="0.35"/>
          <line x1="52" y1="32" x2="57" y2="32" stroke="#6a5010" strokeWidth="1" opacity="0.35"/>
          <circle cx="32" cy="32" r="3" fill="none" stroke="#5a4010" strokeWidth="0.5" opacity="0.25"/>
        </>
      )}
      {/* surface sheen */}
      <ellipse cx="24" cy="20" rx="7" ry="4"
        fill={isYang ? "rgba(255,220,100,0.06)" : "rgba(180,140,40,0.03)"} transform="rotate(-20,24,20)"/>
    </svg>
  );
}


export default function IChing() {
  const [screen, setScreen]       = useState("intro");
  const [question, setQuestion]   = useState("");
  const [revealed, setRevealed]   = useState([]);
  const [allLines, setAllLines]   = useState([]);
  const [hexResult, setHexResult] = useState(null);
  const [changeRes, setChangeRes] = useState(null);
  const [interp, setInterp]       = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [tick, setTick]           = useState(0);
  const [glitch, setGlitch]       = useState(false);
  const [castState, setCastState] = useState({ line:-1, phase:"idle", faces:[false,false,false] });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("idle");
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [lang, setLang]           = useState("zh");
  const timerIds = React.useRef([]);

  const T = {
    zh: {
      sysTag:       "// 古老协议已载入",
      headerSub:    "易经 · 占卜引擎",
      hexCount:     "六十四卦",
      introPara1:   "《易经》是人类最古老的典籍之一，距今逾三千年，通过六十四卦揭示宇宙阴阳变化之道。每卦由六爻组成：阳爻（━━━━）实线，代表刚健；阴爻（━━ ━━）虚线，代表柔顺。",
      introPara2:   "",
      introPara3:   "六爻 · 阴阳 · 铜钱起卦法 · 人工智能双语解读",
      appDesc:      "摇铜钱，观六爻，天机自现——结合 Claude AI 为你生成个性化解读。",
      startBtn:     "问卦 →",
      footerNote:   "易经占卜 · 六十四卦 · 铜钱起卦 · Claude AI 解读",
      queryTag:     "// 陈述所惑",
      queryTitle:   "陈述你的问题",
      classicVerse: "诚心所至，陈汝所惑；无问亦可，随缘而卜。",
      classicEn:    "Speak your question with sincerity — or leave it empty, and let fate decide.",
      placeholder:  "在此输入你的问题（可留空进行随机占卜）",
      charLabel:    (n) => `已输入 ${n} 字`,
      noQuery:      "未输入问题 · 开放式起卦",
      backBtn:      "← 返回",
      castHint:     "三枚铜钱，投掷六次，每次定一爻，六爻成卦",
      castBtn:      "摇卦 ◈",
      castingTag:   "// 摇卦进行中",
      lineLabel:    (n) => `第 ${n} 爻`,
      lineDash:     "第 — 爻",
      phaseAir:     "铜钱腾空中...",
      phaseLand:    "落定...",
      phaseIdle:    "准备起卦...",
      coinFace:     "字",
      coinBack:     "背",
      yaoOldYang:   (sum) => sum===3 ? "三字朝上 → 阳爻，此爻将变" : sum===2 ? "二字一背 → 阳爻，稳定" : sum===1 ? "一字二背 → 阴爻，稳定" : "三背朝上 → 阴爻，此爻将变",
      progressTag:  "爻 进度",
      yaoNames:     ["老阳","少阳","少阴","老阴"],
      yaoMap:       {9:"老阳",7:"少阳",8:"少阴",6:"老阴"},
      upperLabel:   "上卦",
      lowerLabel:   "下卦",
      changeTag:    "// 检测到变卦",
      changeText:   "动爻变化，此卦转化为",
      queryEcho:    "你的问题",
      verseTag:     "象曰 · 圣卦象诗",
      descTag:      "卦义 · 传统解读",
      aiTag:        "人工智能解读",
      aiLoading:    "正在解读卦象...",
      resetBtn:     "⟳ 重新起卦",
      recastBtn:    "← 换个问题",
      feedbackBtn:  "✦ 留下感想",
      fbTitle:      "留下你的感想",
      fbSubtitle:   "这次卦准吗？有什么想说的都可以写 ✦",
      fbDone:       "已收到，谢谢你",
      fbCancel:     "取消",
      fbSubmit:     "提交 →",
      fbSending:    "发送中...",
      fbListTitle:  (n) => `全部留言 (${n})`,
      fbEmpty:      "暂无留言",
      fbClose:      "关闭",
      hexNum:       (n) => `第 ${n} 卦`,
    },
    en: {
      sysTag:       "// ANCIENT PROTOCOL LOADED",
      headerSub:    "I CHING · DIVINATION ENGINE",
      hexCount:     "64 HEXAGRAMS",
      introPara1:   "The I Ching (Book of Changes) is one of humanity's oldest oracles — a 3,000-year-old system of 64 hexagrams built from yang (━━━━ solid) and yin (━━ ━━ broken) lines, mapping the archetypal patterns of change.",
      introPara2:   "",
      introPara3:   "Six lines · yin & yang · coin method · AI-powered interpretation",
      appDesc:      "This tool simulates the traditional coin-casting method to generate your hexagram, then uses Claude AI to deliver a personalized interpretation — ask a question, or let fate decide.",
      startBtn:     "CONSULT THE ORACLE →",
      footerNote:   "I CHING ORACLE · 64 HEXAGRAMS · COIN METHOD · POWERED BY CLAUDE AI",
      queryTag:     "// QUERY INPUT",
      queryTitle:   "STATE YOUR QUESTION",
      classicVerse: "诚心所至，陈汝所惑；无问亦可，随缘而卜。",
      classicEn:    "Speak your question with sincerity — or leave it empty, and let fate reveal what must be known.",
      placeholder:  "Type your question here... (leave empty for an open reading)",
      charLabel:    (n) => `[${n} chars · query encoded]`,
      noQuery:      "[no query · open reading]",
      backBtn:      "← BACK",
      castHint:     "Three coins, six throws — each throw determines one line, six lines form the hexagram",
      castBtn:      "CAST THE ORACLE ◈",
      castingTag:   "// GENERATING HEXAGRAM",
      lineLabel:    (n) => `LINE ${n}`,
      lineDash:     "LINE —",
      phaseAir:     "Coins in the air...",
      phaseLand:    "Landing...",
      phaseIdle:    "Preparing cast...",
      coinFace:     "H",
      coinBack:     "T",
      yaoOldYang:   (sum) => sum===3 ? "3 heads → yang line, this line will change" : sum===2 ? "2 heads → yang line, stable" : sum===1 ? "1 head → yin line, stable" : "3 tails → yin line, this line will change",
      progressTag:  "LINE PROGRESS",
      yaoNames:     ["Old Yang","Young Yang","Young Yin","Old Yin"],
      yaoMap:       {9:"Old Yang",7:"Young Yang",8:"Young Yin",6:"Old Yin"},
      upperLabel:   "UPPER",
      lowerLabel:   "LOWER",
      changeTag:    "// TRANSFORMATION DETECTED",
      changeText:   "Moving lines transform this reading →",
      queryEcho:    "QUERY",
      verseTag:     "ORACLE VERSE · 象曰",
      descTag:      "INTERPRETATION · 卦义",
      aiTag:        "AI INTERPRETATION · 人工智能解读",
      aiLoading:    "PROCESSING ANCIENT WISDOM...",
      resetBtn:     "⟳ NEW READING",
      recastBtn:    "← RECAST",
      feedbackBtn:  "✦ LEAVE A NOTE",
      fbTitle:      "Leave Your Thoughts",
      fbSubtitle:   "Was the reading accurate? Share your experience ✦",
      fbDone:       "Received. Thank you.",
      fbCancel:     "CANCEL",
      fbSubmit:     "SUBMIT →",
      fbSending:    "SENDING...",
      fbListTitle:  (n) => `ALL MESSAGES (${n})`,
      fbEmpty:      "No messages yet.",
      fbClose:      "CLOSE",
      hexNum:       (n) => `HEX ${String(n).padStart(2,"0")} / 64`,
    }
  };
  const t = T[lang];

  useEffect(() => {
    const id = setInterval(() => setTick(tk => tk+1), 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (screen !== "intro") return;
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 3000);
    return () => clearInterval(id);
  }, [screen]);

  const fetchAI = useCallback(async (q, lines, hex, chg, currentLang) => {
    setLoadingAI(true);
    setInterp("");
    const moving = lines.map((v,i) => v===9 ? `Line ${i+1}: Old Yang→Yin` : v===6 ? `Line ${i+1}: Old Yin→Yang` : null).filter(Boolean);
    const isEn = currentLang === "en";
    const prompt = `You are a wise I Ching oracle interpreter. Be poetic, precise, and personalized—never generic.

HEXAGRAM ${hex.num}: ${hex.zh} (${hex.pinyin}) — ${hex.en}
Upper: ${hex.upper.en} ${hex.upper.symbol} (${hex.upper.zh}) | Lower: ${hex.lower.en} ${hex.lower.symbol} (${hex.lower.zh})
Judgment: "${hex.judgment}"
${moving.length ? `Moving lines: ${moving.join("; ")}` : "No moving lines — stable reading."}
${chg ? `Transforms → Hexagram ${chg.num}: ${chg.zh} (${chg.en})` : ""}
${q ? `Question: "${q}"` : "Open reading — no specific question."}

${isEn ? `Respond entirely in English. Use this exact format:

INTERPRETATION
[3 sentences. Poetic yet grounded. Speak directly to this hexagram and question.]

GUIDANCE
[One specific, actionable recommendation.]

ESSENCE
[One evocative word or phrase that captures the reading's core.]`
: `请完全用中文回答。使用以下格式：

解读
[3句话。有诗意但接地气。直接针对这个卦象和问题来说。]

指引
[一条具体可行的建议。]

精髓
[一个词，捕捉这次解读的核心。]`}`;

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":"YOUR_API_KEY","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const d = await r.json();
      setInterp(d.content?.find(b=>b.type==="text")?.text ?? (isEn ? "The oracle is silent. Meditate on the hexagram." : "天机不可泄露，静心感悟卦象。"));
    } catch {
      setInterp(isEn ? "The signal is disrupted. Reflect on the hexagram in stillness." : "信号中断。静心感悟卦象。");
    } finally {
      setLoadingAI(false);
    }
  }, []);

  const handleCast = useCallback(() => {
    const cast = castSixLines();
    setAllLines(cast);
    setRevealed([]);
    setInterp("");
    setCastState({ line:-1, phase:"idle", faces:[false,false,false] });
    setScreen("casting");

    const AIR_MS   = 600;
    const LAND_MS  = 600;
    const SHOW_MS  = 800;
    const GAP_MS   = 500;
    const LINE_MS  = AIR_MS + LAND_MS + SHOW_MS + GAP_MS;

    const facesFor = (v) => {
      if (v === 9) return [true,  true,  true ];
      if (v === 7) return [true,  true,  false];
      if (v === 8) return [false, false, true ];
      return             [false, false, false];
    };

    const ids = [];
    for (let i = 0; i < 6; i++) {
      const t2 = i * LINE_MS;
      const faces = facesFor(cast[i]);
      ids.push(setTimeout(() => setCastState({ line:i, phase:"air", faces }), t2));
      ids.push(setTimeout(() => setCastState({ line:i, phase:"land", faces }), t2 + AIR_MS));
      ids.push(setTimeout(() => {
        setCastState({ line:i, phase:"show", faces });
        setRevealed(prev => [...prev, cast[i]]);
      }, t2 + AIR_MS + LAND_MS));
    }

    const finalId = setTimeout(() => {
      const pk = linesKey(cast);
      const ck = changingKey(cast);
      const hex = HEX_MAP[pk];
      const chg = ck ? HEX_MAP[ck] : null;
      setHexResult(hex);
      setChangeRes(chg);
      setScreen("result");
      autoTrack(hex, question, lang);
      fetchAI(question, cast, hex, chg, lang);
    }, 6 * LINE_MS + 800);
    ids.push(finalId);
    timerIds.current = ids;

    // store cast for skipCast
    timerIds.current._cast = cast;
    timerIds.current._lang = lang;
  }, [question, fetchAI]);

  const skipCast = useCallback(() => {
    // clear all pending timers
    timerIds.current.forEach(id => clearTimeout(id));
    const cast = timerIds.current._cast;
    if (!cast) return;
    const currentLang = timerIds.current._lang;
    // reveal all lines instantly
    setRevealed([...cast]);
    setCastState({ line:5, phase:"show", faces:[true,true,true] });
    const pk = linesKey(cast);
    const ck = changingKey(cast);
    const hex = HEX_MAP[pk];
    const chg = ck ? HEX_MAP[ck] : null;
    setHexResult(hex);
    setChangeRes(chg);
    setScreen("result");
    fetchAI(question, cast, hex, chg, currentLang);
  }, [question, fetchAI]);

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackStatus("sending");
    try {
      const key = `feedback:${Date.now()}`;
      const entry = JSON.stringify({ text: feedbackText.trim(), hex: hexResult?.zh || "", time: new Date().toLocaleString("zh-CN") });
      await window.storage.set(key, entry, true);
      setFeedbackStatus("done");
      setFeedbackText("");
      setTimeout(() => { setFeedbackStatus("idle"); setShowFeedback(false); }, 3000);
    } catch {
      setFeedbackStatus("idle");
    }
  };

  const autoTrack = async (hex, q, currentLang) => {
    try {
      const key = `visit:${Date.now()}`;
      const entry = JSON.stringify({
        hex: hex.zh,
        hexEn: hex.en,
        question: q || "（无问题）",
        lang: currentLang,
        time: new Date().toLocaleString("zh-CN")
      });
      await window.storage.set(key, entry, true);
    } catch {}
  };

  const loadFeedback = async () => {
    try {
      const [fbResult, visitResult] = await Promise.all([
        window.storage.list("feedback:", true),
        window.storage.list("visit:", true)
      ]);
      const items = [];
      for (const key of (fbResult?.keys || [])) {
        try {
          const r2 = await window.storage.get(key, true);
          if (r2?.value) items.push({ ...JSON.parse(r2.value), type: "feedback" });
        } catch {}
      }
      for (const key of (visitResult?.keys || [])) {
        try {
          const r2 = await window.storage.get(key, true);
          if (r2?.value) items.push({ ...JSON.parse(r2.value), type: "visit" });
        } catch {}
      }
      items.sort((a,b) => b.time.localeCompare(a.time));
      setFeedbackList(items);
      setShowFeedbackList(true);
    } catch { setFeedbackList([]); setShowFeedbackList(true); }
  };

  const reset = () => {
    setScreen("intro"); setQuestion(""); setRevealed([]); setAllLines([]);
    setHexResult(null); setChangeRes(null); setInterp("");
  };

  const counterStr = String(tick % 9999).padStart(4,"0");

  return (
    <div className="root">
      <style>{CSS}</style>
      <div className="grid-bg"/>
      <div className="scanlines"/>
      <div className="bracket tl"/><div className="bracket tr"/>
      <div className="bracket bl"/><div className="bracket br"/>

      {/* ── HEADER ── */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:52,zIndex:20,
        background:"rgba(0,0,0,0.88)",backdropFilter:"blur(8px)",
        borderBottom:"1px solid rgba(0,232,122,0.12)",
        display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:10,letterSpacing:5,opacity:.45}}>ORACLE.SYS</span>
        <span style={{fontSize:9,letterSpacing:4,opacity:.65}}>{t.headerSub}</span>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>setLang(l=>l==="zh"?"en":"zh")}
            style={{background:"rgba(0,232,122,0.15)",border:"1px solid rgba(0,232,122,0.5)",
              color:"#00e87a",fontFamily:"'Share Tech Mono',monospace",fontSize:11,
              letterSpacing:3,padding:"5px 16px",cursor:"pointer",opacity:1,
              transition:"all .2s",fontWeight:"bold"}}
            onMouseEnter={e=>e.target.style.background="rgba(0,232,122,0.3)"}
            onMouseLeave={e=>e.target.style.background="rgba(0,232,122,0.15)"}>
            {lang==="zh" ? "EN" : "中文"}
          </button>
          <span style={{fontSize:9,opacity:.4,animation:"pulse 2s infinite"}}>● {counterStr}</span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        padding:"64px 24px 24px"}}>

        {/* ═══ INTRO ═══ */}
        {screen==="intro" && (
          <div className="screen" style={{textAlign:"center",maxWidth:580}}>
            <div style={{fontSize:9,letterSpacing:7,opacity:.5,marginBottom:18}}>{t.sysTag}</div>
            <h1 className={`T ${glitch?"glitch-anim":""}`}
              style={{fontSize:"clamp(56px,11vw,96px)",lineHeight:1,marginBottom:6}}>易经</h1>
            <h2 style={{fontFamily:"'Orbitron',monospace",fontWeight:400,fontSize:"clamp(10px,2vw,13px)",
              letterSpacing:14,color:"#c8a030",marginBottom:52}}>
              I&nbsp;C H I N G&nbsp;O R A C L E
            </h2>

            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:44,opacity:.7}}>
              <div className="divider" style={{flex:1}}/><span className="dot-g"/>
              <span style={{fontSize:9,letterSpacing:3}}>{t.hexCount}</span>
              <span className="dot-g"/><div className="divider" style={{flex:1}}/>
            </div>

            <div style={{marginBottom:52,lineHeight:1.9,fontSize:13,textAlign:"left"}}>
              <p style={{color:"#c8a030",marginBottom:18,opacity:.9}}>{t.introPara1}</p>
              <p style={{color:"#00e87a",opacity:.75,fontSize:13,lineHeight:1.8,letterSpacing:.5,marginBottom:18}}>{t.appDesc}</p>
              <p style={{opacity:.6,fontSize:11,lineHeight:1.7,letterSpacing:2}}>{t.introPara3}</p>
            </div>

            <button className="btn btn-g" onClick={()=>setScreen("question")}>
              {t.startBtn}
            </button>

            <div style={{marginTop:20,fontSize:9,opacity:.2,letterSpacing:3}}>
              {t.footerNote}
            </div>
          </div>
        )}

        {/* ═══ QUESTION ═══ */}
        {screen==="question" && (
          <div className="screen" style={{width:"100%",maxWidth:520}}>
            <div style={{fontSize:9,letterSpacing:6,opacity:.55,marginBottom:10}}>{t.queryTag}</div>
            <h2 className="T" style={{fontSize:18,letterSpacing:4,marginBottom:6}}>{t.queryTitle}</h2>
            <p style={{fontSize:12,opacity:.85,marginBottom:8,letterSpacing:2,color:"#c8a030"}}>
              {t.classicVerse}
            </p>
            <p style={{fontSize:10,opacity:.6,marginBottom:32,letterSpacing:1,fontStyle:"italic"}}>
              {t.classicEn}
            </p>

            <textarea className="inp" rows={4} value={question}
              onChange={e=>setQuestion(e.target.value)}
              placeholder={t.placeholder}/>

            <div style={{marginTop:8,marginBottom:32,display:"flex",justifyContent:"space-between",
              fontSize:9,opacity:.55,letterSpacing:1}}>
              <span>{question ? t.charLabel(question.length) : t.noQuery}</span>
              <span style={{animation:question?"pulse 1s infinite":"none"}}>{question?"◈":"◇"}</span>
            </div>

            <div style={{marginBottom:18,fontSize:10,opacity:.5,letterSpacing:1,
              borderLeft:"2px solid rgba(200,160,48,0.3)",paddingLeft:12,lineHeight:1.7}}>
              {t.castHint}
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button className="btn btn-g" onClick={()=>setScreen("intro")} style={{fontSize:11}}>{t.backBtn}</button>
              <button className="btn btn-gold" onClick={handleCast} style={{flex:1,fontSize:13,letterSpacing:4}}>
                {t.castBtn}
              </button>
            </div>
          </div>
        )}

        {/* ═══ CASTING ═══ */}
        {screen==="casting" && (
          <div className="screen" style={{textAlign:"center"}}>
            <div style={{fontSize:9,letterSpacing:6,opacity:.55,marginBottom:10}}>{t.castingTag}</div>
            <h2 className="T" style={{fontSize:15,letterSpacing:8,opacity:.85,marginBottom:8,fontWeight:400}}>
              {castState.line >= 0 ? t.lineLabel(castState.line+1) : t.lineDash}
            </h2>
            <div style={{fontSize:10,opacity:.65,letterSpacing:4,marginBottom:36,minHeight:36}}>
              {castState.phase==="air"  && <span style={{animation:"pulse 0.6s infinite"}}>{t.phaseAir}</span>}
              {castState.phase==="land" && <span>{t.phaseLand}</span>}
              {castState.phase==="show" && (()=>{
                const sum = castState.faces.filter(Boolean).length;
                const colors = {3:"#c8a030",2:"#00e87a",1:"rgba(0,232,122,0.55)",0:"rgba(200,100,100,0.8)"};
                return <span style={{color:colors[sum]}}>{t.yaoOldYang(sum)}</span>;
              })()}
              {castState.phase==="idle" && <span style={{opacity:.4}}>{t.phaseIdle}</span>}
            </div>

            {/* Coins */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",
              gap:18,height:120,marginBottom:36}}>
              {[0,1,2].map(ci => {
                const { phase, faces } = castState;
                const delay = ci * 90;
                let anim = `coinIdle 2.2s ease-in-out ${ci*400}ms infinite`;
                if (phase==="air")  anim = `coinAir  0.48s cubic-bezier(.2,.8,.4,1) ${delay}ms both`;
                if (phase==="land") anim = `coinLand 0.42s cubic-bezier(.1,.9,.3,1) ${delay}ms both`;
                if (phase==="show") anim = `coinShow 0.3s ease-out ${delay}ms both`;
                const showFace = phase==="show" || phase==="land";
                return (
                  <div key={ci} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <div style={{animation:anim}}>
                      <CoinSVG isYang={showFace ? faces[ci] : false} size={62}/>
                    </div>
                    <div style={{fontSize:9,letterSpacing:2,height:14,
                      color: faces[ci] ? "#c8a030" : "rgba(200,160,48,0.28)",
                      opacity: phase==="show" ? 1 : 0,
                      transition:"opacity 0.3s",
                      animation: phase==="show" ? "fadeUp 0.35s ease-out" : "none"}}>
                      {faces[ci] ? t.coinFace : t.coinBack}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Growing hexagram */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:28,flexWrap:"wrap"}}>
              <div className="hex-box" style={{width:172,padding:"20px 36px"}}>
                {Array.from({length:6},(_,i) => {
                  const v = revealed[5-i];
                  if(v===undefined) return (
                    <div key={i} style={{height:22,marginBottom:9,display:"flex",
                      alignItems:"center",gap:6,opacity:.07}}>
                      <div style={{flex:1,height:2,background:"#c8a030",borderRadius:2}}/>
                    </div>
                  );
                  return <HexLine key={i} value={v}/>;
                })}
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:9,opacity:.55,letterSpacing:3,marginBottom:8}}>{t.progressTag}</div>
                <div style={{fontSize:9,opacity:.4,letterSpacing:.5,marginBottom:12,lineHeight:1.7,maxWidth:140}}>
                  {lang==="zh" ? "三枚铜钱正反面之和决定每一爻" : "Coin faces determine each line"}
                </div>
                {Array.from({length:6},(_,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                    <div style={{width:6,height:6,borderRadius:"50%",
                      background: revealed[i] ? "#c8a030" : "rgba(200,160,48,0.1)",
                      boxShadow: revealed[i] ? "0 0 6px #c8a030" : "none",
                      transition:"all 0.3s"}}/>
                    <span style={{fontSize:9,opacity: revealed[i] ? 0.75 : 0.2,letterSpacing:2}}>
                      {lang==="zh" ? `${i+1}爻` : `Line ${i+1}`}{" "}
                      {revealed[i] ? t.yaoMap[revealed[i]] : "···"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginTop:32,textAlign:"center"}}>
              <button className="btn btn-g" style={{fontSize:11,opacity:1,letterSpacing:3}}
                onClick={skipCast}>
                {lang==="zh" ? "跳过动画 →" : "SKIP →"}
              </button>
            </div>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {screen==="result" && hexResult && (
          <div className="screen" style={{width:"100%",maxWidth:680}}>

            <div style={{fontSize:9,letterSpacing:5,opacity:.5,marginBottom:16}}>
              // {t.hexNum(hexResult.num)} · DECODED · {new Date().toLocaleString()}
            </div>

            {/* Main hex block */}
            <div style={{display:"flex",gap:28,marginBottom:36,flexWrap:"wrap",alignItems:"flex-start"}}>
              <div className="hex-box" style={{padding:"20px 28px",flexShrink:0,minWidth:160}}>
                {Array.from({length:6},(_,i)=>(
                  <HexLine key={i} value={allLines[5-i]} animate={false}/>
                ))}
              </div>
              <div style={{flex:1,minWidth:220}}>
                <div className="T" style={{fontSize:"clamp(38px,7vw,64px)",color:"#c8a030",
                  lineHeight:1,marginBottom:4,textShadow:"0 0 20px rgba(200,160,48,0.3)"}}>
                  {hexResult.zh}
                </div>
                <div style={{fontSize:15,color:"#c8a030",opacity:.75,letterSpacing:4,marginBottom:4,
                  fontFamily:"'Noto Serif SC','STSong',serif"}}>
                  {hexResult.upper.nature}{hexResult.lower.nature}{hexResult.zh}
                </div>
                {HEX_EXTRA[hexResult.num] && (
                  <div style={{display:"inline-block",fontSize:10,letterSpacing:3,
                    border:"1px solid rgba(200,160,48,0.7)",padding:"3px 12px",
                    background:"rgba(200,160,48,0.15)",
                    color:"#c8a030",opacity:1,marginBottom:10}}>
                    {HEX_EXTRA[hexResult.num].grade}
                  </div>
                )}
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:"#c8a030",
                  opacity:.85,letterSpacing:3,marginBottom:4}}>
                  {hexResult.pinyin}
                </div>
                <div style={{fontSize:12,letterSpacing:3,opacity:.8,marginBottom:22,textTransform:"uppercase"}}>
                  {hexResult.en}
                </div>
                <div style={{fontSize:10,opacity:.65,lineHeight:2.1,marginBottom:18,letterSpacing:1}}>
                  <div>▲ {t.upperLabel} · {hexResult.upper.symbol} {hexResult.upper.zh} · {hexResult.upper.en}</div>
                  <div>▼ {t.lowerLabel} · {hexResult.lower.symbol} {hexResult.lower.zh} · {hexResult.lower.en}</div>
                </div>
                <div style={{borderLeft:"2px solid rgba(200,160,48,0.35)",paddingLeft:14,
                  fontSize:12,color:"#c8a030",opacity:.95,lineHeight:1.75,fontStyle:"italic"}}>
                  {hexResult.judgment}
                </div>
              </div>
            </div>

            {/* Changing hex */}
            {changeRes && (
              <div className="tag-box" style={{marginBottom:28,padding:"14px 18px"}}>
                <div style={{fontSize:9,letterSpacing:4,opacity:.6,marginBottom:6}}>{t.changeTag}</div>
                <div style={{fontSize:12,letterSpacing:1,lineHeight:1.6}}>
                  {t.changeText}{" "}
                  <span style={{color:"#00e87a",fontFamily:"'Orbitron',monospace",fontSize:13}}>
                    {changeRes.zh} · {changeRes.pinyin} · {changeRes.en}
                  </span>
                </div>
              </div>
            )}

            {/* Query echo */}
            {question && (
              <div style={{marginBottom:24,fontSize:10,opacity:.55,letterSpacing:1,
                borderLeft:"1px solid rgba(0,232,122,0.15)",paddingLeft:12}}>
                {t.queryEcho}: "{question}"
              </div>
            )}

            {/* 古文象诗 */}
            {HEX_EXTRA[hexResult.num] && (
              <div style={{marginBottom:28}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <div className="divider-gold" style={{flex:1}}/>
                  <span className="dot-gold"/>
                  <span style={{fontSize:9,letterSpacing:4,color:"#c8a030",opacity:.7}}>{t.verseTag}</span>
                  <span className="dot-gold"/>
                  <div className="divider-gold" style={{flex:1}}/>
                </div>
                <div style={{borderLeft:"2px solid rgba(200,160,48,0.2)",paddingLeft:16,
                  fontSize:13,color:"#c8a030",opacity:.88,lineHeight:2,
                  fontFamily:"'Noto Serif SC','STSong','SimSun',serif",letterSpacing:1}}>
                  {HEX_EXTRA[hexResult.num].verse}
                </div>
              </div>
            )}

            {/* 卦义 */}
            {HEX_EXTRA[hexResult.num] && (
              <div style={{marginBottom:32}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <div className="divider" style={{flex:1}}/>
                  <span className="dot-g"/>
                  <span style={{fontSize:9,letterSpacing:4,opacity:.65}}>{t.descTag}</span>
                  <span className="dot-g"/>
                  <div className="divider" style={{flex:1}}/>
                </div>
                <div style={{fontSize:13,opacity:.82,lineHeight:1.95,letterSpacing:.5,
                  fontFamily:"'Noto Serif SC','STSong','SimSun',serif"}}>
                  {HEX_EXTRA[hexResult.num].desc}
                </div>
              </div>
            )}

            {/* AI section */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div className="divider-gold" style={{flex:1}}/>
              <span className="dot-gold"/>
              <span style={{fontSize:9,letterSpacing:4,color:"#c8a030",opacity:.8}}>{t.aiTag}</span>
              <span className="dot-gold"/>
              <div className="divider-gold" style={{flex:1}}/>
            </div>

            <div style={{marginBottom:36,minHeight:80}}>
              {loadingAI ? (
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <div className="ring"/>
                  <span style={{fontSize:10,opacity:.7,letterSpacing:3,animation:"pulse 1.5s infinite"}}>
                    {t.aiLoading}
                  </span>
                </div>
              ) : (
                <div className="interp">{interp}</div>
              )}
            </div>

            <div className="divider" style={{marginBottom:24}}/>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button className="btn btn-g" onClick={reset}>{t.resetBtn}</button>
              <button className="btn btn-g" style={{opacity:.45}}
                onClick={()=>{setScreen("question");setInterp("");}}>{t.recastBtn}</button>
              <button className="btn btn-gold" onClick={()=>setShowFeedback(true)}
                style={{marginLeft:"auto"}}>{t.feedbackBtn}</button>
            </div>

            {/* ── FEEDBACK MODAL ── */}
            {showFeedback && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:100,
                display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
                onClick={e=>{ if(e.target===e.currentTarget) setShowFeedback(false); }}>
                <div style={{width:"100%",maxWidth:440,border:"1px solid rgba(200,160,48,0.35)",
                  background:"#050500",padding:32,animation:"fadeUp .3s ease-out"}}>
                  <div style={{fontSize:9,letterSpacing:5,opacity:.3,marginBottom:12}}>// USER FEEDBACK</div>
                  <h3 style={{fontFamily:"'Orbitron',monospace",fontSize:14,color:"#c8a030",
                    letterSpacing:4,marginBottom:6}}>{t.fbTitle}</h3>
                  <p style={{fontSize:10,opacity:.65,letterSpacing:1,marginBottom:20}}>{t.fbSubtitle}</p>
                  {feedbackStatus === "done" ? (
                    <div style={{textAlign:"center",padding:"24px 0",animation:"fadeUp .3s ease-out"}}>
                      <div style={{fontSize:22,marginBottom:8}}>✦</div>
                      <div style={{color:"#c8a030",letterSpacing:3,fontSize:12}}>{t.fbDone}</div>
                    </div>
                  ) : (
                    <>
                      <textarea className="inp" rows={4} value={feedbackText}
                        onChange={e=>setFeedbackText(e.target.value)}
                        placeholder={lang==="zh" ? "写下你的想法..." : "Share your thoughts..."}/>
                      <div style={{display:"flex",gap:10,marginTop:14}}>
                        <button className="btn btn-g" style={{fontSize:10,opacity:.45}}
                          onClick={()=>setShowFeedback(false)}>{t.fbCancel}</button>
                        <button className="btn btn-gold" style={{flex:1,fontSize:12}}
                          onClick={submitFeedback}
                          disabled={feedbackStatus==="sending" || !feedbackText.trim()}>
                          {feedbackStatus==="sending" ? t.fbSending : t.fbSubmit}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── FEEDBACK LIST ── */}
            {showFeedbackList && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:100,
                display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
                onClick={e=>{ if(e.target===e.currentTarget) setShowFeedbackList(false); }}>
                <div style={{width:"100%",maxWidth:520,maxHeight:"70vh",overflowY:"auto",
                  border:"1px solid rgba(0,232,122,0.2)",background:"#020200",padding:28,
                  animation:"fadeUp .3s ease-out"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div>
                      <span style={{fontFamily:"'Orbitron',monospace",fontSize:11,letterSpacing:4,opacity:.6}}>
                        后台数据
                      </span>
                      <div style={{fontSize:9,opacity:.35,letterSpacing:2,marginTop:4}}>
                        访问 {feedbackList.filter(i=>i.type==="visit").length} · 留言 {feedbackList.filter(i=>i.type==="feedback").length}
                      </div>
                    </div>
                    <button className="btn btn-g" style={{fontSize:9,padding:"4px 12px"}}
                      onClick={()=>setShowFeedbackList(false)}>{t.fbClose}</button>
                  </div>
                  {feedbackList.length === 0 ? (
                    <div style={{textAlign:"center",opacity:.3,fontSize:12,padding:"32px 0"}}>{t.fbEmpty}</div>
                  ) : feedbackList.map((item,i) => (
                    <div key={i} style={{borderBottom:"1px solid rgba(0,232,122,0.07)",
                      paddingBottom:14,marginBottom:14}}>
                      <div style={{display:"flex",gap:10,marginBottom:6,fontSize:9,opacity:.4,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{
                          fontSize:8,letterSpacing:2,padding:"1px 6px",
                          border: item.type==="feedback" ? "1px solid rgba(200,160,48,0.5)" : "1px solid rgba(0,232,122,0.3)",
                          color: item.type==="feedback" ? "#c8a030" : "#00e87a"
                        }}>
                          {item.type==="feedback" ? "留言" : "访问"}
                        </span>
                        <span>{item.time}</span>
                        {item.hex && <span style={{color:"#c8a030"}}>· {item.hex} {item.hexEn ? `(${item.hexEn})` : "卦"}</span>}
                        {item.lang && <span style={{opacity:.5}}>· {item.lang==="zh"?"中文":"EN"}</span>}
                      </div>
                      {item.type==="visit" && item.question && (
                        <div style={{fontSize:11,opacity:.6,marginBottom:4,fontStyle:"italic"}}>
                          问：{item.question}
                        </div>
                      )}
                      {item.type==="feedback" && (
                        <div style={{fontSize:13,lineHeight:1.75,opacity:.8}}>{item.text}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:34,zIndex:20,
        background:"rgba(0,0,0,0.82)",borderTop:"1px solid rgba(0,232,122,0.08)",
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:8,letterSpacing:4,opacity:.18,cursor:"pointer",userSelect:"none"}}
          onDoubleClick={loadFeedback}>
          {t.footerNote}
        </span>
      </div>
    </div>
  );
}
