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
</head>

<body>
    <h1>分析結果</h1>
    <?php
        echo(shell_exec(". ../../MUSIC_ANALYZER/bin/activate"));
    ?>
    <div name="piano-roll-place"></div>
</body>

</html>

<?php
    // バックエンドで計算した結果に合わせてスクリプトを自動生成
    echo("<script>");
    // result が JSON フォーマットで送られてくるので, JavaScript オブジェクトとして代入する
    echo("if(window.MusicAnalyzer===undefined){window.MusicAnalyzer={roman:undefined}}");
    echo("window.MusicAnalyzer.roman={$chord_progressions}");
    echo("</script>\n");
    // 静的スクリプトを送る
    echo("<script src=\"./show_roman.js\"type=\"module\"></script>")
?>
