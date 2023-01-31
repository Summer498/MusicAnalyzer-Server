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
<html lang="ja">

<head>
    <title>前のページにブラウザバックしてください</title>
    <meta http-equiv="content-language" content="ja" charset="utf-8">
</head>

<body>
    <h1>前のページにブラウザバックしてください</h1>
    <a href="./next_more/">さらに進む</a>
    <?php
    $file_path = saveTmpFile("upload");
    $result = shell_exec("/var/www/html/MusicAnalyzer-server/mimicopy.sh \"" . $file_path . "\"");
    echo("result" . $result . "result");  // $result は stdout の出力を得る
    ?>
</body>

</html>