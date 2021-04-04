<?php ob_start();?>
<div id="aside" class="bg white">
    <aside class="pt1">

        <div class="pl1">
            <a class="header5 aside-href " href="#init-deal" aside-href><i class="fas fa-handshake"></i> Nouveau accord</a>
        </div>

        <div class="pl1">
            <a class="header5 aside-href " href="#client-transactions" aside-href><i class="fas fa-house-user"></i> Client et transactions</a>
        </div>

        <div class="pl1">
            <p class="header5"><i class="fas fa-list"></i> Lister <i class="fas fa-chevron-down body-text"></i></p>
            <a class="header5 aside-href ml1"href="#list-apt-taken" aside-href>Maisons resérvés/vendus</a>
            <a class="header5 aside-href ml1" href="#list-apt-free" aside-href>Maisons libres</a>
            <a class="header5 aside-href ml1" href="#list-clients" aside-href>Clients</a>
        </div>

        <div class="pl1">
            <p class="header5"><i class="fas fa-check-square"></i> Enregistrer <i class="fas fa-chevron-down body-text"></i></p>
            <a class="header5 aside-href ml1" href="#ins-bloc" aside-href>Nouveau bloc</a>
            <a class="header5 aside-href ml1" href="#ins-apt" aside-href>Nouvelles maisons</a>
        </div>

    </aside>
</div>

<div id="main">
    <main class="p1">
        <div id="forms-container" class="pt3"></div>
        <div id="reports-container" class="hidden pt3 pr05 pl05"></div>
    </main>

    <footer class="bg4 white">
        <div class="max-width-container">
            ...
        </div>
    </footer>
</div>

<?php $content = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/inc/layout.php';?>
