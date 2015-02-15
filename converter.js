var html = document.getElementById('html');
var jsnox = document.getElementById('jsnox');

var jsnoxName = 'h';
var jsnoxVarName = document.getElementById('jsnoxVarName');
jsnoxVarName.addEventListener('input', function (e) {
    jsnoxName = e.target.value;
});

function convertId(id) {
    return id ? ('#' + id) : '';
}

function convertClass(classList) {
    if (classList.length) {
        return Array.prototype
            .map.call(classList, function (className) {
                return '.' + className;
            })
            .join('');
    } else {
        return '';
    }
}

function convertType(attributes) {
    var typeAttr = attributes.getNamedItem('type');
    if (typeAttr) {
        return ':' + typeAttr.value;
    } else {
        return '';
    }
}

var nativeAttributes = [
    'name',
    'method'
];

var ignoredAttributes = [
    'class',
    'id',
    'type'
];

var inlinedAttributes = nativeAttributes.concat(ignoredAttributes);

function convertAttributesInline(attributes) {
    return Array.prototype
        .reduce.call(attributes, function (result, attr) {
            if (nativeAttributes.indexOf(attr.name) !== -1) {
                return result + '[' +
                    attr.name +
                    (attr.value ? '=' + attr.value : '') +
                    ']';
            }
            return result;
        }, '');
}

function convertAttributesToObject(attributes) {
    if (attributes.length) {
        var attrObject = Array.prototype.reduce
            .call(attributes, function (result, attr) {
                if (inlinedAttributes.indexOf(attr.name) === -1) {
                    result[attr.name] = attr.value;
                }
                return result;
            }, {});
        return JSON.stringify(attrObject);
    } else {
        return '{}';
    }
}

function convertChildNodes(childNodes) {
    var results = Array.prototype.map
        .call(childNodes, convert);
    return Array.prototype.filter.call(results, function (node) {
        return node && node !== '\'\'';
    });
}

function convert(node) {
    if (node.nodeName === '#text') {
        return '\'' + node.nodeValue.trim() + '\'';
    }
    if (node.nodeName === '#document') {
        return convert(node.children[0]);
    }
    return jsnoxName + '(' +
        '\'' +
        node.nodeName +
        convertType(node.attributes) +
        convertId(node.id) +
        convertClass(node.classList) +
        convertAttributesInline(node.attributes) +
        '\'' +
        ', ' +
        convertAttributesToObject(node.attributes) +
        ', ' +
        '[' +
        convertChildNodes(node.childNodes).join(',') +
        ']' +
        ')';
}

html.addEventListener('input', function (e) {
    var dom = (new DOMParser()).parseFromString(e.target.value, 'text/xml');
    jsnox.innerHTML = convert(dom);
});
