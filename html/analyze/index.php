<?php
function saveTmpFile($name)
{
  $uploaded = $_FILES[$name];
  // print_r(shell_exec("ls /tmp"));
  if (isset($uploaded)) {
    $name = $uploaded["name"];
    $tmp_name = $uploaded["tmp_name"];

    $from = $tmp_name;
    $to = "/uploads/{$name}";
    if (!move_uploaded_file($from, $to)) {
      echo ("Failed to save file." . "<BR>");
      return null;
    }
    return $to;
  }
  return null;
}
?>
<?php
setlocale(LC_ALL, 'ja_JP.UTF-8');
$song_file_path = saveTmpFile("upload");
$song_file_name = basename($song_file_path);
$song_file_ext = pathinfo($song_file_name)["extension"];
$song_name = pathinfo($song_file_name)["filename"];
$m_src = "../../resources/$song_name/$song_file_name"; // media source

$chords = shell_exec("../../ranalyze.sh \"{$song_file_path}\" --quiet");
$melodies = shell_exec("../../manalyze.sh \"{$song_file_path}\" --quiet");
shell_exec("mv \"$song_file_path\" \"$m_src\"");
?>
<html lang="ja">

<head>
  <title>Analysis Result</title>
  <meta http-equiv="content-language" content="ja" charset="utf-8">
  <link rel="stylesheet" href="contents_wrapper.css" type="text/css">
</head>

<body>
  <h1>Analysis Result</h1>
  <?php
  $m_opt = "controls autoplay playsinline loop crossorigin=\"use-credintials\""; // media option
  $m_type = (in_array($song_file_ext, ["mp4"], true)) ? "video" : "audio"; // media type
  echo ("<div class=\"".$m_type."_wrapper\" id=\"audio_area\">");
  echo ("<$m_type src=\"$m_src\" id=\"audio_player\" $m_opt></$m_type>");
  echo ("</div>");
  ?>
  <div id="piano_roll_place"></div>
</body>

</html>
<?php

// バックエンドで計算した結果に合わせてスクリプトを自動生成
// --> TODO: ここを fetch に直す
echo ("<script>");
// result が JSON フォーマットで送られてくるので, JavaScript オブジェクトとして代入する
echo ("if(window.MusicAnalyzer===undefined){window.MusicAnalyzer={roman:undefined,melody:undefined}}");
echo ("window.MusicAnalyzer.roman={$chords};");
echo ("window.MusicAnalyzer.melody={$melodies};");
echo ("</script>\n");
// <-- TODO: ここを fetch に直す

// 静的スクリプトを送る
echo ("<script src=\"./dist/index.global.js\"type=\"module\"></script>");
?>