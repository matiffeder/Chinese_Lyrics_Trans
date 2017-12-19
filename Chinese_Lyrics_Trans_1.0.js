// ==PREPROCESSOR==
// @name "Chinese Lyrics Trans"
// @version "1.0"
// @import "%fb2k_path%skins\Mnlt2\Common.js"
// @import "%fb2k_path%skins\Mnlt2\ChineseTrans.js"
// ==/PREPROCESSOR==

//var dir = window.GetProperty("含「.」、簡單、不友善", "$replace($substr(%path%,1,$strrchr(%path%,.)),\,\\)"));
window.GetProperty("支援 lrc 和 txt", "預設為與歌曲同資料夾且檔名相同的檔案");
var dir = window.GetProperty("歌詞路徑，不含副檔名：", "$replace($replace(%path%,%filename_ext%,%filename%),\,\\)");
var g_fade = false;
var img = "繁";
var word;
function init_btns() {
	word = gdi.CreateImage(16, 16);
	var gb = word.GetGraphics();
	gb.GdiDrawText(img, gdi.Font("Segoe UI", 12, 0), window.InstanceType==0 ? window.GetColorCUI(0) : 0xffffffff, 0, 0, 16, 16, 0x00000001 | 0x00000004);
	word.ReleaseGraphics(gb);
}
init_btns();
var ActiveBtn = new Button(2, 2, 16, 16, word, word, word, "歌詞簡轉繁");
var alpha = new FadeAnim(0);

function on_paint(gr) {
	ActiveBtn.Draw(gr, alpha.Count);
}

function on_mouse_move(x, y) {
	if (!g_fade) {
		alpha.Fade(255, 10);
		g_fade = true;
	}
	ActiveBtn.Move(x, y);
}

function on_mouse_leave(x, y) {
	alpha.Fade(0, -10);
	g_fade = false;
}

function on_mouse_lbtn_down(x, y) {
	if (ActiveBtn.Down()) {
		var path, set;
		var fs = new ActiveXObject("Scripting.FileSystemObject");
		path = fb.TitleFormat(dir + ".").Eval();
		if (fs.Fileexists(path + "lrc"))
			path = path + "lrc";
		else if (fs.Fileexists(path + "txt"))
			path = path + "txt";
		else {
			img = "X";
			ActiveBtn.Tooltip("轉換失敗，找不到歌詞檔。");
		}
		set = path && utils.FileTest(path, "chardet");
		if (adodb_charset(set)) {
			var ado = new ActiveXObject("ADODB.Stream");
			ado.Open();
			ado.Charset = adodb_charset(set);
			ado.LoadFromFile(path);
			ado.WriteText(TransChinese(utils.ReadTextFile(path, set), 1));
			ado.SaveToFile(path, 2);
			ado.Close();
			img = "O";
			ActiveBtn.Tooltip("已轉換，請重讀歌詞。");
		} else if (img!="X") {
			img = "X";
			ActiveBtn.Tooltip("轉換失敗，無法識別編碼。");
		}
		fs = null;
		init_btns();
		ActiveBtn.ChangeImg(word, word, word);
	}
}

function on_mouse_rbtn_down(x, y) {
	if (!utils.IsKeyPressed(0x10) && ActiveBtn.Down()) {
		var menu = window.CreatePopupMenu();
		menu.AppendMenuItem(MF_STRING, 1, "設定目標歌詞路徑");
		menu.TrackPopupMenu(x, y) && window.ShowProperties();
	}
}

function on_playback_new_track(metadb) {
	img = "繁";
	init_btns();
	ActiveBtn.ChangeImg(word, word, word);
	ActiveBtn.Tooltip("歌詞簡轉繁");
}

// wirtten by matif
