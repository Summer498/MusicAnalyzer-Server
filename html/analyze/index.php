<?php
function saveTmpFile($name)
{
    $uploaded = $_FILES[$name];
    // print_r(shell_exec("ls /tmp"));
    if (isset($uploaded)) {
        $name = $uploaded["name"];
        $tmp_name = $uploaded["tmp_name"];

        $from = $tmp_name;
        $to = "/" . "uploads/" . $name;
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
$file_path = saveTmpFile("upload");
$chord_progressions = shell_exec("/var/www/html/MusicAnalyzer-server/mimicopy.sh \"{$file_path}\" --debug_mode=false");
?>

<html lang="ja">

<head>
    <title>分析結果</title>
    <meta http-equiv="content-language" content="ja" charset="utf-8">
    <link rel="stylesheet" href="contents_wrapper.css" type="text/css">
</head>

<body>
    <h1>分析結果</h1>

    <?php
    // echo(shell_exec(". ../../MUSIC_ANALYZER/bin/activate"));
    $audio_file = "Mitchie M - ビバハピ.mp4";
    // $audio_file = "DEAREST DROP.mp3";
    // $audio_file = "2go_2.wav";
    $ext = pathinfo($audio_file)["extension"];
    if (in_array($ext, ["mp4"], true)) {
        echo ("<div class=\"video_wrapper\" id=\"audio_area\">");
        echo ("<video src=\"../../resources/$audio_file\" controls autoplay playsinline loop crossorigin=\"use-credintials\"></video>");
        echo ("</div>");
    } else if (in_array($ext, ["mp3", "wav", "m4a"], true)) {
        echo ("<div class=\"audio_wrapper\" id=\"audio_area\">");
        echo ("<audio src=\"../../resources/$audio_file\" controls autoplay crossorigin=\"use-credintials\"></audio>");
        echo ("<div>");
    }
    ?>
    <div id="piano-roll-place"></div>
</body>

</html>

<?php
// バックエンドで計算した結果に合わせてスクリプトを自動生成
echo ("<script>");
// result が JSON フォーマットで送られてくるので, JavaScript オブジェクトとして代入する
echo ("if(window.MusicAnalyzer===undefined){window.MusicAnalyzer={roman:undefined}}");
echo ("window.MusicAnalyzer.roman={$chord_progressions}");
echo ("</script>\n");
// 静的スクリプトを送る
echo ("<script src=\"./show_roman.js\"type=\"module\"></script>")
?>