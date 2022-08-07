
/*
// var's holding url and tab id
var holdURL;
var tabid;

// get id and url when a page is first loading/when you move to a pre-loaded tab, 
// then calls the function that removes tabs
chrome.tabs.onActivated.addListener((event) => {
  chrome.tabs.query({
    // gets all tabs
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) {
        if (String(tabs[i].url).includes("quizlet.com") || String("quizlet.com").includes(String(tabs[i].url))) {
            action(tabs[i]);
            
        }
    }
  });
} );

// get id and url when a page is reloaded, or when the url is changed, 
// then calls the function that removes tabs
chrome.tabs.onUpdated.addListener((tabsid, changeInfo, tab) => {
  if (changeInfo.status == "complete") { 
    chrome.tabs.query({
        // gets all tabs
      }, function(tabs) {
        for (i = 0; i < tabs.length; i++) {
            if (String(tabs[i].url).includes("quizlet.com") || String("quizlet.com").includes(String(tabs[i].url))) {
                action(tabs[i]);
                
            }
        }
      });
    }
});
*/

var running = false;
var start = true;

/*
function onActivated() {
    chrome.tabs.onActivated.addListener((event) => {
        console.log("onActivated activated")
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
            //url: "https://www.quizlet.com/*"
        }, function(tabs) {
            console.log(tabs[0].url + "  hi")
            chrome.webNavigation.onCompleted.addListener(() => {
                onUpdated();
            },  {url: [{hostContains: "quizlet.com"}]});
            
        })
      } );
}
*/
function controlLoad() {
    chrome.webNavigation.onCompleted.addListener(() => {
        return true;
    },  {url: [{hostContains: "quizlet.com"}]});
}
/*chrome.storage.onChanged.addListener(function (changes, namespace) { */
function run() {
    if (start) {
        start = false;
        chrome.storage.sync.get("start", (result) => {
            if (result.start === "false") {
                console.log("storage activated")
                
                
                    chrome.tabs.onUpdated.addListener((tabsid, changeInfo, tab) => {
                        console.log("onUpdated activated")
                        chrome.tabs.query({
                            active: true,
                            lastFocusedWindow: true
                            //url: "https://www.quizlet.com/*"
                        }, function(tabs) {
                            console.log("tabs[0].url");
                            //if (changeInfo.status == "complete") {
                                //console.log("changeInfo.status activated1")
                                var tab = tabs[0];
                                console.log(tab);
                                if (!running) {
                                    setTimeout(() => {
                                        if (String(tab.audible) === "false") {
                                        console.log("tab no longer audible activated1")
                                        chrome.storage.sync.get("start", (result) => {
                                            if (result.start === "false") {
                                                running = true;
                                                chrome.tabs.reload(tab.id);
                                                chrome.webNavigation.onCompleted.addListener(() => {
                                                    
                                                    chrome.scripting.executeScript(
                                                        {
                                                            target: {tabId: tab.id},
                                                            func: () => {document.querySelector("[title='Play'").click();}
                
                                                        }
                                                    ),
                                                    () => {};
                                                    running = false;
                                                },  {url: [{hostContains: "quizlet.com"}]});
                                            }
                                        });
                                        
                                    }
                                    }, 4000);
                                    
                                }
                                
                            //}
                        })
                        
                    })
                
            }
            start = true;
        });
        
        
    }
}
//}); 
chrome.storage.onChanged.addListener(function (changes, namespace) {
    run();
});

chrome.webNavigation.onCompleted.addListener(() => {
    console.log("Page finished loading...");
    
    run();  
    
    
},  {url: [{hostContains: "quizlet.com"}]});

