<?php ob_start();?>
<div id="aside" class="bg white">
    <aside class="pt1">
        <div class="pl1">
            <p class="header4"><i class="fas fa-search"></i> Chercher:</p>
            <a class="header5 aside-href ml1" href="#srch-apt" aside-href>maison</a>
            <a class="header5 aside-href ml1" href="#srch-client" aside-href>Client</a>
        </div>
        <div class="pl1">
            <p class="header4"><i class="fas fa-list"></i> Lister:</p>
            <a class="header5 aside-href ml1"href="#list-apt-taken" aside-href>Maisons resérvés/vendus</a>
            <a class="header5 aside-href ml1" href="#list-apt-free" aside-href>Maisons libres</a>
            <a class="header5 aside-href ml1" href="#list-clients" aside-href>Clients</a>
        </div>
        <div class="pl1">
            <p class="header4"><i class="fas fa-check-square"></i> Enregistrer:</p>
            <a class="header5 aside-href ml1" href="#ins-bloc" aside-href>Nouveau bloc</a>
            <a class="header5 aside-href ml1" href="#ins-apt" aside-href>Nouvelles maisons</a>
            <a class="header5 aside-href ml1" href="#client" aside-href>Nouveau client</a>
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
