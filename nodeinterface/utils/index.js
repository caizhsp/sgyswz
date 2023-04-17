function shuffer(array) {
    return array.sort(function () { return Math.random() - 0.5; });
}

// 深拷贝
function deepCopy(object) {

    // 定义一个变量储存数据
    let newObject

    // 判断传入的对象的具体数据类型
    if (Object.prototype.toString.call(object) == "[object Array]") {
        newObject = [] // 创建对应的包含符号
    } else if (Object.prototype.toString.call(object) == "[object Object]") {
        newObject = {}
    }

    // 浅拷贝一层
    for (let key in object) {
        // 再进行深层次的拷贝
        if (typeof object[key] == 'object') { // 检测到能遍历的数组|对象，都对其进行递归遍历 // 这个判断条件就是递归出口
            newObject[key] = deepCopy(object[key])
        } else {
            newObject[key] = object[key]
        }
    }

    // 处理完之后将数据返回出去
    return newObject

}

/*
    利用冒泡方法降序排序
    arr 需要排序的数组
    type 需要排序的属性
    rule 排序规则 desc降序 asc升序
*/
function rank(arr, type, rule) {
    let _arr = deepCopy(arr)
    let temp = null
    for (var i = 0; i < _arr.length - 1; i++) {
        for (var j = 0; j < _arr.length - 1 - i; j++) {
            if (rule == "desc") {
                if (parseInt(_arr[j][type]) < parseInt(_arr[j + 1][type])) {
                    temp = _arr[j + 1]
                    _arr[j + 1] = _arr[j]
                    _arr[j] = temp
                }
            } else if (rule == "asc") {
                if (parseInt(_arr[j][type]) > parseInt(_arr[j + 1][type])) {
                    temp = _arr[j + 1]
                    _arr[j + 1] = _arr[j]
                    _arr[j] = temp
                }
            }

        }
    }
    return _arr
}

module.exports = {
    shuffer,
    rank,
    deepCopy
}