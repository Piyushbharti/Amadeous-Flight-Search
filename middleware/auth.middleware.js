const authorizationMiddleWare = async(req, res, next) => {
    try{
        const body = new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_KEY,
          grant_type: process.env.GRANT_TYPE,
        });
        const authApiAmadeus = await fetch(
          "https://test.api.amadeus.com/v1/security/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(), 
          }
        );
        const data = await authApiAmadeus.json();
        req.accessToken = data.access_token;
        next()
    }catch(e){
        res.status(500).json(e)
        console.log(data)
    }
}

module.exports = authorizationMiddleWare;

