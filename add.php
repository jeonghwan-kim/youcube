<?php
$filename = "blog.xml";

if (file_exists($filename)) {
    $rawBlog = file_get_contents($filename);
} else {
    echo("blog.xml is not found.");
    exit;
}  

$xml = new SimpleXmlElement($rawBlog);
// echo($xml->getName());

// 자식노트로 새로운 블로그 항목 추가
$entry = $xml->entries->addChild("entry");
$entry->addChild("date", $_REQUEST["date"]);
$entry->addChild("body", $_REQUEST["body"]);
// if ($_REQUEST["image"] != "")
//     $entry->addChild("image", $_REQUEST["image"]);

// 전체 블로그를 파일에 저장
$file = fopen($filename, 'w');
fwrite($file, $xml->asXML());
fclose($file);
?>