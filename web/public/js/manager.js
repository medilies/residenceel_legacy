class UI {
    /**
     *
     * @param {HTMLDivElement} formsContainer
     * @param {HTMLDivElement} reportsContainer
     */
    constructor(formsContainer, reportsContainer) {
        this.formsContainer = formsContainer;
        this.reportsContainer = reportsContainer;

        this.insBloc_AptInputNameIterator = 0;
        this.insApts_FloorsInputNameIterator = 0;
    }

    emptyContainer() {
        this.formsContainer.innerHTML = "";
    }

    searchApt() {
        const searchAptDiv = document.createElement("div");
        const selectBloc = document.createElement("select");

        searchAptDiv.appendChild(selectBloc);

        this.emptyContainer();
        this.formsContainer.appendChild(searchAptDiv);
    }

    displayFreeApts() {
        const freeAptsData = JSON.parse(sessionStorage.getItem("freeApts"));
        console.log(freeAptsData);

        const displayFreeApts_div = document.createElement("div");

        let table = `
        <table>
            <tr>
                <th>ID</th>
                <th>Etage</th>
                <th>Apartement</th>
                <th>Surface</th>
                <th>Surface réelle</th>
            </tr>
        `;
        freeAptsData.forEach((house) => {
            table += `
            <tr>
                <td>${house.house_id}</td>
                <td>${house.floor_nb}</td>
                <td>${house.label}</td>
                <td>${house.surface}</td>
                <td>${house.surface_real}</td>
            </tr>
            `;
        });
        table += "</table>";
        displayFreeApts_div.innerHTML = table;

        this.emptyContainer();
        this.formsContainer.appendChild(displayFreeApts_div);
    }

    /**
     * - Creates a form this targetable with an ID
     * - The form has 3 buttons
     * - - ADD apartement, targetable with an attr
     * - - RM last apartement, targetable with an attr
     * - - Submit form button
     *
     * FORM validation on client side depends on HTML FORM INPUT attributes (MIN, MAX, LIST, PATTERN)
     *
     * @param {Number} insBloc_AptInputNameIterator is a very vital virable for this form:
     * - It insures that apt_label & apt_type are in synch
     * - It insures max apts/floor
     * - Sets added apt default value
     *
     */
    insBloc() {
        const insBloc_div = document.createElement("div");

        this.insBloc_form_id = "insBloc";
        this.insBloc_blocIdInput_id = "insBloc-bloc";
        this.insBloc_addApt_attr = "insBloc_addApt";
        this.insBloc_rmApt_attr = "insBloc_rmApt";
        this.insBloc_submitBtn_id = "insBloc-submit-btn";
        this.insBloc_aptContainerDiv_id = "insBloc-apt-container";

        insBloc_div.innerHTML = `
            <form id="${this.insBloc_form_id}">

                <label for="bloc_id">Nom du bloc</label>
                <input name="bloc_id" id="${this.insBloc_blocIdInput_id}" type="text" placeholder="A1..." required pattern="[a-zA-Z][0-9]?" class="w5"/>
                
                <label for="floors_nb">Nombre des étages</label>
                <input name="floors_nb" type="number" min="5" max="20" placeholder="5..." required class="w3"/>
                
                <button name="insBloc" type="button" ${this.insBloc_addApt_attr} class="inline">Ajouter un apartement</button>

                <button type="button" ${this.insBloc_rmApt_attr} class="w18 inline">Retirer le dernier apartement</button>

                <div id="${this.insBloc_aptContainerDiv_id}"></div>
                <datalist id="chambres">
                  <option value="F2">
                  <option value="F3">
                  <option value="F4">
                  <option value="F5">
                </datalist>
                
                <button name="insBloc" type="submit" id="${this.insBloc_submitBtn_id}">Valider</button>
                
            </form>
        `;

        this.emptyContainer();
        this.formsContainer.appendChild(insBloc_div);
    }

    insBloc_addApt() {
        // MAX 8 apts/floor
        if (this.insBloc_AptInputNameIterator >= 8) return;

        const blocIdInput = document.querySelector(
            "#" + this.insBloc_blocIdInput_id
        );
        const aptLabelBlocPrefix = blocIdInput.value;
        // Bloc tag must be set
        if (aptLabelBlocPrefix === "") {
            return;
        }
        // block tag is set. then lock its input
        else {
            blocIdInput.setAttribute("readonly", "");
            blocIdInput.classList.add("locked-input");
        }

        const aptLabelName = "apt_label-" + this.insBloc_AptInputNameIterator;
        const aptTypeName = "apt_type-" + this.insBloc_AptInputNameIterator;
        // Default value start from 1 unlike names that start from 0
        this.insBloc_AptInputNameIterator++;
        const aptLabelDefaultValue = `${aptLabelBlocPrefix}-${this.insBloc_AptInputNameIterator}`;

        const apt = document.createElement("div");
        apt.classList.add("flex-row-base");
        apt.innerHTML = `
            <div class="ml1">
                <label for="${aptLabelName}">Apartement</label>
                <input name="${aptLabelName}" value="${aptLabelDefaultValue}" type="text" required pattern="[a-zA-Z][0-9]?-[1-8]" class="w5"/>
            </div>
            
            <div class="ml1">
                <label for="${aptTypeName}">Type</label>
                <input name="${aptTypeName}" type="text" placeholder="F2,F3..." required pattern="F[2-5]" list="chambres" class="w4"/>
            </div>
        `;

        const aptContainer = document.querySelector(
            "#" + this.insBloc_aptContainerDiv_id
        );
        aptContainer.appendChild(apt);
    }

    insBloc_rmApt() {
        if (this.insBloc_AptInputNameIterator > 0) {
            document
                .querySelector(
                    "#" + this.insBloc_aptContainerDiv_id + ">div:last-child"
                )
                .remove();
            this.insBloc_AptInputNameIterator--;
        }
    }

    insApts() {
        // Mondatory >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // check if it is set before showing the form
        const blocsData = JSON.parse(sessionStorage.getItem("blocs"));
        // console.table(blocsData);

        /**
         * Targets identifiers
         */
        // 1st
        this.insApts_form_id = "insApts";
        this.insApts_selectBloc_id = "insApts-select-bloc";
        this.insApts_addFloors_attr = "insApts_AddFloors";
        this.insApts_rmFloor_attr = "insApts_rmFloor";
        this.insApts_submitBtn_id = "insApts_submit-btn";
        this.insApts_floorsContainerDiv_id = "insApts-floors-container";

        // Create form with container for adding floors & apts
        const insApt_div = document.createElement("div");
        insApt_div.innerHTML = `
        <form id="${this.insApts_form_id}">
            <label for"bloc_id">Bloc</label>
            <select name="bloc_id" required class="w5" id="${
                this.insApts_selectBloc_id
            }">
            ${blocsData.map(
                (bloc) =>
                    `<option value="${bloc.bloc_id}">${bloc.bloc_id}</option>`
            )}
            </select>

            <button type="button" class="inline" ${
                this.insApts_addFloors_attr
            }>Inserer une serie d'étages</button>

            <button type="button" class="inline w21" ${
                this.insApts_rmFloor_attr
            }>Supprimer la derniere serie d'étages</button>

            <div id="${
                this.insApts_floorsContainerDiv_id
            }" class="bg-l-grey p05"></div>
            
            <button id="${
                this.insApts_submitBtn_id
            }" type="submit" class="inline" ">Valider</button>
        </form>
        `;

        this.emptyContainer();
        this.formsContainer.appendChild(insApt_div);
    }

    insApts_addFloor() {
        // Mondatory >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // check if it is set before showing the form
        const blocsData = JSON.parse(sessionStorage.getItem("blocs"));

        const floorsContainer = document.querySelector(
            "#" + this.insApts_floorsContainerDiv_id
        );

        // will iterate inside insApts_floorApts()
        const i = this.insApts_FloorsInputNameIterator;

        const floors = document.createElement("div");
        floors.classList.add("card", "mb1");
        floors.innerHTML = `
        <label for="floors">Etages</label>
        <input name="floors[${i}][floors]" placeholder="3;5;6;9;..." pattern="([0-9]+;)*[0-9]+(;)?" required class="inline"/>
        
        ${this.insApts_floorApts(blocsData)}
        `;

        floorsContainer.appendChild(floors);
    }

    insApts_rmFloor() {
        if (this.insApts_FloorsInputNameIterator > 0) {
            document
                .querySelector(
                    "#" + this.insApts_floorsContainerDiv_id + ">div:last-child"
                )
                .remove();
            this.insApts_FloorsInputNameIterator--;
        }
    }

    insApts_floorApts(blocsData) {
        let aptsDivs = "";
        console.table(blocsData);

        const blocSelect = document.querySelector(
            "#" + this.insApts_selectBloc_id
        );
        blocSelect.style.pointerEvents = "none";
        blocSelect.classList.add("locked-input");
        const bloc_id = blocSelect.value;

        const i = this.insApts_FloorsInputNameIterator;

        blocsData.forEach((bloc) => {
            if (bloc.bloc_id === bloc_id) {
                bloc.apts.forEach((apt, j) => {
                    aptsDivs += `
                    <div class="flex-row-base">
                        <div class="ml1">
                            <label for"apt">Apartement</label>
                            <input name="floors[${i}][houses][${j}][apt_label]" type="text" required readonly value="${apt[0]}" class="w3 locked-input">
                        </div>
                        <div class="ml1">
                            <label>Type</label>
                            <input readonly value="${apt[1]}" class="w3 locked-input">
                        </div>
                        <div class="ml1">
                            <label for"surf">Surface</label>
                            <input name="floors[${i}][houses][${j}][surface]" type="number" required min="50.00" max="200.00" step="0.01" class="w5">
                        </div>
                        <div class="ml1">
                            <label for"surfR">Surface utile</label>
                            <input name="floors[${i}][houses][${j}][surface_real]" type="number" min="50.00" max="200.00" required step="0.01" class="w5">
                        </div>
            
                    </div>    
                    `;
                });
            }
        });

        this.insApts_FloorsInputNameIterator++;
        return aptsDivs;
    }

    /**
     *
     * @param {object} reportObj contains 2 keys:
     * - REPORT: specifies the nature
     * - CONTENT: Contains the message
     */
    appendReportDiv(reportObj) {
        const report = document.createElement("div");
        report.innerHTML = new Date() + "<br>" + reportObj.CONTENT;
        if (reportObj.REPORT === "SUCCESSFUL_INSERTION") {
            report.classList.add("report", "success-report");
        } else if (reportObj.REPORT === "INVALID_DATA") {
            report.classList.add("report", "invalid-input-report");
        } else if (reportObj.REPORT === "ERROR") {
            report.classList.add("report", "err-report");
        } else if (reportObj.REPORT === "MISSING_DATA") {
            report.classList.add("report", "missing-input-report");
        }

        this.reportsContainer.prepend(report);
    }
}

class FormSubmitter {
    constructor() {
        this.protocol = window.location.protocol;
        this.hostname = window.location.hostname;
        this.port = window.location.port;
    }

    insBloc_submit(formData) {
        fetch("http://localhost:50080/apis/insert_block", {
            method: "post",
            body: formData,
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                this.#formSubmitIncomeAction(json, ui.insBloc_submitBtn_id);
            })
            .catch((err) => {
                throw err;
            });
    }

    insApts_submit(formData) {
        fetch("http://localhost:50080/apis/insert_apts", {
            method: "post",
            body: formData,
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                this.#formSubmitIncomeAction(json, ui.insApts_submitBtn_id);
            })
            .catch((err) => {
                throw err;
            });
    }

    #formSubmitIncomeAction(json, submitBtnId) {
        ui.appendReportDiv(json);

        if (json.REPORT === "SUCCESSFUL_INSERTION")
            setTimeout(() => {
                window.location = window.location.origin;
            }, 2000);
        else {
            document.querySelector("#" + submitBtnId).style.display = "block";
        }
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
                if (json.REPORT === "SUCCESSFUL_FETCH") {
                    console.log(json);
                    const blocs = this.#joinAptsToBloc(json.CONTENT);
                    sessionStorage.setItem("blocs", JSON.stringify(blocs));
                    // console.table(blocs);
                }
                // >>>>>>>>>>> display the notice
            })
            .catch((err) => {
                console.warn(err);
            });
    }

    /**
     * JOIN bloc_id
     * @param {object} json
     * @returns
     */
    #joinAptsToBloc(json) {
        const jsonBlocs = json[0];
        const jsonApts = json[1];

        const blocs = [];

        jsonBlocs.forEach((bloc) => {
            let temp = {};
            temp.bloc_id = bloc.bloc_id;
            temp.floors_nb = bloc.floors_nb;
            temp.apts = [];

            jsonApts.forEach((apt) => {
                if (bloc.bloc_id === apt.bloc_id) {
                    temp.apts.push([..."", apt.apt_label, apt.apt_type]);
                }
            });

            blocs.push(temp);
        });

        return blocs;
    }

    getFreeApts() {
        fetch("http://localhost:50080/apis/get_free_apts")
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                sessionStorage.setItem("freeApts", JSON.stringify(json));
            })
            .catch((err) => {
                console.warn(err);
            });
    }
}
// *****************************************************
//                  MAIN SCOPE
// *****************************************************

const ui = new UI(
    document.querySelector("#forms-container"),
    document.querySelector("#reports-container")
);
const formSubmitter = new FormSubmitter();
const fetcher = new Fetcher();

fetcher.getBlocs();
fetcher.getFreeApts();

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
    } else if (hash === "#srch-apt-free") {
        ui.displayFreeApts();
    } else if (hash === "#ins-bloc") {
        ui.insBloc();
        insBloc_eventListeners();
    } else if (hash === "#ins-apt") {
        // check if blocsData is set in session storage >>>>>>>>>>>>
        ui.insApts();
        insApts_eventListeners();
    }
}

function insApts_eventListeners() {
    const insApt_form = document.querySelector("#" + ui.insApts_form_id);

    insApt_form.addEventListener("submit", (e) => {
        e.preventDefault();

        formSubmitter.insApts_submit(new FormData(insApt_form));
    });

    /**
     * Handles the following clicks:
     *
     * - add a serie of floors
     * - remove the serie of floors
     * - add an apartement
     * - remove the apartement
     *
     * clicks are distnguished by HTML attributes and their effect is very sensitive to the hierarchy of divs (targetting parents)
     */
    insApt_form.addEventListener("click", (e) => {
        const target = e.target;

        if (target.hasAttribute(ui.insApts_addFloors_attr)) {
            ui.insApts_addFloor();
        } else if (target.hasAttribute(ui.insApts_rmFloor_attr)) {
            ui.insApts_rmFloor();
        }
    });
}

function insBloc_eventListeners() {
    const insBlocForm = document.querySelector("#" + ui.insBloc_form_id);

    insBlocForm.addEventListener("submit", (e) => {
        e.preventDefault();

        document.querySelector("#" + ui.insBloc_submitBtn_id).style.display =
            "none";

        formSubmitter.insBloc_submit(new FormData(insBlocForm));
    });

    insBlocForm.addEventListener("click", (e) => {
        const target = e.target;

        if (target.hasAttribute(ui.insBloc_addApt_attr)) {
            ui.insBloc_addApt();
        } else if (target.hasAttribute(ui.insBloc_rmApt_attr)) {
            ui.insBloc_rmApt();
        }
    });
}
