const token = localStorage.getItem("token");
(async () => {
    const tokenResult = await fetch("/verifyToken", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify({ token }),
    });
    const tokenResultJSON = await tokenResult.json();
    if (!tokenResultJSON.result) {
        location.href = "/postTokenDied";
    }
    console.log(token, "is auth?? ", tokenResultJSON.result);
})();
