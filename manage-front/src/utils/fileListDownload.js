export function allLoad(arr) {
    arr.forEach(item => {
        let iframe = document.createElement("iframe");
        iframe.style.display = "none"; // 防止影响页面
        iframe.style.height = 0; // 防止影响页面
        iframe.src = `${process.env.VUE_APP_BASE_API}/file/down/${item.name}`
        document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
        // 5分钟之后删除
        setTimeout(() => {
            iframe.remove();
        }, 1 * 10 * 1000);
    });
}