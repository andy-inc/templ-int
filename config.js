/**
 * Created by andy <andy.sumskoy@gmail.com> on 09/12/13.
 */
module.exports = exports = {
    server: {
       ip: "0.0.0.0",
       port: 3001,
       cookie: {
           secret: "feqwfqe41324å9ry814fgub23od"
       },
       session: {
           url: "mongodb://localhost/int-template/sessions",
           auto_reconnect: true
       }
    },
    auth: {
        facebook: {
            app_id: "",
            app_secret: ""
        },
        twitter: {
            app_id: "",
            app_secret: ""
        },
        vk: {
            app_id: "4048000",
            app_secret: "mLnR4n7iiEfzaLdDku1K"
        },
        "url": "http://localhost:3001"
    },
    db:{
        url: "mongodb://localhost/int-template"
    }
};