let current;
let res;

function createSignal(initValue) {
    let state = initValue;
    const listeners = new Set();

    const getState = () => {
        if (current)
            listeners.add(current)
        return state
    }
    const setState = (newValue) => {
        state = newValue;
        listeners.forEach((listener) => {
            listener()
        });
    }

    return [
        getState,
        setState,
    ]
}

function createEffect(cb, isReturn) {
    current = cb
    res = cb()
    cb()
    current = undefined
    return isReturn ? cb() : undefined
}

const root = document.getElementById('root')

function createElement(type, props, ...children) {
    return {
        type,
        props,
        children
    }
}

function render(elementObj, parent) {
    const {type, props, children} = elementObj
    if (type === 'text_node') {
        renderText(children[0], parent)
    }
    else {
        const component = document.createElement(type)
        for (const key in props) {
            component[key] = props[key]
        }
        parent.appendChild(component)
        if (children === typeof "string" || children.length === 0) return
        children.forEach((child) => {
            render({...child}, component)
        })
    }

}

function renderText(text, parent) {
    const textNode = document.createTextNode(text)
    parent.appendChild(textNode)
}

const Something = {
    render,
    createSignal,
}

const childs = [createCounterElement(), createElement('text_node', null, 'Hello World')]

Something.render(createElement('span', {className: 'test', id: "jopa"}, ...childs), root)

function createCounterElement() {
    const [count, setCount] = Something.createSignal(0)

    const buttonChilds = [createElement('text_node', null, 'Index')]

    createEffect(() => {
        const textNode = document.getElementById("count")
        rerender(textNode, `Count: ${count()}`)
    }, true)

    const childs = [
        createElement('text_node', null, `Count: ${count()}`),
        createElement('button', {
            onclick: () => {
                return setCount(count() + 1)
            }
        }, ...buttonChilds)
    ]

    return createElement('div', {id: "count"}, ...childs);
}

function rerender(oldElement, newValue) {
    if (!oldElement) return
    console.log(oldElement.childNodes.item(0).textContent)
    oldElement.childNodes.item(0).textContent = newValue
}
