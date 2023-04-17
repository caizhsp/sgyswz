const apiUrl = "http://localhost:3000/api/"
const httpUrl = "http://localhost:3000/"

function HTTP(option) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiUrl + option.url,
            method: option.method || "GET",
            data: option.data || {},
            success: (res) => {
                resolve(res)
            }
        })
    })
}