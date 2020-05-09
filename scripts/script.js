let propertiesList;

function getProperties() {
    fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72', { method: 'get' })
        .then(res => {
            res.json().then((data) => {
                loadProperties(data);
                propertiesList = [...data];
            });
        })
        .catch(err => {
            console.error(err);
        });
}

function loadProperties(data) {
    let propertiesList = document.getElementById('properties-list');
    propertiesList.innerHTML = "";
    // -> Create elemente to list item
    let listItem = document.createElement('li');
    let itemImage = document.createElement('img');
    let itemBody = document.createElement('div');
    let itemPrice = document.createElement('span');
    let itemType = document.createElement('span');
    let itemButton = document.createElement('button');

    // -> Add necessary class
    listItem.className = 'principal__properties__item';
    itemImage.className = 'principal__properties__item__image';
    itemBody.className = 'principal__properties__item__body';
    itemPrice.className = 'principal__properties__item__body__price';
    itemType.className = 'principal__properties__item__body__type';
    itemButton.className = 'principal__properties__item__body__button';

    data.forEach(property => {
        let listItemCopy = listItem.cloneNode(true);
        let itemImageCopy = itemImage.cloneNode(true);
        let itemBodyCopy = itemBody.cloneNode(true);
        let itemPriceCopy = itemPrice.cloneNode(true);
        let itemTypeCopy = itemType.cloneNode(true);
        let itemButtonCopy = itemButton.cloneNode(true);

        // -> Add contents
        itemImageCopy.src = property.photo.replace(/xx_large|x_large/gi, 'medium');
        itemPriceCopy.textContent = `R$ ${property.price.toFixed(2)}`;
        itemTypeCopy.textContent = property.property_type;
        itemButtonCopy.innerHTML = 'Ver detalhes';
        itemButtonCopy.addEventListener('click', () => loadDetails(property.name));

        listItemCopy.appendChild(itemImageCopy);
        itemBodyCopy.appendChild(itemPriceCopy);
        itemBodyCopy.appendChild(itemTypeCopy);
        itemBodyCopy.appendChild(itemButtonCopy);
        listItemCopy.appendChild(itemBodyCopy);

        propertiesList.appendChild(listItemCopy);
    });
}

function loadDetails(propertyName) {
    const map = document.getElementById('static-map');
    document.getElementById('local-name').textContent = propertyName;

    map.src = `https://maps.googleapis.com/maps/api/staticmap?center=${propertyName}&zoom=14&size=300x400&key=AIzaSyDCqP6uMY4xsezEfC8ujDz8dMBKRBsljQ0`

    window.scrollTo(0, 0);
}

function filterByLocal(value, data = propertiesList) {
    const filteredList = data.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
    loadProperties(filteredList);
    return filteredList;
}

function filterByPrice(value, data = propertiesList) {
    if(!value) value = 99999; 
    const filteredList = data.filter(c => c.price <= value);
    loadProperties(filteredList);
    return filteredList;
}

function filterByType(value, data = propertiesList) {
    const filteredList = data.filter(c => c.property_type.toLowerCase().includes(value.toLowerCase()));
    loadProperties(filteredList);
    return filteredList;
}

function filterAll() {
    let filteredList;
    let local = document.getElementById('local').value;
    let price = document.getElementById('price').value;
    let type = document.getElementById('type').value;


    filteredList = filterByLocal(local);
    filteredList = filterByPrice(price, filteredList);
    filteredList = filterByType(type, filteredList);

    loadProperties(filteredList);
}
