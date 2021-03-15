<?php ob_start();?>
<div id="aside">
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
            <a class="header5 aside-href ml1" href="#ins-bloc" aside-href>Enregistrer un bloc</a>
            <a class="header5 aside-href ml1" href="#ins-apt" aside-href>Enregistrer des maisons</a>
            <a class="header5 aside-href ml1" href="#client" aside-href>Enregistrer un client</a>
        </div>
    </aside>
</div>

<div id="main">
    <main class="p1">
        <div id="forms-container"></div>
        <div id="reports-container"></div>
    </main>

    <footer>
        <div class="max-width-container">
            footer
        </div>
    </footer>
</div>

<?php $content = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/inc/layout.php';?>
