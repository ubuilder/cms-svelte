function AssetAudio({ asset, mode }) {
    if (mode === "list") {
      return View({ tag: "audio", width: "500px", controls: true }, [
        View({ tag: "source", src: asset.url }),
        View("View"),
      ]);
    }
  
    return View(
      {
        tag: "div",
        style:
          "display: flex;flex-direction: column;justify-content: space-beetween; width: 100%; height: 100%",
      },
      [
        Icon({ name: "music", size: "xl", p: "md" }),
        View(
          {
            style: "text-align: center;background: rgba(10,10,10,0.3); ",
          },
          asset.name
        ),
      ]
    );
  }
  
  function AssetVideo({ asset, mode }) {
    if (mode === "list") {
      return View({ tag: "video", width: "500px", controls: true }, [
        View({ tag: "source", src: asset.url }),
        View("View"),
      ]);
    }
  
    return View([
      View({
        tag: "video",
        style: "width: auto; height: auto; max-height: 100%;",
        src: asset.url,
      }),
      Icon({
        name: "video",
        size: "xl",
        style:
          "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -80%)",
      }),
      View(
        {
          style:
            "padding-bottom: 3px;background: rgba(10,10,10,0.3);width: 100% ;position: absolute; bottom: 0px ;left: 50%; transform: translate(-50% , 0% ) ",
        },
        asset.name
      ),
    ]);
  }