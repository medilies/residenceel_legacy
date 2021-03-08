class UI {
    /**
     *
     * @param {HTMLDivElement} container
     */
    constructor(container) {
        this.container = container;
    }

    emptyContainer() {
        this.container.innerHTML = "";
    }

    searchApt() {
        const searchAptDiv = document.createElement("div");
        const selectBloc = document.createElement("select");

        searchAptDiv.appendChild(selectBloc);

        this.emptyContainer();
        this.container.appendChild(searchAptDiv);
    }

    insBloc() {
        const insBlocDiv = document.createElement("div");

        this.insBlocFormId = "ins-bloc";

        insBlocDiv.innerHTML = `
            <form id="${this.insBlocFormId}">

                <label for="bloc_id">Nom du bloc</label>
                <input name="bloc_id" type="text" placeholder="A1..." required/>
                
                <label for="floors_nb">Nombre des étages</label>
                <input name="floors_nb" type="number" placeholder="5..." required class="w5"/>
                
                <label for="apt_labels">Apartements</label>
                <input name="apt_labels" type="text" placeholder="A1-1;A1-2;A1-3..." required/>
                
                <label for="apt_types">types d'apartements</label>
                <input name="apt_types" type="text" placeholder="F2;F3;F4..." required/>

                <button name="insBloc" type="submit">Valider</button>
                
            </form>
        `;

        this.emptyContainer();
        this.container.appendChild(insBlocDiv);
    }

    insApts(blocsData) {
        const insAptDiv = document.createElement("div");
        const insAptForm = document.createElement("form");
        const insAptFloorsContainer = document.createElement("div");
        this.insAptAddFloorBtn = document.createElement("button");

        this.insAptFormId = "ins-apt";
        insAptForm.id = this.insAptFormId;

        this.insAptAddFloorBtn.innerText = "Inserer une série d'étages";
        this.insAptAddFloorBtn.classList.add("inline");
        this.insAptAddFloorsEventHandler(insAptFloorsContainer);

        insAptForm.innerHTML = `
            <label for"bloc_id">Bloc</label>
            <select name="bloc_id" required class="w5" insAptsBlocId>
            ${blocsData.map(
                (bloc) =>
                    `<option value="${bloc.bloc_id}">${bloc.bloc_id}</option>`
            )}
            </select>
        `;
        insAptForm.appendChild(this.insAptAddFloorBtn);
        insAptForm.appendChild(insAptFloorsContainer);
        insAptForm.innerHTML += "<button type='submit'>Valider</button>";

        this.emptyContainer();
        insAptDiv.appendChild(insAptForm);
        this.container.appendChild(insAptDiv);
    }

    insAptAddFloors(floorsFormContainer) {
        const currentBlock = document.querySelector("[insAptsBlocId]").value;
        console.log(currentBlock);
    }

    insAptAddFloorsEventHandler(floorsFormContainer) {
        this.insAptAddFloorBtn.addEventListener("click", () => {
            this.insAptAddFloors(floorsFormContainer);
        });
    }
}

class FormSubmitter {
    constructor() {
        this.protocol = window.location.protocol;
        this.hostname = window.location.hostname;
        this.port = window.location.port;
    }

    submitNewBloc(formData) {
        fetch("http://localhost:50080/apis/insert_block", {
            method: "post",
            body: formData,
        })
            .then((res) => res.text())
            .then((body) => console.log(body))
            .catch((err) => {
                console.warn(err);
            });
    }
}

class Fetcher {
    constructor() {
        this.protocol = window.location.protocol;
        this.hostname = window.location.hostname;
        this.port = window.location.port;
    }

    getBlocs() {
        fetch("http://localhost:50080/apis/get_blocs")
            .then((res) => res.json())
            .then((json) => {
                const blocs = this.#mapAptsToBloc(json);
                ui.insApts(blocs);
            })
            .catch((err) => {
                console.warn(err);
            });
    }

    #mapAptsToBloc(json) {
        const blocs = json[0];
        const apts = json[1];

        blocs.forEach((bloc) => {
            bloc.apts = [];
            apts.forEach((apt) => {
                const aptLabelBlocPart = apt.label.substr(
                    0,
                    bloc.bloc_id.length
                );

                if (aptLabelBlocPart === bloc.bloc_id) bloc.apts.push(apt);
            });
        });

        return blocs;
    }
}

const ui = new UI(document.querySelector("main"));
const formSubmitter = new FormSubmitter();
const fetcher = new Fetcher();

const asideMenu = document.querySelector("aside > div");

asideMenu.addEventListener("click", (e) => {
    const target = e.target;

    if (target.hasAttribute("aside-href")) {
        const children = Array.from(asideMenu.children);
        children.forEach((child) => {
            child.classList.remove("aside-focused-section");

            const grandChildren = Array.from(child.children);
            grandChildren.forEach((grandChild) => {
                grandChild.classList.remove("aside-focused-href");
            });
        });

        target.classList.add("aside-focused-href");
        target.parentElement.classList.add("aside-focused-section");
    }
});

window.onhashchange = () => {
    locationChanges();
};

window.onload = () => {
    locationChanges();
};

function locationChanges() {
    const hash = window.location.hash;
    if (hash === "#srch-apt") {
        ui.searchApt();
    } else if (hash === "#ins-bloc") {
        ui.insBloc();

        const insBlocForm = document.querySelector("#" + ui.insBlocFormId);

        insBlocForm.addEventListener("submit", (e) => {
            e.preventDefault();

            formSubmitter.submitNewBloc(new FormData(insBlocForm));
        });
    } else if (hash === "#ins-apt") {
        fetcher.getBlocs();
        const insAptForm = document.querySelector("#" + ui.insAptFormId);

        insAptForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // formSubmitter.submitNewBloc(new FormData(insAptForm));
        });
    }
}
