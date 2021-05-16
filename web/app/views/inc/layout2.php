<!DOCTYPE html>
<html lang="<?=$GLOBALS['LANG']?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- STYLESHEETS -->
    <link rel="stylesheet" href="/css/style.css">
    <?php if (isset($data['stylesheets_array'])): ?>
        <?php foreach ($data['stylesheets_array'] as $stylesheet_name): ?>
            <link rel="stylesheet" href="/css/<?=$stylesheet_name?>.css">
        <?php endforeach;?>
    <?php endif;?>
    <link rel="stylesheet" href="/css/fontawesome_free_5.13.0_we_all.min.css">

    <title><?=$GLOBALS['APP_NAME'] . ' | ' . $data['title']?></title>

</head>
<body>

<main>
    <?=$content?>
</main>

<!-- SCRIPTS -->
<?php if (isset($data['scripts_array'])): ?>
    <?php foreach ($data['scripts_array'] as $script_name): ?>
        <script src="/js/<?=$script_name?>.js"></script>
    <?php endforeach;?>
<?php endif;?>

</body>
</html>