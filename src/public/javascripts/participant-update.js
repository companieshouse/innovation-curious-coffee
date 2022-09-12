// For costly (pure) functions cache the result so it doesn't need to be re-computed
// If the function isn't pure (the output isn't dependent on the input, or can change)
// this will not work.
// This implementation only memoizes functions that don't take any arguments.
function memoized(f) {
    let r = undefined;

    return () => {
        if (r === undefined) r = f();

        return r;
    };
}

const getNewNetworkInput = () => document.querySelector("#new-network-input");
const getNetWorkList = () => document.querySelector("#network-list");
const getExistingNetworkInputs = () =>
    document.querySelectorAll(".existing-network-input");
const getForm = () => document.querySelector("#user-form");

function addNetwork(e) {
    e.preventDefault();

    const networkName = getNewNetworkInput()?.value;
    if (networkName === undefined || networkName === "") return; // If the new network input is empty we don't add a new one
    getNewNetworkInput().value = ""; // Reset input

    const newNetwork = newNetworkInput(networkName);
    const networkList = getNetWorkList();
    networkList.appendChild(newNetwork);

    const numChildren = networkList.children.length;
    networkList.insertBefore(
        networkList.children[numChildren - 1],
        networkList.children[numChildren - 2]
    );
    fixNetworkListInputNumbers();
}

function newNetworkInput(networkName) {
    const template = document.getElementById(
        "network-input-template"
    ).innerHTML;
    const html = template.replace("%network-name%", networkName);

    const node = createNodeFromHtml(html);
    node.addEventListener("click", removeNetwork);
    return node;
}

function createNodeFromHtml(html) {
    const node = document.createElement("div");
    node.innerHTML = html;
    return node.firstChild;
}

async function removeNetwork(e) {
    e.preventDefault();

    e.target.parentElement.remove();
    fixNetworkListInputNumbers();
}

function fixNetworkListInputNumbers() {
    const inputs = getExistingNetworkInputs();
    inputs.forEach((input, n) => {
        input.name = `network-${n}`;
    });
}

function convertFormToJSON() {
    const form = getForm();
    const data = { networks: [] };
    const fields = form.elements;
    for (let field of fields) {
        if (field.name === "") {
            continue;
        } else if (field.name.match("network-[0-9]+")) {
            data.networks.push(field.value);
        } else {
            data[field.name] = field.value;
        }
    }

    return JSON.stringify(data, null, 2);
}

function addEventListeners() {
    document
        .querySelector("#add-network-button")
        .addEventListener("click", addNetwork);

    document
        .querySelectorAll(".remove-network-button")
        .forEach((btn) => btn.addEventListener("click", removeNetwork));
}

addEventListeners();
