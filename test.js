import {tea_tls} from "./tea_request.js";

async function testTls() {
    let options = {
        timeoutSeconds:15,
        requestMethod: "GET",
        sessionId: "test",
        headers: {
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Accept-Language': 'en-US,en;q=0.9'
        },
        // proxyUrl:"http://127.0.0.1:1688"
    }

    console.time("request")
    let resp = await tea_tls.request("http://127.0.0.1:80/test", options)
    console.timeEnd("request")
    console.log(resp)
    let cookies = await tea_tls.getCookiesFromSession("https://www.baidu.com", "test")
    console.log(cookies)
    let result = await tea_tls.deleteCookiesToSession("https://www.baidu.com", "test", "PSTM")
    console.log(result)
    result = await tea_tls.addCookiesToSession("https://www.baidu.com", "test", [{Name:"HH",Value:"123"}])
    console.log(result)
    cookies = await tea_tls.getCookiesFromSession("https://www.baidu.com", "test")
    console.log(cookies)
    await tea_tls.destroySession("test")
}

testTls()

//type Cookie struct {
// 	Name  string
// 	Value string
//
// 	Path       string    // optional
// 	Domain     string    // optional
// 	Expires    time.Time // optional
// 	RawExpires string    // for reading cookies only
//
// 	// MaxAge=0 means no 'Max-Age' attribute specified.
// 	// MaxAge<0 means delete cookie now, equivalently 'Max-Age: 0'
// 	// MaxAge>0 means Max-Age attribute present and given in seconds
// 	MaxAge   int
// 	Secure   bool
// 	HttpOnly bool
// 	SameSite SameSite
// 	Raw      string
// 	Unparsed []string // Raw text of unparsed attribute-value pairs
// }