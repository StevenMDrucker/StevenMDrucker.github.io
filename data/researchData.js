// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({7:[function(require,module,exports) {
module.exports = [
    {
        "booktitle": "Robotics and Automation, 1989. Proceedings., 1989 IEEE International Conference on",
        "id": 95,
        "organization": "IEEE",
        "pdf": "papers/tasklevel.pdf",
        "reference": "Aboaf, E, Drucker, S.M, and Atkeson, C.G. Task Level Learning on a Juggling Task. IEEE Robotics Conference. Scottsdale, AZ. 1989.",
        "img": "researchImages/robotlearn.gif",
        "bibEntry": "<div class=\"csl-entry\">Aboaf, E. W., Drucker, S. M., and Atkeson, C. G. (1989). Task-level robot learning: Juggling a tennis ball more accurately. In <i>Robotics and Automation, 1989. Proceedings., 1989 IEEE International Conference on</i> (pp. 1290â\u0080\u00931295). IEEE.</div>",
        "text": "tasklevel.txt",
        "title": "Task-level robot learning: Juggling a tennis ball more accurately",
        "author": [
            "Aboaf, Eric W",
            "Drucker, Steven M",
            "Atkeson, Christopher G"
        ],
        "primary": "Robotics",
        "tags": {
            "collaborators": [
                "Aboaf",
                "Atkeson"
            ],
            "subject": [
                "Robotics",
                "Learning",
                "Thesis"
            ],
            "year": [
                "1989"
            ],
            "publication": [
                "IEEE",
                "MastersThesis"
            ]
        },
        "year": "1989",
        "ENTRYTYPE": "inproceedings",
        "ID": "aboaf1989task",
        "caption": "Task Level Learning",
        "pages": "1290--1295",
        "abstract": "We report on a preliminary investigation of task-level learning, an approach to learning from practice. We have a programmaed a robot to juggle a single ball in three dimensions by batting it upwards with a large paddle. The robot uses a real-time binary vision system to track the ball and measure its performance. Task-level learning consists of building a model of performance errors at the task level during practice, and using that model to refine task-level commands. A polynomial surface was fit to the errors in where the ball went after each hit, and this task model is used to refine how the ball is hit. This application of task-level learning dramatically increased the number of consecutive hits the robot could execute before the ball was hit out of range of the paddle.",
        "thumb": "thumbnail/robotlearn.gif"
    },
    {
        "booktitle": "ACM Transactions on Graphics (TOG)",
        "bibEntry": "<div class=\"csl-entry\">Agarwala, A., Dontcheva, M., Agrawala, M., Drucker, S., Colburn, A., Curless, B., â\u0080¦ Cohen, M. (2004). Interactive digital photomontage. In <i>ACM Transactions on Graphics (TOG)</i> (Vol. 23, pp. 294â\u0080\u0093302). ACM.</div>",
        "author": [
            "Agarwala, Aseem",
            "Dontcheva, Mira",
            "Agrawala, Maneesh",
            "Drucker, Steven",
            "Colburn, Alex",
            "Curless, Brian",
            "Salesin, David",
            "Cohen, Michael"
        ],
        "thumb": "thumbnail/photomontage.jpg",
        "number": "3",
        "abstract": "We describe an interactive, computer-assisted framework for combining parts of a set of photographs into a single composite picture, a process we call 'digital photomontage.' Our framework makes use of two techniques primarily: graph-cut optimization, to choose good seams within the constituent images so that they can be combined as seamlessly as possible; and gradient-domain fusion, a process based on Poisson equations, to further reduce any remaining visible artifacts in the composite. Also central to the framework is a suite of interactive tools that allow the user to specify a variety of high-level image objectives, either globally across the image, or locally through a painting-style interface. Image objectives are applied independently at each pixel location and generally involve a function of the pixel values (such as 'maximum contrast') drawn from that same location in the set of source images. Typically, a user applies a series of image objectives iteratively in order to create a finished composite. The power of this framework lies in its generality; we show how it can be used for a wide variety of applications, including 'selective composites' (for instance, group photos in which everyone looks their best), relighting, extended depth of field, panoramic stitching, clean-plate production, stroboscopic visualization of movement, and time-lapse mosaics.",
        "id": 64,
        "organization": "ACM",
        "pdf": "papers/photomontage.pdf",
        "reference": "Aseem Agarwala, Mira Dontcheva, Maneesh Agrawala, Steven Drucker, Alex Colburn, Brian Curless, David Salesin, Michael Cohen. Interactive Digital Photomontage. ACM Transactions on Graphics (Proceedings of SIGGRAPH 2004), 2004.",
        "text": "photomontage.txt",
        "volume": "23",
        "title": "Interactive digital photomontage",
        "img": "researchImages/photomontage.jpg",
        "video": "http://grail.cs.washington.edu/projects/photomontage/video.avi",
        "primary": "Photos",
        "tags": {
            "collaborators": [
                "Agarwala",
                "Dontcheva",
                "Agrawala",
                "Colburn",
                "Curless",
                "Salesin",
                "Cohen"
            ],
            "subject": [
                "Graphics",
                "Photos"
            ],
            "year": [
                "2004"
            ],
            "publication": [
                "SIGGRAPH"
            ]
        },
        "year": "2004",
        "ENTRYTYPE": "inproceedings",
        "ID": "agarwala2004interactive",
        "pages": "294--302",
        "caption": "Interactive Digital Photomontage"
    },
    {
        "booktitle": "Proceedings of the International Conference on Very Large Data Bases (VLDB)",
        "id": 31,
        "img": "researchImages/geospatial.png",
        "bibEntry": "<div class=\"csl-entry\">Ali, M., Chandramouli, B., Fay, J., Wong, C., Drucker, S., and Raman, B. S. (2011). Online visualization of geospatial stream data using the WorldWide telescope. In <i>Proceedings of the International Conference on Very Large Data Bases (VLDB)</i>.</div>",
        "title": "Online visualization of geospatial stream data using the WorldWide telescope",
        "author": [
            "Ali, Mohamed",
            "Chandramouli, Badrish",
            "Fay, Jonathan",
            "Wong, Curtis",
            "Drucker, Steven",
            "Raman, Balan Sethu"
        ],
        "ID": "ali2011online",
        "caption": "Geospatial Stream",
        "year": "2011",
        "ENTRYTYPE": "inproceedings",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Ali",
                "Chandramouli",
                "Fay",
                "Wong",
                "Raman"
            ],
            "subject": [
                "Visualization"
            ],
            "year": [
                "2011"
            ],
            "publication": [
                "VLDB"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems",
        "id": 9,
        "organization": "ACM",
        "pdf": "papers/pn2048-amershi-fixed.pdf",
        "reference": "Amershi, S., Chickering, M., Drucker, S., Lee, B., Simard, P., and Suh, J. (2015) ModelTracker: Redesigning Performance Analysis Tools for Machine Learning. Proceedings of the ACM Conference on Human Factors in Computing Systems (CHI 2015).",
        "img": "researchImages/modeltracker.png",
        "bibEntry": "<div class=\"csl-entry\">Amershi, S., Chickering, M., Drucker, S. M., Lee, B., Simard, P., and Suh, J. (2015). Modeltracker: Redesigning performance analysis tools for machine learning. In <i>Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems</i> (pp. 337â\u0080\u0093346). ACM.</div>",
        "text": "pn2048-amershi-fixed.txt",
        "title": "Modeltracker: Redesigning performance analysis tools for machine learning",
        "author": [
            "Amershi, Saleema",
            "Chickering, Max",
            "Drucker, Steven M",
            "Lee, Bongshin",
            "Simard, Patrice",
            "Suh, Jina"
        ],
        "video": "http://research.microsoft.com/en-us/um/people/sdrucker/video/squeries_v1.0.mp4",
        "primary": "Machine Learning",
        "tags": {
            "collaborators": [
                "Amershi",
                "Chickering",
                "Lee",
                "Simard",
                "Suh"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Touch",
                "Sequences"
            ],
            "year": [
                "2015"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2015",
        "ENTRYTYPE": "inproceedings",
        "ID": "amershi2015modeltracker",
        "caption": "Modeltracker",
        "pages": "337--346",
        "abstract": "Model building in machine learning is an iterative process. The performance analysis and debugging step typically involves a disruptive cognitive switch from model building to error analysis, discouraging an informed approach to model building. We present ModelTracker, an interactive visualization that subsumes information contained in numerous traditional summary statistics and graphs while displaying example-level performance and enabling direct error examination and debugging. Usage analysis from machine learning practitioners building real models with  ModelTracker over six months shows ModelTracker is used often and throughout model building. A controlled experiment focusing on ModelTracker???s debugging capabilities shows participants prefer ModelTracker over traditional tools without a loss in model performance.",
        "thumb": "thumbnail/modeltracker.png"
    },
    {
        "link": "http://eprints.soton.ac.uk/264545/",
        "booktitle": "CHI2008",
        "pdf": "papers/vidido.pdf",
        "id": 51,
        "type": "Technical Report",
        "img": "researchImages/informaldecisions.png",
        "bibEntry": "<div class=\"csl-entry\">AndrÃ©, P., Drucker, S., and schraefel,  m. c. (2007). <i>Informal Online Decision Making: Current Practices and Support System Design</i>. Technical Report.</div>",
        "institution": "Microsoft, University of Southampton",
        "title": "Informal Online Decision Making: Current Practices and Support System Design",
        "author": [
            "Andr{\\'e}, Paul",
            "Drucker, Steven",
            "schraefel, m. c."
        ],
        "ID": "andre2007informal",
        "caption": "Informal Decisions",
        "year": "2007",
        "ENTRYTYPE": "unpublished",
        "primary": "UI-Information",
        "abstract": "Existing group decision support systems are too complex to support lightweight, informal decision making made popular by the amount of information available on the Web. From an examination of related work, an online survey and a formative study to examine how people currently use the Web for decision support, we present a set of design recommendations towards the development of an informal Web decision support tool.",
        "tags": {
            "collaborators": [
                "Andre",
                "schraefel"
            ],
            "subject": [
                "UI",
                "Information"
            ],
            "year": [
                "2007"
            ],
            "publication": [
                "Internal Report"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the 38th International Conference on Software Engineering Companion",
        "id": 4,
        "organization": "ACM",
        "pdf": "papers/PID4092213.pdf",
        "reference": "Barik, T., DeLine, R., Drucker, S., & Fisher, D. (2016, May). The bones of the system: a case study of logging and telemetry at Microsoft. In?Proceedings of the 38th International Conference on Software Engineering Companion?(pp. 92-101). ACM.",
        "img": "researchImages/bones.png",
        "bibEntry": "<div class=\"csl-entry\">Barik, T., DeLine, R., Drucker, S., and Fisher, D. (2016). The bones of the system: a case study of logging and telemetry at Microsoft. In <i>Proceedings of the 38th International Conference on Software Engineering Companion</i> (pp. 92â\u0080\u0093101). ACM.</div>",
        "text": "bonesofthesystem.txt",
        "title": "The bones of the system: a case study of logging and telemetry at Microsoft",
        "author": [
            "Barik, Titus",
            "DeLine, Robert",
            "Drucker, Steven",
            "Fisher, Danyel"
        ],
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Barik",
                "DeLine",
                "Fisher"
            ],
            "subject": [
                "Information"
            ],
            "year": [
                "2016"
            ],
            "publication": [
                "ICSE"
            ]
        },
        "year": "2016",
        "ENTRYTYPE": "inproceedings",
        "ID": "barik2016bones",
        "caption": "Bones",
        "pages": "92--101",
        "abstract": "Large software organizations are transitioning to event data platforms as they culturally shift to better support datadriven decision making. This paper offers a case study at Microsoft during such a transition. Through qualitative interviews of 28 participants, and a quantitative survey of 1,823 respondents, we catalog a diverse set of activities that leverage event data sources, identify challenges in conducting these activities, and describe tensions that emerge in datadriven cultures as event data flow through these activities within the organization. We find that the use of event data span every job role in our interviews and survey, that different perspectives on event data create tensions between roles or teams, and that professionals report social and technical challenges across activities.",
        "thumb": "thumbnail/bones.png"
    },
    {
        "booktitle": "Proceedings of the 2013 ACM SIGMOD International Conference on Management of Data",
        "id": 20,
        "organization": "ACM",
        "pdf": "papers/stat-sigmod2013-demo.pdf",
        "reference": "Mike Barnett, Badrish Chandramouli, Robert DeLine, Steven Drucker, Danyel Fisher, Jonathan Goldstein, Patrick Morrison, and John Platt, Stat! - An Interactive Analytics Environment for Big Data, in ACM SIGMOD International Conference on Management of Data (SIGMOD 2013), ACM SIGMOD, June 2013",
        "img": "researchImages/stat.png",
        "bibEntry": "<div class=\"csl-entry\">Barnett, M., Chandramouli, B., DeLine, R., Drucker, S., Fisher, D., Goldstein, J., â\u0080¦ Platt, J. (2013). Stat!: an interactive analytics environment for big data. In <i>Proceedings of the 2013 ACM SIGMOD International Conference on Management of Data</i> (pp. 1013â\u0080\u00931016). ACM.</div>",
        "text": "sigde260-barnett.txt",
        "title": "Stat!: an interactive analytics environment for big data",
        "author": [
            "Barnett, Mike",
            "Chandramouli, Badrish",
            "DeLine, Robert",
            "Drucker, Steven",
            "Fisher, Danyel",
            "Goldstein, Jonathan",
            "Morrison, Patrick",
            "Platt, John"
        ],
        "video": "http://research.microsoft.com/en-us/people/sdrucker/papers/",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Barnett",
                "Chandramouli",
                "DeLine",
                "Fisher",
                "Goldstein",
                "Morrison",
                "Platt"
            ],
            "subject": [
                "Information"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "Sigmod"
            ]
        },
        "year": "2013",
        "ENTRYTYPE": "inproceedings",
        "ID": "barnett2013stat",
        "caption": "Stat!",
        "pages": "1013--1016",
        "abstract": "Exploratory analysis on big data requires us to rethink data management across the entire stack ??? from the underlying data processing techniques to the user experience. We demonstrate Stat! ??? a visualization and analytics environment that allows users to rapidly experiment with exploratory queries over big data. Data scientists can use Stat! to quickly refine to the correct query, while getting immediate feedback after processing a fraction of the data. Stat! can work with multiple processing engines in the backend; in this demo, we use Stat! with the Microsoft StreamInsight streaming engine. StreamInsight is used to generate incremental early results to queries and refine these results as more data is processed. Stat! allows data scientists to explore data, dynamically compose multiple queries to generate streams of partial results, and display partial results in both textual and visual form",
        "thumb": "thumbnail/stat.png"
    },
    {
        "thumb": "thumbnail/iclustering2.png",
        "booktitle": "AAAI",
        "id": 36,
        "bibEntry": "<div class=\"csl-entry\">Basu, S., Fisher, D., Drucker, S. M., and Lu, H. (2010). Assisting Users with Clustering Tasks by Combining Metric Learning and Classification. In <i>AAAI</i>.</div>",
        "pdf": "papers/iclustering-aaai-2010.pdf",        
        "reference": "Sumit Basu, Danyel Fisher, Steven M. Drucker, and Hao Lu, Assisting Users with Clustering Tasks by Combining Metric Learning and Classification, in Proceedings of the Twenty-Fourth Conference on Artificial Intelligence (AAAI 2010), American Association for Artificial Intelligence , July 2010",
        "img": "researchImages/iclustering2.png",
        "text": "iClustering-aaai-2010.txt",
        "title": "Assisting Users with Clustering Tasks by Combining Metric Learning and Classification.",
        "author": [
            "Basu, Sumit",
            "Fisher, Danyel",
            "Drucker, Steven M",
            "Lu, Hao"
        ],
        "ID": "basu2010assisting",
        "caption": "iClusterTheory",
        "year": "2010",
        "ENTRYTYPE": "inproceedings",
        "primary": "Machine Learning",
        "abstract": "Interactive clustering refers to situations in which a human labeler is willing to assist a learning algorithm in automatically clustering items. We present a related but somewhat different task, assisted clustering, in which a user creates explicit groups of items from a large set and wants suggestions on what items to add to each group. While the traditional approach to interactive clustering has been to use metric learning to induce a distance metric, our situation seems equally amenable to classification. Using clusterings of documents from human subjects, we found that one or the other method proved to be superior for a given cluster, but not uniformly so. We thus developed a hybrid mechanism for combining the metric learner and the classifier. We present results from a large number of trials based on human clusterings, in which we show that our combination scheme matches and often exceeds the performance of a method which exclusively uses either type of learner.",
        "tags": {
            "collaborators": [
                "Fisher",
                "Basu",
                "Lu"
            ],
            "subject": [
                "UI",
                "Machine Learning"
            ],
            "year": [
                "2010"
            ],
            "publication": [
                "AAAI"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the 2014 International Working Conference on Advanced Visual Interfaces",
        "id": 19,
        "organization": "ACM",
        "pdf": "papers/design-vis.pdf",
        "reference": "Alex Bigelow, Steven Drucker, Danyel Fisher, and Miriah Meyer, Reflections on How Designers Design With Data, in AVI 2014 International Working Conference on Advanced Visual Interfaces, ACM, May 2014",
        "img": "researchImages/DesignReflections.png",
        "bibEntry": "<div class=\"csl-entry\">Bigelow, A., Drucker, S., Fisher, D., and Meyer, M. (2014). Reflections on how designers design with data. In <i>Proceedings of the 2014 International Working Conference on Advanced Visual Interfaces</i> (pp. 17â\u0080\u009324). ACM.</div>",
        "text": "2014-avi-design-vis.txt",
        "title": "Reflections on how designers design with data",
        "author": [
            "Bigelow, Alex",
            "Drucker, Steven",
            "Fisher, Danyel",
            "Meyer, Miriah"
        ],
        "video": "http://research.microsoft.com/apps/pubs/default.aspx?id=208568",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Bigelow",
                "Fisher",
                "Meyer"
            ],
            "subject": [
                "Visualization",
                "Information",
                "Design"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "AVI"
            ]
        },
        "year": "2014",
        "ENTRYTYPE": "inproceedings",
        "ID": "bigelow2014reflections",
        "caption": "DesignReflections",
        "pages": "17--24",
        "abstract": "In recent years many popular data visualizations have emerged that are created largely by designers whose main area of expertise is not computer science. Designers generate these visualizations using a handful of design tools and environments. To better inform the development of tools intended for designers working with data, we set out to understand designers' challenges and perspectives. We interviewed professional designers, conducted observations of designers working with data in the lab, and observed designers working with data in team settings in the wild. A set of patterns emerged from these observations from which we extract a number of themes that provide a new perspective on design considerations for visualization tool creators, as well as on known engineering problems.",
        "thumb": "thumbnail/DesignReflections.png"
    },
    {
        "thumb": "thumbnail/hanpuku.png",
        "id": 3,
        "img": "researchImages/hanpuku.png",
        "number": "1",
        "primary": "Visualization",
        "publisher": "IEEE",
        "pdf": "papers/hanpuku.pdf",
        "reference": "Bigelow, A., Drucker, S., Fisher, D., & Meyer, M. (2017). Iterating between tools to create and edit visualizations.?IEEE Transactions on Visualization and Computer Graphics,?23(1), 481-490.",
        "text": "hanpuku.txt",
        "bibEntry": "<div class=\"csl-entry\">Bigelow, A., Drucker, S., Fisher, D., and Meyer, M. (2017). Iterating between tools to create and edit visualizations. <i>IEEE Transactions on Visualization and Computer Graphics</i>, <i>23</i>(1), 481â\u0080\u0093490.</div>",
        "volume": "23",
        "title": "Iterating between tools to create and edit visualizations",
        "author": [
            "Bigelow, Alex",
            "Drucker, Steven",
            "Fisher, Danyel",
            "Meyer, Miriah"
        ],
        "ID": "bigelow2017iterating",
        "pages": "481--490",
        "year": "2017",
        "ENTRYTYPE": "article",
        "journal": "IEEE Transactions on Visualization and Computer Graphics",
        "caption": "Hanpuku",
        "abstract": "A common work?ow for visualization designers begins with a generative tool, like D3 or Processing, to create the initial visualization;andproceedstoadrawingtool,likeAdobeIllustratororInkscape,foreditingandcleaning. Unfortunately,thisistypically a one-way process: once a visualization is exported from the generative tool into a drawing tool, it is dif?cult to make further, datadriven changes. In this paper, we propose a bridge model to allow designers to bring their work back from the drawing tool to re-edit in the generative tool. Our key insight is to recast this iteration challenge as a merge problem - similar to when two people are editing a document and changes between them need to reconciled. We also present a speci?c instantiation of this model, a tool called Hanpuku, which bridges between D3 scripts and Illustrator. We show several examples of visualizations that are iteratively created using Hanpuku in order to illustrate the ?exibility of the approach. We further describe several hypothetical tools that bridge between other visualization tools to emphasize the generality of the model.",
        "tags": {
            "collaborators": [
                "Bigelow",
                "Fisher",
                "Meyer"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Design"
            ],
            "year": [
                "2016"
            ],
            "publication": [
                "Infovis"
            ]
        }
    },
    {
        "booktitle": "Visual Analytics Science and Technology (VAST), 2015 IEEE Conference on",
        "id": 8,
        "organization": "IEEE",
        "img": "researchImages/featureinsight.png",
        "bibEntry": "<div class=\"csl-entry\">Brooks, M., Amershi, S., Lee, B., Drucker, S. M., Kapoor, A., and Simard, P. (2015). FeatureInsight: Visual support for error-driven feature ideation in text classification. In <i>Visual Analytics Science and Technology (VAST), 2015 IEEE Conference on</i> (pp. 105â\u0080\u0093112). IEEE.</div>",
        "title": "FeatureInsight: Visual support for error-driven feature ideation in text classification",
        "author": [
            "Brooks, Michael",
            "Amershi, Saleema",
            "Lee, Bongshin",
            "Drucker, Steven M",
            "Kapoor, Ashish",
            "Simard, Patrice"
        ],
        "ID": "brooks2015featureinsight",
        "tags": {
            "collaborators": [
                "Brooks",
                "Amershi",
                "Lee",
                "Kapoor",
                "Simard"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Machine Learning"
            ],
            "year": [
                "2015"
            ],
            "publication": [
                ""
            ]
        },
        "year": "2015",
        "ENTRYTYPE": "inproceedings",
        "primary": "UI-Information",
        "pages": "105--112",
        "abstract": "Machine learning requires an effective combination of data,  features, and algorithms. While many tools exist for working with machine learning data and algorithms, support for thinking of new features, or feature ideation, remains poor. In this paper, we investigate two general approaches to support feature ideation: visual summaries and sets of errors. We present FeatureInsight, an interactive visual analytics tool for building new dictionary features (semantically related groups of words) for text classification problems. FeatureInsight supports an error-driven feature ideation process and provides interactive visual summaries of sets of misclassified documents. We conducted a controlled experiment evaluating both visual summaries and sets of errors in FeatureInsight. Our results show that visual summaries significantly improve feature ideation, especially in combination with sets of errors. Users preferred visual summaries over viewing raw data, and only preferred examining sets when visual summaries were provided. We discuss extensions of both approaches to data types other than text, and point to areas for future research.",
        "caption": "Feature Insight"
    },
    {
        "id": 45,
        "img": "researchImages/registration.png",
        "bibEntry": "<div class=\"csl-entry\">Chen, B., Ramos, G., Ofek, E., Cohen, M., Drucker, S., and NistÃ©r, D. (2008). <i>Interactive techniques for registering images to digital terrain and building models</i>. Microsoft Research.</div>",
        "institution": "Microsoft Research",
        "title": "Interactive techniques for registering images to digital terrain and building models",
        "author": [
            "Chen, Billy",
            "Ramos, Gonzalo",
            "Ofek, Eyal",
            "Cohen, Michael",
            "Drucker, Steven",
            "Nist{\\'e}r, David"
        ],
        "ID": "chen2008interactive",
        "caption": "Terrain Registration",
        "year": "2008",
        "ENTRYTYPE": "techreport",
        "primary": "Graphics",
        "abstract": "We investigate two interactive techniques for registering an image to 3D digital terrain and building models. Registering an image enables a variety of applications, including slideshows with context, automatic annotation, and photo enhancement. To perform the registration, we investigate two modes of interaction. In the overlay interface, an image is displayed over a 3D view and a user manually aligns 3D points to points in the image. In the split interface, the image and the 3D view are displayed side-by-side and the user indicates matching points across the two views. Our user study suggests that the overlay interface is more engaging than split, but is less accurate in registration. We then show several applications that make use of the registration data.",
        "tags": {
            "collaborators": [
                "Chen",
                "Ramos",
                "Ofek",
                "Cohen"
            ],
            "subject": [
                "Graphics"
            ],
            "year": [
                "2008"
            ],
            "publication": [
                "Internal Report"
            ]
        }
    },
    {
        "id": 75,
        "number": "MSR-TR-2001-73",
        "pdf": "papers/flatland.pdf",
        "reference": "Chesley, H. Drucker, S. Gupta, A., Kimberly, G. White, S.  Flatland: Rapid prototyping of distributed internet applications.MSR-TR-2001-73.",
        "img": "researchImages/flatland.jpg",
        "bibEntry": "<div class=\"csl-entry\">Chesley, H., Drucker, S. M., Gupta, A., Kimberly, G., and White, S. (2001). <i>Flatland, Rapid prototyping of distributed internet applications</i> (No. MSR-TR-2001-73). Microsoft Research.</div>",
        "text": "flatland.txt",
        "institution": "Microsoft Research",
        "title": "Flatland, Rapid prototyping of distributed internet applications",
        "author": [
            "Chesley, Harry",
            "Drucker, Steven M",
            "Gupta, Anoop",
            "Kimberly, Greg",
            "White, Steven"
        ],
        "ID": "flatland",
        "tags": {
            "collaborators": [
                "Chesley",
                "Gupta",
                "Kimberly",
                "White"
            ],
            "subject": [
                "UI",
                "Education",
                "Social"
            ],
            "year": [
                "2001"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "year": "2001",
        "ENTRYTYPE": "techreport",
        "primary": "Social",
        "caption": "Flatland",
        "abstract": "Computer intra- and internets are widely used for client-server application such as web browsers. With the exception of e-mail, however, the same networks are seldom used for distributed, client-client or client-server-client applications. Such applications are difficult to develop and debug, and require a supporting infrastructure that is not readily available from existing systems. Flatland is a rapid prototyping environment that provides the underlying infrastructure and makes it easy to create and debug distributed internet application prototypes. In addition to the infrastructure needed for a distributed application, Flatland includes safe implementations of the most common sources of distributed application bugs, asynchronous operation and updating. Flatland also supports streaming audio-video and down-level clients.",
        "thumb": "thumbnail/flatland.jpg"
    },
    {
        "booktitle": "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
        "id": 12,
        "organization": "ACM",
        "pdf": "papers/demowiz.pdf",
        "reference": "Chi, Pei-Yu, Bongshin Lee, and Steven M. Drucker. DemoWiz: re-performing software demonstrations for a live presentation. Proceedings of the 32nd annual ACM conference on Human factors in computing systems. ACM, 2014.",
        "img": "researchImages/demowiz.png",
        "bibEntry": "<div class=\"csl-entry\">Chi, P.-Y., Lee, B., and Drucker, S. M. (2014). DemoWiz: re-performing software demonstrations for a live presentation. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 1581â\u0080\u00931590). ACM.</div>",
        "text": "demowiz.txt",
        "title": "DemoWiz: re-performing software demonstrations for a live presentation",
        "author": [
            "Chi, Pei-Yu",
            "Lee, Bongshin",
            "Drucker, Steven M"
        ],
        "primary": "Presentation",
        "tags": {
            "collaborators": [
                "Chi",
                "Lee"
            ],
            "subject": [
                "UI",
                "Presentation"
            ],
            "year": [
                "2014"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2014",
        "ENTRYTYPE": "inproceedings",
        "ID": "chi2014demowiz",
        "caption": "Demowiz",
        "pages": "1581--1590",
        "abstract": "Showing a live software demonstration during a talk can be engaging, but it is often not easy: presenters may struggle with (or worry about) unexpected software crashes and  encounter issues such as mismatched screen resolutions or faulty network connectivity.  Furthermore, it can be difficult to recall the steps to show while talking and operating the  system all at the same time. An alternative is to present with pre-recorded screencast videos. It is, however, challenging to precisely match the narration to the video when using existing video players. We introduce DemoWiz, a video presentation system that provides an increased awareness of upcoming actions through glanceable visualizations. DemoWiz supports better control of timing by overlaying visual cues and enabling lightweight editing. A user study shows that our design significantly improves the presenters??? perceived ease of narration and timing compared to a system without visualizations that was similar to a standard playback control. Furthermore, nine (out of ten) participants preferred DemoWiz over the standard playback control with the last expressing no preference.",
        "thumb": "thumbnail/demowiz.png"
    },
    {
        "thumb": "thumbnail/eyegaze.jpg",
        "id": 80,
        "primary": "Graphics",
        "pdf": "papers/tr-2000-81.pdf",
        "reference": "Alex Colburn, Michael F. Cohen, Steven Drucker, The Role of Eye Gaze in Avatar Mediated Conversational Interfaces ,  MSR-TR-2000-81, July, 2000",
        "img": "researchImages/eyegaze.jpg",
        "bibEntry": "<div class=\"csl-entry\">Colburn, A., Cohen, M. F., and Drucker, S. (2000). The role of eye gaze in avatar mediated conversational interfaces. <i>Sketches and Applications, Siggraphâ\u0080\u009900</i>.</div>",
        "title": "The role of eye gaze in avatar mediated conversational interfaces",
        "author": [
            "Colburn, Alex",
            "Cohen, Michael F",
            "Drucker, Steven"
        ],
        "ID": "colburn2000role",
        "caption": "Avatar Eye Gaze",
        "year": "2000",
        "ENTRYTYPE": "article",
        "journal": "Sketches and Applications, Siggraph'00",
        "abstract": "As we begin to create synthetic characters (avatars) for computer users, it is important to pay attention to both the look and the behavior of the avatar's eyes. In this paper we present behavior models of eye gaze patterns in the context of real-time verbal communication. We apply these eye gaze models to simulate eye movements in a computer-generated avatar in a number of task settings. We also report the results of an experiment that we conducted to assess whether our eye gaze model induces changes in the eye gaze behavior of an individual who is conversing with an avatar.",
        "tags": {
            "collaborators": [
                "Colburn",
                "Cohen"
            ],
            "subject": [
                "Graphics",
                "Animation"
            ],
            "year": [
                "2000"
            ],
            "publication": [
                "InternalReport"
            ]
        }
    },
    {
        "thumb": "thumbnail/conferencecalls.jpg",
        "id": 79,
        "primary": "Social",
        "pdf": "papers/tr-2001-95.pdf",
        "reference": "Alex Colburn, Michael F. Cohen, Steven Drucker, Scott Lee-Tiernan, Anoop Gupta, Graphical Enhancement For Voice Only Conference Calls,  MSR-TR-2001-95, 2001.",
        "img": "researchImages/conferencecalls.jpg",
        "bibEntry": "<div class=\"csl-entry\">Colburn, R. A., Cohen, M. F., Drucker, S. M., LeeTiernan, S., and Gupta, A. (2001). Graphical enhancements for voice only conference calls. <i>Microsoft Corporation, Redmond, WA, Technical Report MSR-TR-2001-95</i>.</div>",
        "text": "TR2007-04-02.txt",
        "title": "Graphical enhancements for voice only conference calls",
        "author": [
            "Colburn, R Alex",
            "Cohen, Michael F",
            "Drucker, Steven M",
            "LeeTiernan, Scott",
            "Gupta, Anoop"
        ],
        "ID": "colburn2001graphical",
        "caption": "Graphic enhancement for conference calls",
        "year": "2001",
        "ENTRYTYPE": "article",
        "journal": "Microsoft Corporation, Redmond, WA, Technical Report MSR-TR-2001-95",
        "abstract": "We present two very low bandwidth graphically enhanced interfaces for small group voice communications. One interface presents static images of the participants that highlight when one is speaking. The other interface utilizes three-dimensional avatars that can be quickly created. Eleven groups of 4 or 5 people were presented with each enhanced interface as well as conducting a live conversation and a voice only conversation. Experiments show that both graphically enhanced interfaces improve the understandability of conversations, particular with respect to impressions that others in the group could express themselves more easily, knowing who is talking, and when to speak. Little difference was found between the two graphical interfaces. Analysis of voice tracks also revealed differences between interfaces in the length and number of medium duration silences.",
        "tags": {
            "collaborators": [
                "Colburn",
                "Cohen",
                "Counts",
                "Gupta"
            ],
            "subject": [
                "Graphics",
                "Social"
            ],
            "year": [
                "2000"
            ],
            "publication": [
                "InternalReport"
            ]
        }
    },
    {
        "booktitle": "Visual Languages and Human-Centric Computing (VL/HCC'06)",
        "id": 59,
        "organization": "IEEE",
        "pdf": "papers/vlhcc06-final.pdf",
        "reference": "DeLine, R., M. Czerwinski, B. Meyers, G. Venolia, S. Drucker, and G. Robertson.  Code Thumbnails: Using Spatial Memory to Navigate Source Code.  Proc. VL/HCC 2006",
        "img": "researchImages/codethumb.jpg",
        "bibEntry": "<div class=\"csl-entry\">DeLine, R., Czerwinski, M., Meyers, B., Venolia, G., Drucker, S., and Robertson, G. (2006). Code thumbnails: Using spatial memory to navigate source code. In <i>Visual Languages and Human-Centric Computing (VL/HCCâ\u0080\u009906)</i> (pp. 11â\u0080\u009318). IEEE.</div>",
        "text": "vdmfinal.txt",
        "title": "Code thumbnails: Using spatial memory to navigate source code",
        "author": [
            "DeLine, Robert",
            "Czerwinski, Mary",
            "Meyers, Brian",
            "Venolia, Gina",
            "Drucker, Steven",
            "Robertson, George"
        ],
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "DeLine",
                "Czerwinski",
                "Meyers",
                "Venolia",
                "Robertson"
            ],
            "subject": [
                "Visualization",
                "Programming"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "VLL/HCC"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "inproceedings",
        "ID": "deline2006code",
        "caption": "Code Thumbnails",
        "pages": "11--18",
        "abstract": "Modern development environments provide many features for navigating source code, yet recent studies show the developers still spend a tremendous amount of time just navigating. Since existing navigation features rely heavily on memorizing symbol names, we present a new design, called Code Thumbnails, intended to allow a developer to navigate source code by forming a spa-tial memory of it. To aid intra-file navigation, we add a thumbnail image of the file to the scrollbar, which makes any part of the file one click away. To aid inter-file navigation, we provide a desktop of file thumbnail images, which make any part of any file one click away. We did a formative evaluation of the design with eleven experienced developers and present the results.",
        "thumb": "thumbnail/codethumb.jpg"
    },
    {
        "booktitle": "Proceedings of the 2005 conference on Designing for User eXperience",
        "id": 62,
        "organization": "AIGA: American Institute of Graphic Arts",
        "pdf": "papers/v4v.pdf",
        "reference": "Dontcheva M., Drucker S., Cohen M., v4v: a View for the Viewer, DUX 2005",
        "img": "researchImages/v4v.jpg",
        "bibEntry": "<div class=\"csl-entry\">Dontcheva, M., Drucker, S. M., and Cohen, M. F. (2005). v4v: a View for the Viewer. In <i>Proceedings of the 2005 conference on Designing for User eXperience</i> (p. 19). AIGA: American Institute of Graphic Arts.</div>",
        "text": "v4v.txt",
        "title": "v4v: a View for the Viewer",
        "author": [
            "Dontcheva, Mira",
            "Drucker, Steven M",
            "Cohen, Michael F"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/v4v.avi",
        "primary": "Presentation",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Cohen"
            ],
            "subject": [
                "Animation",
                "UI",
                "Presentation"
            ],
            "year": [
                "2005"
            ],
            "publication": [
                "DUX"
            ]
        },
        "year": "2005",
        "ENTRYTYPE": "inproceedings",
        "ID": "dontcheva2005v4v",
        "caption": "V4V",
        "pages": "19",
        "abstract": "We present a View for the Viewer (v4v), a slide viewer that focuses on the needs of the viewer of a presentation instead of the presenter. Our design centers on representing the deck of slides as a stack embedded in a 3-D world. With only single button clicks, the viewer can quickly and easily navigate the deck of slides. We provide four types of annotation techniques and have designed a synchronization mechanism that makes it easy for the viewer to move in and out of sync with the presenter. We also supply alarms as a method for viewer notification. We evaluate our approach with a preliminary user study resulting in positive feedback about our design plus suggestions for improvements and extensions.",
        "thumb": "thumbnail/v4v.jpg"
    },
    {
        "booktitle": "Proceedings of the 20th annual ACM symposium on User interface software and technology",
        "id": 50,
        "organization": "ACM",
        "pdf": "papers/DontchevaUist07.pdf",
        "reference": "Dontcheva, M, Drucker, S.M., Cohen, M., Salesin, D. Relations, Cards, and Search Templates: User-guided Web Data Integration and Layout, To Appear in UIST, 2007",
        "img": "researchImages/relations.png",
        "bibEntry": "<div class=\"csl-entry\">Dontcheva, M., Drucker, S. M., Salesin, D., and Cohen, M. F. (2007). Relations, cards, and search templates: user-guided web data integration and layout. In <i>Proceedings of the 20th annual ACM symposium on User interface software and technology</i> (pp. 61â\u0080\u009370). ACM.</div>",
        "text": "DontchevaUist07.txt",
        "title": "Relations, cards, and search templates: user-guided web data integration and layout",
        "author": [
            "Dontcheva, Mira",
            "Drucker, Steven M",
            "Salesin, David",
            "Cohen, Michael F"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/DontchevaUist07.mov",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Cohen",
                "Salesin"
            ],
            "subject": [
                "Visualization",
                "UI",
                "Search"
            ],
            "year": [
                "2007"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "2007",
        "ENTRYTYPE": "inproceedings",
        "ID": "dontcheva2007relations",
        "caption": "Relations, Templates",
        "pages": "61--70",
        "abstract": "in collecting and organizing Web content. First, we demonstrate an interface for creating associations between websites, which facilitate the automatic retrieval of related content. Second, we present an authoring interface that allows users to quickly merge content from many different websites into a uniform and personalized representation, which we call a card. Finally, we introduce a novel search paradigm that leverages the relationships in a card to direct search queries to extract relevant content from multipleWeb sources and fill a new series of cards instead of just returning a list of webpage URLs. Preliminary feedback from users is positive and validates our design",
        "thumb": "thumbnail/relations.png"
    },
    {
        "id": 35,
        "primary": "UI-Information",
        "publisher": "Morgan Kaufmann",
        "img": "researchImages/contentextraction.png",
        "bibEntry": "<div class=\"csl-entry\">Dontcheva, M., Drucker, S. M., Salesin, D., and Cohen, M. F. (2010). From Web Summaries to search templates. <i>No Code Required: Giving Users Tools to Transform the Web</i>, 235.</div>",
        "title": "From Web Summaries to search templates",
        "author": [
            "Dontcheva, Mira",
            "Drucker, Steven M",
            "Salesin, David",
            "Cohen, Michael F"
        ],
        "ID": "dontcheva2010web",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Salesin",
                "Cohen"
            ],
            "subject": [
                "Information",
                "UI"
            ],
            "year": [
                "2010"
            ],
            "publication": [
                "Book"
            ]
        },
        "year": "2010",
        "ENTRYTYPE": "article",
        "journal": "No Code Required: Giving Users Tools to Transform the Web",
        "pages": "235",
        "caption": "Web Summary Templates"
    },
    {
        "booktitle": "Proceedings of the 19th annual ACM symposium on User interface software and technology",
        "id": 57,
        "organization": "ACM",
        "pdf": "papers/uistPaperSummarizing.pdf",
        "reference": "Dontcheva, M., Drucker, S. M., Wade, G., Salesin, D., and Cohen, M. F. 2006. Summarizing personal web browsing sessions. In Proceedings of the 19th Annual ACM Symposium on User interface Software and Technology (Montreux, Switzerland, October 15 - 18, 2006). UIST '06. ACM Press, New York, NY, 115-124.",
        "img": "researchImages/webpage_photo.gif",
        "bibEntry": "<div class=\"csl-entry\">Dontcheva, M., Drucker, S. M., Wade, G., Salesin, D., and Cohen, M. F. (2006a). Collecting and organizing web content. In <i>Personal Information Management-Special Interest Group for Information Retrieval Workshop</i> (pp. 44â\u0080\u009347).</div>",
        "text": "uistPaperSummarizing.txt",
        "title": "Summarizing personal web browsing sessions",
        "author": [
            "Dontcheva, Mira",
            "Drucker, Steven M",
            "Wade, Geraldine",
            "Salesin, David",
            "Cohen, Michael F"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/uistSummariesfinalCut.mov",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Salesin",
                "Wade",
                "Cohen"
            ],
            "subject": [
                "Visualization",
                "UI",
                "Web",
                "Search"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "inproceedings",
        "ID": "dontcheva2006summarizing",
        "caption": "Summarizing Web Sessions",
        "pages": "115--124",
        "abstract": "We describe a system, implemented as a browser extension, that enables users to quickly and easily collect, view, and share personal Web content. Our system employs a novel interaction model, which allows a user to specify webpage extraction patterns by interactively selecting webpage elements and applying these patterns to automatically collect similar content. Further, we present a technique for creating visual summaries of the collected information by combining user labeling with predefined layout templates. These summaries are interactive in nature: depending on the behaviors encoded in their templates, they may respond to mouse events, in addition to providing a visual summary. Finally, the summaries can be saved or sent to others to continue the research at another place or time. Informal evaluation shows that our approach works well for popular websites, and that users can quickly learn this interaction model for collecting content from the Web.",
        "thumb": "thumbnail/webpage_photo.gif"
    },
    {
        "booktitle": "Personal Information Management-Special Interest Group for Information Retrieval Workshop",
        "id": 58,
        "img": "researchImages/collecting.png",
        "bibEntry": "<div class=\"csl-entry\">Dontcheva, M., Drucker, S. M., Wade, G., Salesin, D., and Cohen, M. F. (2006b). Summarizing personal web browsing sessions. In <i>Proceedings of the 19th annual ACM symposium on User interface software and technology</i> (pp. 115â\u0080\u0093124). ACM.</div>",
        "title": "Collecting and organizing web content",
        "author": [
            "Dontcheva, Mira",
            "Drucker, Steven M",
            "Wade, Geraldine",
            "Salesin, David",
            "Cohen, Michael F"
        ],
        "ID": "dontcheva2006collecting",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Wade",
                "Salesin",
                "Cohen"
            ],
            "subject": [
                "UI",
                "Information"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "Book"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "inproceedings",
        "primary": "UI-Information",
        "pages": "44--47",
        "abstract": "Our work focuses on lowering user overhead for collecting and organizing Web content through the use of automation and visualization. We discuss a framework that enables users to semi-automatically collect, view, and share personal Web content. Our approach allows a user to interactively select webpage elements of interest and automatically collect similar content. Further, we describe a technique for creating visual summaries of the collected information by combining user labeling with predefined layout templates. These summaries are interactive in nature and provide a variety of visual representations for the collected content. Finally, the summaries can be saved or sent to other users to continue the research at another place or time",
        "caption": "Collecting Web Content"
    },
    {
        "booktitle": "Proc SUI",
        "id": 44,
        "img": "researchImages/contentextraction.png",
        "bibEntry": "<div class=\"csl-entry\">Dontcheva, M., Lin, S., Drucker, S. M., Salesin, D., and Cohen, M. F. (2008). Experiences with content extraction from the web. In <i>Proc SUI</i>.</div>",
        "title": "Experiences with content extraction from the web",
        "author": [
            "Dontcheva, Mira",
            "Lin, Sharon",
            "Drucker, Steven M",
            "Salesin, David",
            "Cohen, Michael F"
        ],
        "ID": "dontcheva2008experiences",
        "caption": "Content Extraction",
        "year": "2008",
        "ENTRYTYPE": "inproceedings",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Lin",
                "Salesin",
                "Cohen"
            ],
            "subject": [
                "Information",
                "UI"
            ],
            "year": [
                "2008"
            ],
            "publication": [
                "SUI"
            ]
        }
    },
    {
        "id": 69,
        "tags": {
            "collaborators": [
                "He",
                "Cohen",
                "Gupta",
                "Wong",
                "Roseway",
                "De Mar"
            ],
            "subject": [
                "Graphics",
                "UI",
                "Games"
            ],
            "year": [
                "2003"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "pdf": "papers/spectator.pdf",
        "reference": "Drucker, S.M., He. L, Cohen, M., Gupta., A, Wong, C., Spectator Games: A New Entertainment Modality for Networked Multiplayer Games, 2003.",
        "img": "researchImages/spectator_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S., He, L., Cohen, M., Wong, C., and Gupta, A. (2002). <i>Spectator games: A new entertainment modality of networked multiplayer games</i>. Microsoft Research.</div>",
        "institution": "Microsoft Research",
        "title": "Spectator games: A new entertainment modality of networked multiplayer games",
        "author": [
            "Drucker, Steven",
            "He, Li-wei",
            "Cohen, Michael",
            "Wong, Curtis",
            "Gupta, Anoop"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/spectator.asf",
        "ID": "drucker2002spectator",
        "caption": "Spectator (concept)",
        "year": "2002",
        "ENTRYTYPE": "techreport",
        "primary": "Camera",
        "abstract": "Networked multiplayer games are becoming tremendously popular. At any given moment on the Microsoft Game Zone (http://zone.msn.com), there are thousands of people playing Asheron's Call or Age of Empires. Traditional board and card games are also increasingly being played online and will continue to gain in popularity. While networked games are certainly fun for active players, there is potentially a much larger audience: spectators. In most traditional games, such as football, the number of spectators far exceeds the number of players. The key idea presented in this paper is to tap this potential by making online games engaging and entertaining to non-players watching these games. <br> The experience for spectators can be made much richer by employing techniques often used in sports broadcasting, such as a commentator providing analysis and background stories, slow motion and instance replay. For 3D games, cinematic camera movements and shot cuts be much more visually interesting than the first-person views often provided to the players. There is the potential to significantly increase the 'eyeballs' on sites such as Microsoft Game Zone. Spectators can be more easily targeted for advertising. Finally, supporting the spectator experience will help drive sales of the games themselves as casual viewers take the next step to become players. Watching others play networked games has the potential to become a vital component to an overall entertainment/media strategy. The authors of this document have already developed significant technologies needed to support the online game spectator. We propose that new resources be devoted now to carry these technologies into practice.",
        "thumb": "thumbnail/spectator_photo.jpg"
    },
    {
        "id": 68,
        "number": "MSR-TR-2003-99",
        "pdf": "papers/phototriage.pdf",
        "reference": "Drucker, S. C. Wong, A. Roseway, S. Glenner, S. De Mar, Photo-triage: Rapidly annotating your digital photographs. MSR Tech Report.",
        "img": "researchImages/phototriage.jpg",       
        "bibEntry": "<div class=\"csl-entry\">Drucker, S., Wong, C., Roseway, A., Glenner, S., and De Mar, S. (2003). <i>Photo-triage: Rapidly annotating your digital photographs</i> (No. MSR-TR-2003-99). Microsoft Research.</div>",
 
        "text": "phototriage.txt",
        "institution": "Microsoft Research",
        "title": "Photo-triage: Rapidly annotating your digital photographs",
        "author": [
            "Drucker, Steven",
            "Wong, Curtis",
            "Roseway, Asta",
            "Glenner, Steve",
            "De Mar, Steve"
        ],
        "ID": "drucker2003photo",
        "tags": {
            "collaborators": [
                "Wong",
                "Roseway",
                "Glenner",
                "De Mar"
            ],
            "subject": [
                "UI",
                "Photos"
            ],
            "year": [
                "2003"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "year": "2003",
        "ENTRYTYPE": "techreport",
        "primary": "Photos",
        "caption": "Phototriage",
        "abstract": "The Photo-triage application is meant to be an essential part of the digital photography lifestyle. It can fit as a component wherever photo management is done (shell, picture-it, media-center, etc.). The central idea is to facilitate rapid, convenient categorization of one's personal photos into at least the following categories: hidden/private, majority, highlights, best and/or representative. See figure 1. This application is meant to fill an empty niche in the usage of digital photos: that is, there's no easy way add metadata to photos to mark them for printing, for sharing, or for slideshows without creating separate versions of the photos and copying into separate folders. We propose a sorting metaphor that will add implicit metadata when one first goes through the photos.",
        "thumb": "thumbnail/phototriage.jpg"
    },
    {
        "thumb": "thumbnail/natcomp.png",
        "booktitle": "Natural Computation",
        "publisher": "MIT Press",
        "reference": "Steven M. Drucker. Texture from Touch. In: Whitman Richards, editor. Natural Computation. MIT Press; 1988.",
        "img": "researchImages/natcomp.png",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M. (1988). Texture from Touch. In W. Richards (Ed.), <i>Natural Computation</i>. MIT Press.</div>",
        
        "editor": "Whitman Richards",
        "title": "Texture from Touch",
        "author": [
            "Drucker, Steven M"
        ],
        "ID": "texturefromtouch",
        "tags": {
            "collaborators": [
                "Individual"
            ],
            "subject": [
                "Robotics",
                "Touch"
            ],
            "year": [
                "1988"
            ],
            "publication": [
                "Book"
            ]
        },
        "year": "1988",
        "ENTRYTYPE": "incollection",
        "primary": "Robotics",
        "abstract": "Not available",
        "id": 98,
        "caption": "Texture from Touch"
    },
    {
        "thumb": "thumbnail/uistmoos.jpg",
        "id": 84,
        "pdf": "papers/moving.pdf",
        "reference": "Steven M. Drucker, Moving from MOOs to Multi-user Applications,  Internal Report, 1999.",
        "img": "researchImages/uistmoos.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M. (1999). <i>Moving from MOOs to Multi-User Applications</i>. Microsoft Research.</div>",
        "text": "moving.txt",
        "institution": "Microsoft Research",
        "title": "Moving from MOOs to Multi-User Applications",
        "author": [
            "Drucker, Steven M"
        ],
        "ID": "druckermoving",
        "caption": "MOOs to Multi-user apps",
        "year": "1999",
        "ENTRYTYPE": "techreport",
        "primary": "Social",
        "abstract": "This paper provides a brief description of the work we have done on the V-Worlds project, a system that facilitates the creation of multi-user applications and environments. We have taken concepts originally found in object oriented Multi-User Dungeons (MOOs) and extended them to deal with more general multi-user and in particular multi-media applications. We present reasons behind the architectural decisions of the platform and show that it has been used successfully for a wide range of examples.",
        "tags": {
            "collaborators": [
                "Individual"
            ],
            "subject": [
                "Graphics",
                "Social"
            ],
            "year": [
                "1999"
            ],
            "publication": [
                "InternalReport"
            ]
        }
    },
    {
        "id": 67,
        "pdf": "papers/spectator.pdf",
        "reference": "Drucker, S.M., He. L, Cohen, M., Gupta., A, Wong, C., Spectator Games: A New Entertainment Modality for Networked Multiplayer Games, 2003.",
        "img": "researchImages/spectator3.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and De Mar, S. (2002). <i>Spectator implementation in Mechwarrior</i>. Microsoft Research.</div>",
        "text": "spectator.txt",
        "institution": "Microsoft Research",
        "title": "Spectator implementation in Mechwarrior",
        "author": [
            "Drucker, Steven M",
            "De Mar, Steven"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/spectator3.wmv",
        "primary": "Camera",
        "tags": {
            "collaborators": [
                "He",
                "Cohen",
                "Gupta",
                "Wong",
                "De Mar"
            ],
            "subject": [
                "Graphics",
                "UI",
                "Games",
                "Thesis"
            ],
            "year": [
                "2003"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "year": "2002",
        "ENTRYTYPE": "misc",
        "ID": "drucker22002spectator2",
        "caption": "Spectator (MechWarrior)",
        "abstract": "Networked multiplayer games are becoming tremendously popular. At any given moment on the Microsoft Game Zone (http://zone.msn.com), there are thousands of people playing Asheron's Call or Age of Empires. Traditional board and card games are also increasingly being played online and will continue to gain in popularity. While networked games are certainly fun for active players, there is potentially a much larger audience: spectators. In most traditional games, such as football, the number of spectators far exceeds the number of players. The key idea presented in this paper is to tap this potential by making online games engaging and entertaining to non-players watching these games. <br> The experience for spectators can be made much richer by employing techniques often used in sports broadcasting, such as a commentator providing analysis and background stories, slow motion and instance replay. For 3D games, cinematic camera movements and shot cuts be much more visually interesting than the first-person views often provided to the players. There is the potential to significantly increase the 'eyeballs' on sites such as Microsoft Game Zone. Spectators can be more easily targeted for advertising. Finally, supporting the spectator experience will help drive sales of the games themselves as casual viewers take the next step to become players. Watching others play networked games has the potential to become a vital component to an overall entertainment/media strategy. The authors of this document have already developed significant technologies needed to support the online game spectator. We propose that new resources be devoted now to carry these technologies into practice.",
        "thumb": "thumbnail/spectator3.jpg"
    },
    {
        "booktitle": "IFIP Conference on Human-Computer Interaction",
        "id": 30,
        "organization": "Springer Berlin Heidelberg",
        "pdf": "papers/icluster_nonanonymous_sdrucker_cameraready.pdf",
        "reference": "Steven M. Drucker, Danyel Fisher, and Sumit Basu, Helping Users Sort Faster with Adaptive Machine Learning Recommendations, in Proceedings of Interact 2011, Springer, September 2011",
        "img": "researchImages/iclustering1.png",        
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Fisher, D., and Basu, S. (2011). Helping users sort faster with adaptive machine learning recommendations. In <i>IFIP Conference on Human-Computer Interaction</i> (pp. 187â\u0080\u0093203). Springer Berlin Heidelberg.</div>",        
        "text": "icluster_nonanonymous_sdrucker_cameraready.txt",
        "title": "Helping users sort faster with adaptive machine learning recommendations",
        "author": [
            "Drucker, Steven M",
            "Fisher, Danyel",
            "Basu, Sumit"
        ],
        "video": "http://www.youtube.com/watch?feature=player_embedded&v=3BmO3TILucQ",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Fisher",
                "Basu"
            ],
            "subject": [
                "UI",
                "Visualization",
                "Machine Learning"
            ],
            "year": [
                "2011"
            ],
            "publication": [
                "Interact"
            ]
        },
        "year": "2011",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker2011helping",
        "caption": "iCluster",
        "pages": "187--203",
        "abstract": "Sorting and clustering large numbers of documents can be an overwhelming task: manual solutions tend to be slow, while machine learning systems often present results that don???t align well with users' intents. We created and evaluated a system for helping users sort large numbers of documents into clusters. iCluster has the capability to recommend new items for existing clusters and appropriate clusters for items. The recommendations are based on a learning model that adapts over time ??? as the user adds more items to a cluster, the system???s model improves and the recommendations become more relevant. Thirty-two subjects used iCluster to sort hundreds of data items both with and without recommendations; we found that recommendations allow users to sort items more rapidly. A pool of 161 raters then assessed the quality of the resulting clusters, finding that clusters generated with recommendations were of statistically indistinguishable quality. Both the manual and assisted methods were substantially better than a fully automatic method.",
        "thumb": "thumbnail/iclustering1.png"
    },
    {
        "booktitle": "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
        "id": 18,
        "organization": "ACM",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Fisher, D., Sadana, R., and Herron, J. (2013). TouchViz: a case study comparing two interfaces for data analytics on tablets. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 2301â\u0080\u00932310). ACM.</div>",
        "pdf": "papers/touchvis-CHI2013-cameraready.pdf",
        "reference": "Steven M. Drucker, Danyel Fisher, Ramik Sadana, Jessica Herron, and mc schraefel, TouchViz, A Case Study Comparing Tow Interfaces for Data Analytics on Tablets, in Proceedings of the 2012 Conference on Human Factors in Computing Systems (CHI 2013), ACM Conference on Human Factors in Computing Systems, 29 April 2013",
        "img": "researchImages/touchvis.png",
        "text": "touchvis-CHI2013-cameraready.txt",
        "title": "TouchViz: a case study comparing two interfaces for data analytics on tablets",
        "author": [
            "Drucker, Steven M",
            "Fisher, Danyel",
            "Sadana, Ramik",
            "Herron, Jessica"
        ],
        "video": "http://research.microsoft.com/en-us/um/people/sdrucker/video/panodata.mp4.mp4",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Fisher",
                "Sadana",
                "Herron",
                "schraefel"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Touch"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2013",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker2013touchviz",
        "caption": "TouchViz",
        "pages": "2301--2310",
        "abstract": "As more applications move from the desktop to touch devices like tablets, designers must wrestle with the costs of porting a design with as little revision of the UI as possible from one device to the other, or of optimizing the interaction per device. We consider the tradeoffs between two versions of a UI for working with data on a touch tablet. One interface is based on using the conventional desktop metaphor (WIMP) with a control panel, push buttons, and checkboxes where the mouse click is effectively replaced by a finger tap. The other interface (which we call FLUID) eliminates the control panel and focuses touch actions on the data visualization itself. We describe our design process and evaluation of each interface. We discuss the significantly better task performance and preference for the FLUID interface, in particular how touch design may challenge certain assumptions about the performance benefits of WIMP interfaces that do not hold on touch devices, such as the superiority of gestural vs. control panel based interaction.",
        "thumb": "thumbnail/touchvis.png"
    },
    {
        "booktitle": "Proceedings of the 1992 symposium on Interactive 3D graphics",
        "id": 94,
        "organization": "ACM",
        "pdf": "papers/SIG92symp.pdf",
        "reference": "Drucker, S.M., Galyean, T.A., and Zeltzer, D. CINEMA: A System for Procedural Camera Movements. SIGGRAPH Symposium on 3D Interaction. Cambridge, MA. 1992.",
        "img": "researchImages/cinema.gif",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Galyean, T. A., and Zeltzer, D. (1992). Cinema: A system for procedural camera movements. In <i>Proceedings of the 1992 symposium on Interactive 3D graphics</i> (pp. 67â\u0080\u009370). ACM.</div>",
        "text": "SIG92symp.txt",
        "title": "Cinema: A system for procedural camera movements",
        "author": [
            "Drucker, Steven M",
            "Galyean, Tinsley A",
            "Zeltzer, David"
        ],
        "primary": "Camera",
        "tags": {
            "collaborators": [
                "Galyean",
                "Zeltzer"
            ],
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "year": [
                "1992"
            ],
            "publication": [
                "SIGGRAPH",
                "Thesis"
            ]
        },
        "year": "1992",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker1992cinema",
        "caption": "Cinema Program",
        "pages": "67--70",
        "abstract": "This paper presents a general system for camera movement upon which a wide variety of higher-level methods and applications can be built. In addition to the basic commands for camera placement, a key attribute of the CINEMA system is the ability to inquire information directly about the 3D world through which the camera is moving. With this information high-level procedures can be written that closely correspond to more natural camera specifications. Examples of some high-level procedures are presented. In addition, methods for overcoming deficiencies of this procedural approach are proposed.",
        "thumb": "thumbnail/cinema.gif"
    },
    {
        "booktitle": "Proceedings of the SIGCHI conference on Human factors in computing systems",
        "id": 73,
        "organization": "ACM",
        "pdf": "papers/smartskipfinal.pdf",
        "reference": "Drucker, S.,  Glatzer, A., De Mar, S and Wong, C. SmartSkip: Consumer level browsing and skipping of digital video content. In Proceedings of CHI 2002, Minneapolis, Minnesota, 2002",
        "img": "researchImages/smartskip_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Glatzer, A., De Mar, S., and Wong, C. (2002). SmartSkip: consumer level browsing and skipping of digital video content. In <i>Proceedings of the SIGCHI conference on Human factors in computing systems</i> (pp. 219â\u0080\u0093226). ACM.</div>",        
        "text": "smartskipfinal.txt",
        "title": "SmartSkip: consumer level browsing and skipping of digital video content",
        "author": [
            "Drucker, Steven M",
            "Glatzer, Asta",
            "De Mar, Steven",
            "Wong, Curtis"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/smartskip2.wmv",
        "primary": "Media",
        "tags": {
            "collaborators": [
                "Roseway",
                "De Mar",
                "Wong"
            ],
            "subject": [
                "UI",
                "TV",
                "Media"
            ],
            "year": [
                "2002"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2002",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker2002smartskip",
        "caption": "Smart Skip",
        "pages": "219--226",
        "abstract": "In this paper, we describe an interface for browsing and skipping digital video content in a consumer setting; that is, sitting and watching television from a couch using a standard remote control. We compare this interface with two other interfaces that are in common use today and found that subjective satisfaction was statistically better with the new interface. Performance metrics however, like time to task completion and number of clicks were worse.",
        "thumb": "thumbnail/smartskip_photo.jpg"
    },
    {
        "booktitle": "Proceedings of the 19th annual ACM symposium on User interface software and technology",
        "id": 56,
        "organization": "ACM",
        "pdf": "papers/fp214-DruckerFinalSmall.pdf",
        "reference": "Drucker, S. M., Petschnigg, G., and Agrawala, M. 2006. Comparing and managing multiple versions of slide presentations. In Proceedings of the 19th Annual ACM Symposium on User interface Software and Technology (Montreux, Switzerland, October 15 - 18, 2006). UIST '06. ACM Press, New York, NY, 47-56.",
        "img": "researchImages/vizpptdiff.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Petschnigg, G., and Agrawala, M. (2006). Comparing and managing multiple versions of slide presentations. In <i>Proceedings of the 19th annual ACM symposium on User interface software and technology</i> (pp. 47â\u0080\u009356). ACM.</div>",
        "text": "fp214-DruckerFinalSmall.txt",
        "title": "Comparing and managing multiple versions of slide presentations",
        "author": [
            "Drucker, Steven M",
            "Petschnigg, Georg",
            "Agrawala, Maneesh"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/pptviznew.wmv",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Petschnigg",
                "Agrawala"
            ],
            "subject": [
                "Visualization",
                "UI",
                "Presentation",
                "Temporal"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker2006comparing",
        "caption": "Powerpoint Diff",
        "pages": "47--56",
        "abstract": "Despite the ubiquity of slide presentations, managing multiple presentations remains a challenge. Understanding how multiple versions of a presentation are related to one another, assembling new presentations from existing presentations, and collaborating to create and edit presentations are difficult tasks. <br>  In this paper, we explore techniques for comparing and managing multiple slide presentations. We propose a general comparison framework for computing similarities and differences between slides. Based on this framework we develop an interactive tool for visually comparing multiple presentations. The interactive visualization facilitates understanding how presentations have evolved over time. We show how the interactive tool can be used to assemble new presentations from a collection of older ones and to merge changes from multiple presentation authors.",
        "thumb": "thumbnail/vizpptdiff.jpg"
    },
    {
        "booktitle": "Proceedings of the 2005 conference on Designing for User eXperience",
        "id": 61,
        "organization": "AIGA: American Institute of Graphic Arts",
        "pdf": "papers/vdmfinal.pdf",
        "reference": "Drucker, S., Regan, T., Roseway, A., Lofstrom. M, The visual decision maker: a recommendation system for collocated users, DUX 2005",
        "img": "researchImages/VDM.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Regan, T., Roseway, A., and Lofstrom, M. (2005). The visual decision maker: A recommendation system for collocated users. In <i>Proceedings of the 2005 conference on Designing for User eXperience</i> (p. 21). AIGA: American Institute of Graphic Arts.</div>",
        "text": "vdmfinal.txt",
        "title": "The visual decision maker: A recommendation system for collocated users",
        "author": [
            "Drucker, Steven M",
            "Regan, Tim",
            "Roseway, Asta",
            "Lofstrom, Markus"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/vdm.wmv",
        "primary": "Media",
        "tags": {
            "collaborators": [
                "Regan",
                "Roseway",
                "Lofstrom"
            ],
            "subject": [
                "Graphics",
                "UI",
                "Movies",
                "Visualization"
            ],
            "year": [
                "2005"
            ],
            "publication": [
                "DUX"
            ]
        },
        "year": "2005",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker2005visual",
        "caption": "Visual Decision Maker",
        "pages": "21",
        "abstract": "We present the Visual Decision Maker (VDM), an application that gives movie recommendations to groups of people sitting together. The VDM provides a TV like user experience: a stream of movie stills flows towards the center of the screen, and users press buttons on remote controls to vote on the currently selected movie. A collaborative filtering engine provides recommendations for each user and for the group as a whole based on the votes. Three principles guided our design of the VDM: shared focus, dynamic pacing, and encouraging conversations. In this paper we present the results of a four month public installation and a lab study showing how these design choices affected people's usage and people's experience of the VDM. Our results show that shared focus is important for users to feel that the group's tastes are represented in the recommendations.",
        "thumb": "thumbnail/VDM.jpg"
    },
    {
        "booktitle": "Third Eurographics Workshop on Rendering (Bristol, uk",
        "id": 93,
        "pdf": "papers/eurorendworkshop.pdf",
        "reference": "Drucker, S.M. and Schroeder, P. Fast Radiosity:A Data Parallel Approach. 3rd Workshop on Photorealistic Rendering, Bristol, U.K. 1992.",
        "img": "researchImages/parallelRadiosity.gif",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and SchrÃ¶der, P. (1992). Fast radiosity using a data parallel architecture. In <i>Third Eurographics Workshop on Rendering (Bristol, uk</i> (pp. 247â\u0080\u0093258).</div>",
        
        "text": "eurorendworkshop.txt",
        "title": "Fast radiosity using a data parallel architecture",
        "author": [
            "Drucker, Steven M",
            "Schr{\\\"o}der, Peter"
        ],
        "primary": "Graphics",
        "tags": {
            "collaborators": [
                "Schroeder"
            ],
            "subject": [
                "Graphics",
                "Parallel Computing"
            ],
            "year": [
                "1992"
            ],
            "publication": [
                "PhotorealisticWorkshop"
            ]
        },
        "year": "1992",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker1992fast",
        "caption": "Parallel Radiosity",
        "pages": "247--258",
        "abstract": "We present a data parallel algorithm for radiosity. The algorithm was designed to take advantage of large numbers of processors. It has been implemented on the Connection Machine CM2 system and scales linearly in the number of available processors over a wide range. All parts of the algorithm | form-factor computation, visibility determination, adaptive subdivision, and linear algebra solution | execute in parallel with a completely distributed database. Load balancing is achieved through processor allocation and dynamic data structures which reconfigure appropriately to match the granularity of the required calculations.",
        "thumb": "thumbnail/parallelRadiosity.gif"
    },
    {
        "thumb": "thumbnail/tokenTV_photo.jpg",
        "id": 74,
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Wong, C. (2001b). <i>Token TV: Sharing preferences for Television DVR recording</i>. Microsoft Research.</div>",
        "pdf": "papers/tokentv.pdf",
        "reference": "Drucker, S.M., Wong, C. 2001, Token TV: Sharing preferences for Television DVR Recording, MS Technical Report",
        "img": "researchImages/tokenTV_photo.jpg",
        "institution": "Microsoft Research",
        "title": "Token TV: Sharing preferences for Television DVR recording",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis"
        ],
        "ID": "tokentv",
        "caption": "Token TV",
        "year": "2001",
        "ENTRYTYPE": "techreport",
        "primary": "Media",
        "abstract": "TV Tokens (GUID for a specific broadcast program or movie) can be embedded in any website, EPG or email, downloaded and shared between friends to send to respective PVR's to schedule recording of show. TokenTV service (dot.NET TV) converts GUID to resolve to local schedule information needed to program the PVR. Any content based website (i.e.: IBDB.com, PBS.org, AFI.org) could have tokens to download to PVR for recording specific content.",
        "tags": {
            "collaborators": [
                "Wong"
            ],
            "subject": [
                "UI",
                "TV",
                "Media"
            ],
            "year": [
                "2001"
            ],
            "publication": [
                "InternalReport"
            ]
        }
    },
    {
        "id": 76,
        "tags": {
            "collaborators": [
                "Wong"
            ],
            "subject": [
                "UI",
                "TV",
                "Media"
            ],
            "year": [
                "2001"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "reference": "Drucker, S.M., Wong, C. 2001, DeepNews: Automatic related material based on closed caption information, MS Technical Report",
        "img": "researchImages/deepnews_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Wong, C. (2001a). <i>DeepNews: Automatic related material based on closed caption information</i>. Microsoft Research.</div>",
        "institution": "Microsoft Research",
        "title": "DeepNews: Automatic related material based on closed caption information",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/DeepnewsEnhanced.wmv",
        "ID": "deepnews",
        "caption": "DeepNews",
        "year": "2001",
        "ENTRYTYPE": "techreport",
        "primary": "Media",
        "abstract": "By monitoring the closed caption stream of a news broadcast, the web can be searched for related articles and more in depth stories can be found.",
        "thumb": "thumbnail/deepnews_photo.jpg"
    },
    {
        "id": 72,
        "tags": {
            "collaborators": [
                "Wong",
                "Roseway"
            ],
            "subject": [
                "UI",
                "TV",
                "Media"
            ],
            "year": [
                "2002"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "reference": "Drucker, S.M. 2002, Filtered Electronic Program Guides, MS Technical Report",
        "img": "researchImages/tvnow_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Wong, C. (2002). <i>Filtered Electronic Program Guides</i>. Microsoft Research.</div>",
        
        "institution": "Microsoft Research",
        "title": "Filtered Electronic Program Guides",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis"
        ],
        "video": "http://research.microsoft.com/~sdrucker/nextmedia/TVNow.exe",
        "ID": "filteredepg",
        "caption": "Filtered EPG",
        "year": "2002",
        "ENTRYTYPE": "techreport",
        "primary": "Media",
        "abstract": "This electronic program guide uses automatically computed favorites based on viewing habits per time of day and day of week as well as simple filtering features to allow for rapid selection of television.",
        "thumb": "thumbnail/tvnow_photo.jpg"
    },
    {
        "id": 65,
        "tags": {
            "collaborators": [
                "Wong"
            ],
            "subject": [
                "UI",
                "Visualization",
                "Information"
            ],
            "year": [
                "2003"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "type": "software",
        "reference": "Drucker, S, People Browser, MS Internal Report",
        "img": "researchImages/peoplebrowser_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Wong, C. (2003b). <i>People Browser</i>.</div>",
        "title": "People Browser",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/peoplebrowser.avi",
        "ID": "peoplebrowser",
        "caption": "People Browser",
        "year": "2003",
        "ENTRYTYPE": "misc",
        "primary": "UI-Information",
        "abstract": "The concept of 6 degrees separation (6 DOS) can be applied to many different domains. As demonstrated in the MediaVariations Browser, movies can easily be browsed using clusters of related movies using the actor and director to help associate movies. Looking at people is even more natural for this type of browsing, since that is what the concept of 6 DOS is usually associated with. The PeopleBrowser uses a person's rank within an organization, their management chain, their peers (under the same manager), their direct reports, and people with their same title, to help browse through an organization. Other clusters could also easily be used, including those people on the same mailing list, frequently mailed, etc. This project was done in conjunction with the Shell MSX team (Hillel Cooperman, Rob Girling, and Jeni Sadler).",
        "thumb": "thumbnail/peoplebrowser_photo.jpg"
    },
    {
        "id": 66,
        "tags": {
            "collaborators": [
                "Roseway",
                "De Mar",
                "Wong"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Movies"
            ],
            "year": [
                "2003"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "type": "software",
        "reference": "Drucker, S. Movie Variations, MS Tech Report",
        "img": "researchImages/MV_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Wong, C. (2003a). <i>Movie Variations</i>.</div>",
        "title": "Movie Variations",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/mbrowse2.wmv",
        "ID": "movievariations",
        "caption": "Movie Variations",
        "year": "2003",
        "ENTRYTYPE": "misc",
        "primary": "Media",
        "abstract": "This system allows for browsing a movie collection by moving from one related group of movies to another related group, where groups are related by common actor or director. As the user selects a movie from the cluster, it moves to the center and 4 related clusters are moved arranged around the movie. Extensions can include clusters that are related by collaborative filtering or other common features.",
        "thumb": "thumbnail/MV_photo.jpg"
    },
    {
        "thumb": "thumbnail/rightnow_viewer_photo.jpg",
        "id": 70,
        "type": "demo",
        "reference": "Drucker, S. Wong, C. Right Now Viewer, MS Internal Report",
        "img": "researchImages/rightnow_viewer_photo.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Wong, C., and De Mar, S. (2002). <i>Right Now Viewer</i>.</div>",
        "title": "Right Now Viewer",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis",
            "De Mar, Steven"
        ],
        "ID": "rnviewer",
        "caption": "Right Now Viewer",
        "year": "2002",
        "ENTRYTYPE": "misc",
        "primary": "Media",
        "abstract": "The purpose of this thought experiment was to look at time compression for when you turned on the TV to quickly find out what's on. Changing channels takes time and often there's a commercial on so you have to wait. This demo shows how a tuner could cache 12 most popular tv channels you watch and assemble them into a time compressed 30x real time video clip. In this prototype you can click on an individual thumbnail and it plays regular speed. The time compression inherent in the clips is long enough to transcend the commercials so you can see what's on. UI study participants were able to distinguish different TV formats (like sports vs. news), but failed to get a more detailed grasp of the program. For this the UI seemed to display too much information simultaneously. Additional experiments need to be done to find the right balance of speed, number and size of simultaneous videos playing and video thumbnail size would improve comprehension and recognition.",
        "tags": {
            "collaborators": [
                "Wong",
                "Flora"
            ],
            "subject": [
                "UI",
                "TV"
            ],
            "year": [
                "2002"
            ],
            "publication": [
                "InternalReport"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the working conference on Advanced visual interfaces",
        "id": 63,
        "organization": "ACM",
        "pdf": "papers/mediaframeAVIlong.pdf",
        "reference": "Drucker, S. C. Wong, A. Roseway, S. Glenner, S. De Mar, MediaBrowser: Reclaiming the Shoebox. in Proceedings of AVI2004, Gallipoli, Italy, 2004.",
        "img": "researchImages/MFAG.png",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., Wong, C., Roseway, A., Glenner, S., and De Mar, S. (2004). MediaBrowser: reclaiming the shoebox. In <i>Proceedings of the working conference on Advanced visual interfaces</i> (pp. 433â\u0080\u0093436). ACM.</div>",
        
        "text": "mediaframeAVIlong.txt",
        "title": "MediaBrowser: reclaiming the shoebox",
        "author": [
            "Drucker, Steven M",
            "Wong, Curtis",
            "Roseway, Asta",
            "Glenner, Steven",
            "De Mar, Steven"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/LH%20MediaFrame%20Final.wmv",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Wong",
                "Roseway",
                "Glenner",
                "De Mar"
            ],
            "subject": [
                "Graphics",
                "Photos",
                "UI",
                "Visualization"
            ],
            "year": [
                "2004"
            ],
            "publication": [
                "AVI"
            ]
        },
        "year": "2004",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker2004mediabrowser",
        "caption": "MediaBrowser",
        "pages": "433--436",
        "abstract": "Applying personal keywords to images and video clips makes it possible to organize and retrieve them, as well as automatically create thematically related slideshows. MediaBrowser is a system designed to help users create annotations by uniting a careful choice of interface elements, an elegant and pleasing design, smooth motion and animation, and a few simple tools that are predictable and consistent. The result is a friendly, useable tool for turning shoeboxes of old photos into labeled collections that can be easily browsed, shared, and enjoyed.",
        "thumb": "thumbnail/MFAG.png"
    },
    {
        "booktitle": "Graphics Interface",
        "id": 89,
        "organization": "CANADIAN INFORMATION PROCESSING SOCIETY",
        "pdf": "papers/GImuseum_wfigs.pdf",
        "reference": "Drucker, S.M. and Zeltzer, D. Intelligent Camera Control in a Virtual Environment Graphics Interface '94.",
        "img": "researchImages/museum1.gif",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Zeltzer, D. (1994). Intelligent camera control in a virtual environment. In <i>Graphics Interface</i> (pp. 190â\u0080\u0093190). CANADIAN INFORMATION PROCESSING SOCIETY.</div>",
        "text": "GImuseum_wfigs.txt",
        "title": "Intelligent camera control in a virtual environment",
        "author": [
            "Drucker, Steven M",
            "Zeltzer, David"
        ],
        "primary": "Camera",
        "tags": {
            "collaborators": [
                "Zeltzer"
            ],
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "year": [
                "1994"
            ],
            "publication": [
                "GI",
                "Thesis"
            ]
        },
        "year": "1994",
        "ENTRYTYPE": "inproceedings",
        "ID": "drucker1994intelligent",
        "caption": "Virtual Museum",
        "pages": "190--190",
        "abstract": "This paper describes a framework for exploring intelligent camera controls in a 3D virtual environment. It presents a methodology for designing the underlying camera controls based on an analysis of what tasks are to be required in a specific environment. Once an underlying camera framework is built, a variety of interfaces can be connected to the framework. A virtual museum is used as a prototypical virtual environment for this work. This paper identifies some of the tasks that need to be performed in a virtual museum; presents a paradigm for encapsulating those tasks into camera modules; and describes in detail the underlying mechanisms that make up the camera module for navigating through the environment.",
        "thumb": "thumbnail/museum1.gif"
    },
    {
        "id": 13,
        "type": "software",
        "pdf": "papers/sanddance.pdf",
        "reference": "Unpublished",
        "img": "researchImages/sanddance.png",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Fernandez, R. (2013). <i>SandDance</i>. Microsoft Research.</div>",
        
        "text": "sanddance.txt",
        "institution": "Microsoft Research",
        "title": "SandDance",
        "author": [
            "Drucker, Steven M.",
            "Fernandez, Roland"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/TouchViz2.mp4",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Fernandez",
                "Fisher"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Touch"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "year": "2013",
        "ENTRYTYPE": "misc",
        "ID": "SandDance",
        "caption": "SandDance",
        "abstract": "SandDance is a browser based information visualization system prototype created at Microsoft Research that scales to hundreds of thousands of items. Arbitrary datatables can be loaded and results can be filtered using facets and search and displayed in a variety of layouts. Transitions between the views are animated so that users can better maintain context. Multiple linked views allow for associations between the same items in each view. Multiple devices can simultaneusly interact with each other on the same dataset.  Using principles of information visualization, users can map any attribute into the position, color, size, opacity and layout of a dataset to help reveal patterns within the data. SandDance lets you see both the individual records, and their overall structure.  SandDance focusses on natural user interaction techniques. Touch interaction is a first class citizen, allowing the entire experience to be easily operated through a touch screen. The system also understand speech commands for searching, selecting, focusing and filtering the data. A kinect system can be used to sense gestures for moving between views of the data. Collaboration is supported by allowing multiple sets of people to interact with the same dataset. Selections and filters in one system are automatically replicated to other systems viewing the data.",
        "thumb": "thumbnail/sanddance.png"
    },
    {
        "thumb": "thumbnail/thumbtackthumb.jpg",
        "id": 41,
        "type": "software",
        "reference": "Internal Report",
        "img": "researchImages/thumbtackthumb.jpg",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M., and Hydrie, A. (2009). <i>LiveLabs ThumbTack</i>.</div>",
        "title": "LiveLabs ThumbTack",
        "author": [
            "Drucker, Steven M.",
            "Hydrie, Aamer"
        ],
        "ID": "llthumbtack",
        "caption": "LiveLabs Thumbtack",
        "year": "2009",
        "ENTRYTYPE": "misc",
        "primary": "UI-Information",
        "abstract": "Thumbtack is an easy way to save links, photos, and anything else you can find on bunch of different Web sites to a single place.  Grab the stuff you want, put it into a Thumbtack collection, then get to it from anywhere you can get online.  Share it with your friends, or just keep it for yourself. It's way easier than sending a bunch of links in an e-mail, and even easier than setting lots of favorites in your browser.",
        "tags": {
            "collaborators": [
                "Hydrie",
                "Cutler",
                "Oliveira",
                "Bergeron",
                "Lakshmiratan"
            ],
            "subject": [
                "UI",
                "Information",
                "Web"
            ],
            "year": [
                "2009"
            ],
            "publication": [
                "InternalReport"
            ]
        }
    },
    {
        "booktitle": "Intelligent camera control for graphical environments",
        "publisher": "MIT",
        "pdf": "papers/SIG95symp.pdf",
        "reference": "Drucker, S.M. and Zeltzer, D. CamDroid: A System for InEelligent Camera Control. SIGGRAPH Symposium on Interactive 3D Graphics, 1995.",
        "img": "researchImages/camdroid.gif",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M. (1994a). CamDroid. In <i>Intelligent camera control for graphical environments</i>. MIT.</div>",
        
        "text": "SIG95symp.txt",
        "title": "CamDroid",
        "author": [
            "Drucker, Steven Mark"
        ],
        "ID": "virtualMuseum",
        "tags": {
            "collaborators": [
                "Zeltzer"
            ],
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "year": [
                "1995"
            ],
            "publication": [
                "SIGGRAPH",
                "Thesis"
            ]
        },
        "year": "1994",
        "ENTRYTYPE": "incollection",
        "primary": "Camera",
        "caption": "CamDroid",
        "abstract": "In this paper, a method of encapsulating camera tasks into well defined units called camera modules is described. Through this encapsulation, camera modules can be programmed and sequenced, and thus can be used as the underlying framework for controlling the virtual camera in widely disparate types of graphical environments. Two examples of the camera framework are shown: an agent which can film a conversation between two virtual actors and a visual programming language for filming a virtual football game.",
        "id": 86,
        "thumb": "thumbnail/camdroid.gif"
    },
    {
        "booktitle": "Intelligent camera control for graphical environments",
        "publisher": "MIT",
        "pdf": "papers/thesiswbmakrs.pdf",
        "reference": "Drucker, S.M. Intelligent Camera Control for Graphical Environments PhD Thesis, MIT Media Lab. 1994.",
        "img": "researchImages/footballsm.gif",
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M. (1994c). Virtual Football. In <i>Intelligent camera control for graphical environments</i>. MIT.</div>",
        "text": "thesiswbmakrs.txt",
        "title": "Virtual Football",
        "author": [
            "Drucker, Steven Mark"
        ],
        "ID": "virtualfootball",
        "tags": {
            "collaborators": [
                "Individual"
            ],
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "year": [
                "1994"
            ],
            "publication": [
                "Thesis"
            ]
        },
        "year": "1994",
        "ENTRYTYPE": "incollection",
        "primary": "Camera",
        "caption": "Virtual Football",
        "abstract": "Too often in the field of computer graphics, practitioners have been more concerned with the question of how to move a camera rather than why to move it. This thesis addresses the core question of why the camera is being placed and moved and uses answers to that question to provide a more convenient, more intelligent method for controlling virtual cameras in computer graphics. After discussing the general sorts of activities to be performed in graphical environments, this thesis then contains a derivation of some camera primitives that are required, and examines how they can be incorporated into different interfaces. A single, consistent, underlying framework for camera control across many different domains has been posited and formulated in terms of constrained optimization. Examples from different application domains demonstrate a variety of interface styles that have all been implemented on top of the underlying framework. Evaluations for each application are also given.",
        "id": 88,
        "thumb": "thumbnail/footballsm.gif"
    },
    {
        "thumb": "thumbnail/conversesm.gif",
        "id": 90,
        "pdf": "papers/thesiswbmakrs.pdf",
        "reference": "Drucker, S.M. Intelligent Camera Control for Graphical Environments PhD Thesis, MIT Media Lab. 1994.",
        "img": "researchImages/conversesm.gif",        
        "bibEntry": "<div class=\"csl-entry\">Drucker, S. M. (1994b). <i>Intelligent camera control for graphical environments</i>. Massachusetts Institute of Technology.</div>",
       "text": "thesiswbmakrs.txt",
        "title": "Intelligent camera control for graphical environments",
        "author": [
            "Drucker, Steven Mark"
        ],
        "ID": "drucker1994intelligent",
        "caption": "Conversation Agent",
        "year": "1994",
        "ENTRYTYPE": "phdthesis",
        "primary": "Camera",
        "school": "Massachusetts Institute of Technology",
        "abstract": "Too often in the field of computer graphics, practitioners have been more concerned with the question of how to move a camera rather than why to move it. This thesis addresses the core question of why the camera is being placed and moved and uses answers to that question to provide a more convenient, more intelligent method for controlling virtual cameras in computer graphics. After discussing the general sorts of activities to be performed in graphical environments, this thesis then contains a derivation of some camera primitives that are required, and examines how they can be incorporated into different interfaces. A single, consistent, underlying framework for camera control across many different domains has been posited and formulated in terms of constrained optimization. Examples from different application domains demonstrate a variety of interface styles that have all been implemented on top of the underlying framework. Evaluations for each application are also given.",
        "tags": {
            "collaborators": [
                "Individual"
            ],
            "subject": [
                "Graphics",
                "Animation",
                "Camera",
                "Thesis"
            ],
            "year": [
                "1994"
            ],
            "publication": [
                "Camera"
            ]
        }
    },
    {
        "id": 2,
        "number": "3",
        "primary": "Presentation",
        "publisher": "ACM",
        "pdf": "papers/a16-edge.pdf",
        "reference": "Edge, Darren, et al. \"SlideSpace: Heuristic Design of a Hybrid Presentation Medium.\"?ACM Transactions on Computer-Human Interaction (TOCHI)?23.3 (2016): 16.",
        "img": "researchImages/slidespace.png",
        "bibEntry": "<div class=\"csl-entry\">Edge, D., Yang, X., Kotturi, Y., Wang, S., Feng, D., Lee, B., and Drucker, S. (2016). SlideSpace: Heuristic Design of a Hybrid Presentation Medium. <i>ACM Transactions on Computer-Human Interaction (TOCHI)</i>, <i>23</i>(3), 16.</div>",
        "volume": "23",
        "title": "SlideSpace: Heuristic Design of a Hybrid Presentation Medium",
        "author": [
            "Edge, Darren",
            "Yang, Xi",
            "Kotturi, Yasmine",
            "Wang, Shuoping",
            "Feng, Dan",
            "Lee, Bongshin",
            "Drucker, Steven"
        ],
        "ID": "edge2016slidespace",
        "thumb": "thumbnail/slidespace.png",
        "year": "2016",
        "ENTRYTYPE": "article",
        "journal": "ACM Transactions on Computer-Human Interaction (TOCHI)",
        "caption": "SlideSpace",
        "pages": "16",
        "abstract": "The Slide and Canvas metaphors are two ways of helping people create visual aids for oral presentations. Although such physical metaphors help both authors and audiences make sense of material, they also constrain authoring in ways that can negatively impact presentation delivery. In this article, we derive heuristics for the design of presentation media that are independent of any underlying physical metaphors. We use these heuristics to craft a new kind of presentation medium called SlideSpace?one that combines hierarchical outlines, content collections, and design rules to automate the real-time, outline-driven synthesis of hybrid Slide-Canvas visuals. Through a qualitative study of SlideSpace use, we validate our heuristics and demonstrate that such a hybrid presentation medium can combine the advantages of existing systems while mitigating their drawbacks. Overall, we show how a heuristic design approach helped us challenge entrenched physical metaphors to create a fundamentally digital presentation medium with the potential to transform the activities of authoring, delivering, and viewing presentations.",
        "tags": {
            "collaborators": [
                "Edge",
                "Yang",
                "Kotturi",
                "Wang",
                "Feng",
                "Lee"
            ],
            "subject": [
                "UI",
                "Presentation",
                "Information"
            ],
            "year": [
                "2016"
            ],
            "publication": [
                "TOCHI"
            ]
        }
    },
    {
        "id": 49,
        "number": "3",
        "primary": "UI-Information",
        "publisher": "Rinton Press",
        "img": "researchImages/instrumenting.png",
        "bibEntry": "<div class=\"csl-entry\">Edmonds, A., White, R. W., Morris, D., and Drucker, S. M. (2007). Instrumenting the dynamic web. <i>Journal of Web Engineering</i>, <i>6</i>(3), 243.</div>",
        "volume": "6",
        "title": "Instrumenting the dynamic web",
        "author": [
            "Edmonds, Andy",
            "White, Ryen W",
            "Morris, Dan",
            "Drucker, Steven M"
        ],
        "ID": "edmonds2007instrumenting",
        "tags": {
            "collaborators": [
                "Edmonds",
                "White",
                "Morris"
            ],
            "subject": [
                "Information"
            ],
            "year": [
                "2007"
            ],
            "publication": [
                "JWE"
            ]
        },
        "year": "2007",
        "ENTRYTYPE": "article",
        "journal": "Journal of Web Engineering",
        "pages": "243",
        "caption": "Dynamic Web"
    },
    {
        "publisher": "ACM",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., DeLine, R., Czerwinski, M., and Drucker, S. (2012). Interactions with big data analytics. <i>Interactions</i>, <i>19</i>(3), 50â\u0080\u009359.</div>",
        "author": [
            "Fisher, Danyel",
            "DeLine, Rob",
            "Czerwinski, Mary",
            "Drucker, Steven"
        ],
        "thumb": "thumbnail/bigdata.png",
        "number": "3",
        "abstract": "Increasingly in the 21st century,  our daily lives leave behind a  detailed digital record: our shifting  thoughts and opinions shared on  Twitter, our social relationships, our purchasing habits, our information seeking, our photos and videos - even the movements of our bodies and cars",
        "id": 27,
        "tags": {
            "collaborators": [
                "Fisher",
                "DeLine",
                "Czerwinski"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Big Data"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "Interactions"
            ]
        },
        "pdf": "papers/inteactions_big_data.pdf",
        "reference": "Danyel Fisher, Rob DeLine, Mary Czerwinski, and Steven Drucker, Interactions with Big Data Analytics, in ACM Interactions, ACM, May 2012",
        "text": "inteactions_big_data.txt",
        "volume": "19",
        "title": "Interactions with big data analytics",
        "img": "researchImages/bigdata.png",
        "video": "http://research.microsoft.com/apps/pubs/default.aspx?id=217732",
        "primary": "Visualization",
        "pages": "50--59",
        "year": "2012",
        "ENTRYTYPE": "article",
        "ID": "fisher2012interactions",
        "journal": "interactions",
        "caption": "Big Data Interaction"
    },
    {
        "link": "https://www.microsoft.com/en-us/research/publication/understanding-breadth-event-space-learning-logan/",
        "booktitle": "Proceedings of the Event Event: Temporal & Sequential Event Analysis. IEEE VIS 2016 Workshop",
        "id": 0,
        "pdf": "papers/EVENT_2016_paper_17.pdf",
        "reference": "Fisher, Drucker, DeLine, Czerwinsiki, Understanding the Breadth of the Event Space, Learnings from Logan",
        "month": "October",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., DeLine, R., Czerwinski, M., and Drucker, S. (2016). <i>Understanding the Breadth of the Event Space: Learning from Logan</i>.</div>",
        "text": "EVENT_2016_paper_17.txt",
        "title": "Understanding the Breadth of the Event Space: Learning from Logan",
        "img": "researchImages/logan.png",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Fisher",
                "DeLine",
                "Czerwinski"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Sequences"
            ],
            "year": [
                "2016"
            ],
            "publication": [
                "Infovis"
            ]
        },
        "year": "2016",
        "ENTRYTYPE": "techreport",
        "ID": "understanding-breadth-event-space-learning-logan",
        "caption": "Logan",
        "author": [
            "Fisher, Danyel",
            "DeLine, Rob",
            "Czerwinski, Mary",
            "Drucker, Steven"
        ],
        "abstract": "Event processing, analysis, and visualization are increasingly important, and common, problems as telemetry and log recording become ubiquitous. We are still learning about the space of ways to both query and see the results of sequential queries against event-logged data. In this paper, we discuss our Logan event exploration prototype, which is based on regular-expression queries and result histograms; we then discuss the many factors that vary between tools, domains, and datasets ? tradeoffs of factors such as session size, cardinality of events, and the presence of event arguments.",
        "thumb": "thumbnail/logan.png"
    },
    {
        "thumb": "thumbnail/bi.png",
        "id": 7,
        "img": "researchImages/BI.png",
        "number": "5",
        "primary": "UI-Information",
        "publisher": "IEEE",
        "pdf": "papers/mcg2014050022.pdf",
        "reference": "Fisher, Drucker. Editor's Introduction to Special Issue on Business Intelligence, IEEE CG&A, 2015",
        "text": "BIEditorIntro.txt",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., Drucker, S., and Czerwinski, M. (2014). Business Intelligence Analytics [Guest editorsâ\u0080\u0099 introduction]. <i>IEEE Computer Graphics and Applications</i>, <i>34</i>(5), 22â\u0080\u009324.</div>",
        "volume": "34",
        "title": "Business Intelligence Analytics [Guest editors' introduction]",
        "author": [
            "Fisher, Danyel",
            "Drucker, Steven",
            "Czerwinski, Mary"
        ],
        "ID": "fisher2014business",
        "pages": "22--24",
        "year": "2014",
        "ENTRYTYPE": "article",
        "journal": "IEEE computer graphics and applications",
        "caption": "Bi Analytics",
        "abstract": "Businesses are increasingly monitoring and tracking data about what it takes to keep themselves running. They collect and maintain increasingly available data, such as ? transaction and sales data stored in data warehouses, ? server log files tracking visitors, ? data from sensors tracking delays on factory floors, ? IT data logs, and ? data on their competitors and industrial sectors. Data-driven decision making?orienting business decisions around data?drives major IT initiatives across all business sectors",
        "tags": {
            "collaborators": [
                "Fisher",
                "Drucker"
            ],
            "subject": [
                "Information",
                "Visualization"
            ],
            "year": [
                "2015"
            ],
            "publication": [
                "CGA"
            ]
        }
    },
    {
        "id": 29,
        "pdf": "papers/VisAVis.pdf",
        "reference": "Danyel Fisher, Steven Drucker, Roland Fernandez, and Xiaoji Chen, Vis-a-vis: A Visual Language for Spreadsheet Visualizations, no. MSR-TR-2011-142, June 2011",
        "img": "researchImages/visavis.png",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., Drucker, S., Fernandez, R., and Chen, X. (2011). <i>Vis-a-vis: A Visual Language for Spreadsheet Visualizations</i>. Technical Report MSR-TR-2011-142, Microsoft Research.</div>",
        
        "text": "VisAVis.txt",
        "institution": "Technical Report MSR-TR-2011-142, Microsoft Research",
        "title": "Vis-a-vis: A Visual Language for Spreadsheet Visualizations",
        "author": [
            "Fisher, Danyel",
            "Drucker, Steven",
            "Fernandez, Roland",
            "Chen, Xiaoji"
        ],
        "video": "",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Fisher",
                "Fernandez",
                "Chen"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Design"
            ],
            "year": [
                "2011"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "year": "2011",
        "ENTRYTYPE": "techreport",
        "ID": "fisher2011vis",
        "caption": "Vis-a-vis",
        "abstract": "Finding ways for information workers to easily create and modify visualizations that display their own data has been a long time goal within the visualization community. We describe Vis-a-vis, a declarative language for defining and extending visualizations directly within spreadsheets. Vis-a-vis allows users to directly bind data and formula to the visual attributes of an extensible set of visualization primitives. The visualizations that Vis-a-vis creates can be shared and modified easily, allowing users to modify existing visualizations. This approach allows users to select visualizations from a gallery, to customize them easily, or to create novel visualizations. The approach leverages familiar formulas and data from spreadsheets. We prototype a system that uses this language, and use it to build a number of standard and custom visualizations, and gather formative feedback from a small user study.",
        "thumb": "thumbnail/visavis.png"
    },
    {
        "publisher": "IEEE",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., Drucker, S., Fernandez, R., and Ruble, S. (2010). Visualizations everywhere: A multiplatform infrastructure for linked visualizations. <i>IEEE Transactions on Visualization and Computer Graphics</i>, <i>16</i>(6), 1157â\u0080\u00931163.</div>",
        "author": [
            "Fisher, Danyel",
            "Drucker, Steven",
            "Fernandez, Roland",
            "Ruble, Scott"
        ],
        "thumb": "thumbnail/webcharts.png",
        "number": "6",
        "abstract": "In order to use new visualizations, most toolkits require application developers to rebuild their applications and distribute new versions to users. The WebCharts Framework take a different approach by hosting Javascript from within an application and providing a standard data and events interchange.. In this way, applications can be extended dynamically, with a wide variety of visualizations. We discuss the benefits of this architectural approach, contrast it to existing techniques, and give a variety of examples and extensions of the basic system.",
        "id": 34,
        "tags": {
            "collaborators": [
                "Fisher",
                "Fernandez",
                "Ruble"
            ],
            "subject": [
                "UI",
                "Visualization"
            ],
            "year": [
                "2010"
            ],
            "publication": [
                "Infovis"
            ]
        },
        "pdf": "papers/webcharts.pdf",
        "reference": "Danyel Fisher, Steven Drucker, Roland Fernandez, and Scott Ruble, Visualizations Everywhere: A Multiplatform Infrastructure for Linked Visualizations, in Transactions on Visualization and Computer Graphics, IEEE, Salt Lake City, UT, November 2010",
        "text": "webcharts.txt",
        "volume": "16",
        "title": "Visualizations everywhere: A multiplatform infrastructure for linked visualizations",
        "img": "researchImages/webcharts.png",
        "video": "",
        "primary": "Visualization",
        "pages": "1157--1163",
        "year": "2010",
        "ENTRYTYPE": "article",
        "ID": "fisher2010visualizations",
        "journal": "IEEE Transactions on Visualization and Computer Graphics",
        "caption": "WebCharts"
    },
    {
        "thumb": "thumbnail/incrvis.png",
        "id": 17,
        "img": "researchImages/incrvis.png",
        "number": "4",
        "primary": "Visualization",
        "pdf": "papers/Exploratory_CGA.pdf",
        "reference": "Danyel Fisher, Steven M. Drucker, and A. Christian K??nig, Exploratory Visualization Involving Incremental, Approximate Database Queries and Uncertainty, in IEEE Computer Graphics and Applications, IEEE, July 2012",
        "text": "Exploratory_CGA.txt",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., Drucker, S. M., and KÃ¶nig, A. C. (2012). Exploratory visualization involving incremental, approximate database queries and uncertainty. <i>IEEE Computer Graphics and Applications</i>, <i>32</i>(4), 55â\u0080\u009362.</div>",
        "volume": "32",
        "title": "Exploratory visualization involving incremental, approximate database queries and uncertainty",
        "author": [
            "Fisher, Danyel",
            "Drucker, Steven M",
            "K{\\\"o}nig, Arnd Christian"
        ],
        "video": "",
        "ID": "fisher2012exploratory",
        "pages": "55--62",
        "year": "2012",
        "ENTRYTYPE": "article",
        "journal": "IEEE computer graphics and applications",
        "caption": "IncrementalVis",
        "abstract": "Large datasets can mean slow queries, for which users must wait. Incremental visualization systems can give faster results at a cost of accuracy. This article asked analysts to use one and report on their results. Their feedback provides suggestions for alternative visualizations to represent a query still in progress.",
        "tags": {
            "collaborators": [
                "Fisher",
                "Konig"
            ],
            "subject": [
                "Visualization"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "CGA"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
        "id": 26,
        "organization": "ACM",
        "pdf": "papers/chi2012_interactive.pdf",
        "reference": "Danyel Fisher, Igor Popov, Steven M. Drucker, and mc schraefel, Trust Me, I'm Partially Right: Incremental Visualization Lets Analysts Explore Large Datasets Faster, in Proceedings of the 2012 Conference on Human Factors in Computing Systems (CHI 2012), ACM Conference on Human Factors in Computing Systems, 5 May 2012",
        "img": "researchImages/incvis.png",
        "bibEntry": "<div class=\"csl-entry\">Fisher, D., Popov, I., Drucker, S., and schraefel,  m. c. (2012). Trust me, Iâ\u0080\u0099m partially right: incremental visualization lets analysts explore large datasets faster. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 1673â\u0080\u00931682). ACM.</div>",
        "text": "chi2012_interactive.txt",
        "title": "Trust me, I'm partially right: incremental visualization lets analysts explore large datasets faster",
        "author": [
            "Fisher, Danyel",
            "Popov, Igor",
            "Drucker, Steven",
            "schraefel, m.c."
        ],
        "video": "",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Fisher",
                "Popov",
                "schraefel"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Big Data"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2012",
        "ENTRYTYPE": "inproceedings",
        "ID": "fisher2012trust",
        "caption": "Incremental Visualization",
        "pages": "1673--1682",
        "abstract": "Queries over large scale (petabyte) data bases often mean waiting overnight for a result to come back. Scale costs  time. Such time also means that potential avenues of  exploration are ignored because the costs are perceived to  be too high to run or even propose them. With  sampleAction we have explored whether interaction  techniques to present query results running over only  incremental samples can be presented as sufficiently  trustworthy for analysts both to make closer to real time  decisions about their queries and to be more exploratory in  their questions of the data. Our work with three teams of  analysts suggests that we can indeed accelerate and open up  the query process with such incremental visualizations.",
        "thumb": "thumbnail/incvis.png"
    },
    {
        "id": 39,
        "tags": {
            "collaborators": [
                "Flake",
                "Brewer"
            ],
            "subject": [
                "UI",
                "Information",
                "Web"
            ],
            "year": [
                "2009"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "type": "software",
        "reference": "http://research.microsoft.com/en-us/downloads/dd4a479f-92d6-496f-867d-666c87fbaada/default.aspx",
        "img": "researchImages/pivot.png",
        "bibEntry": "<div class=\"csl-entry\">Flake, G., Farouki, K., Brewer, B., and Drucker, S. M. (2009). <i>LiveLabs Pivot Viewer</i>.</div>",
        "title": "LiveLabs Pivot Viewer",
        "author": [
            "Flake, Gary",
            "Farouki, Karim",
            "Brewer, Brett",
            "Drucker, Steven M"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/ThumbtackFinal/ThumbtackIntroductionVideo.wmv",
        "ID": "pivotviewer",
        "caption": "LiveLabs Pivot Viewer",
        "year": "2009",
        "ENTRYTYPE": "misc",
        "primary": "Visualization",
        "abstract": "Pivot is an experimental application for exploring large data sets with smooth visual interactions. The application originally was released by Microsoft Live Labs in October 2009, and it is being re-released by Microsoft Research to enable the research community to continue to use it for experiments. If you have Internet Explorer 9 installed, disable GPU rendering in Internet Explorer to enable Pivot to work correctly. The Pivot collection home page points to content no longer available, but Pivot still can be used for viewing user-created local or web collections. This standalone version of Pivot is unsupported and might stop functioning properly in the future.",
        "thumb": "thumbnail/pivot.png"
    },
    {
        "thumb": "thumbnail/sismall.gif",
        "id": 91,
        "type": "animation",
        "reference": "Galyean, T. & Drucker, S.M. Self Inflated Animation, 1992",
        "img": "researchImages/sismall.gif",
        "bibEntry": "<div class=\"csl-entry\">Galyean, T., and Drucker, S. (1992). <i>Self Inflated</i>.</div>",
        "title": "Self Inflated",
        "author": [
            "Galyean, Tinsley",
            "Drucker, Steven"
        ],
        "ID": "selfinflated",
        "tags": {
            "collaborators": [
                "Galyean"
            ],
            "subject": [
                "Graphics"
            ],
            "year": [
                "1992"
            ],
            "publication": [
                "Movie"
            ]
        },
        "year": "1992",
        "ENTRYTYPE": "misc",
        "primary": "Graphics",
        "abstract": "A video about a republican challenger in 1992. Shown at the Democratic National Convention.",
        "caption": "Self Inflated"
    },
    {
        "booktitle": "Proceedings of the tenth ACM international conference on Multimedia",
        "tags": {
            "collaborators": [
                "Gemmell",
                "Bell",
                "Lueder",
                "Wong"
            ],
            "subject": [
                "UI",
                "Media",
                "Search",
                "Information"
            ],
            "year": [
                "2002"
            ],
            "publication": [
                "Multimedia"
            ]
        },
        "id": 71,
        "organization": "ACM",
        "reference": "Gemmell, J., Bell, G., Lueder, R., Drucker, S., & Wong, C. (2002, December). MyLifeBits: fulfilling the Memex vision. In Proceedings of the tenth ACM international conference on Multimedia (pp. 235-238). ACM.",
        "img": "researchImages/memex1.png",
        "bibEntry": "<div class=\"csl-entry\">Gemmell, J., Bell, G., Lueder, R., Drucker, S., and Wong, C. (2002). MyLifeBits: fulfilling the Memex vision. In <i>Proceedings of the tenth ACM international conference on Multimedia</i> (pp. 235â\u0080\u0093238). ACM.</div>",
        "title": "MyLifeBits: fulfilling the Memex vision",
        "author": [
            "Gemmell, Jim",
            "Bell, Gordon",
            "Lueder, Roger",
            "Drucker, Steven",
            "Wong, Curtis"
        ],
        "ID": "gemmell2002mylifebits",
        "thumb": "thumbnail/memex1.png",
        "year": "2002",
        "ENTRYTYPE": "inproceedings",
        "primary": "UI-Information",
        "pages": "235--238",
        "abstract": "MyLifeBits is a project to fulfill the Memex vision first posited by Vannevar Bush in 1945. It is a system for storing all of one???s digital media, including documents, images, sounds, and videos. It is built on four principles: (1) collections and search must replace hierarchy for organization (2) many visualizations should be supported (3) annotations are critical to non-text media and must be made easy, and (4) authoring should be via transclusion.",
        "caption": "Memex Vision"
    },
    {
        "thumb": "thumbnail/foveated.png",
        "id": 25,
        "img": "researchImages/foveated.png",
        "number": "6",
        "primary": "Graphics",
        "publisher": "ACM",
        "pdf": "papers/userstudy07.pdf",
        "reference": "Foveated 3D Graphics, Brian Guenter, Mark Finch, Steven Drucker, Desney Tan, John Snyder ACM SIGGRAPH Asia 2012.",
        "text": "foveateduserstudy07.txt",
        "bibEntry": "<div class=\"csl-entry\">Guenter, B., Finch, M., Drucker, S., Tan, D., and Snyder, J. (2012). Foveated 3D graphics. <i>ACM Transactions on Graphics (TOG)</i>, <i>31</i>(6), 164.</div>",
        "volume": "31",
        "title": "Foveated 3D graphics",
        "author": [
            "Guenter, Brian",
            "Finch, Mark",
            "Drucker, Steven",
            "Tan, Desney",
            "Snyder, John"
        ],
        "ID": "guenter2012foveated",
        "pages": "164",
        "year": "2012",
        "ENTRYTYPE": "article",
        "journal": "ACM Transactions on Graphics (TOG)",
        "caption": "Foveated",
        "abstract": "We present a data-driven method to predict the performance of an image completion method. Our image completion method is based on the state-of-the-art non-parametric framework of Wexler et al. [2007]. It uses automatically derived search space constraints for patch source regions, which lead to improved texture synthesis and semantically more plausible results. These constraints also facilitate performance prediction by allowing us to correlate output quality against features of possible regions used for synthesis. We use our algorithm to first crop and then complete stitched panoramas. Our predictive ability is used to find an optimal crop shape before the completion is computed, potentially saving significant amounts of computation. Our optimized crop includes as much of the original panorama as possible while avoiding regions that can be less successfully filled in. Our predictor can also be applied for hole filling in the interior of images. In addition to extensive comparative results, we ran several user studies validating our predictive feature, good relative quality of our results against those of other state-of-the-art algorithms, and our automatic cropping algorithm.",
        "tags": {
            "collaborators": [
                "Guenter",
                "Finch",
                "Tan",
                "Snyder"
            ],
            "subject": [
                "Graphics",
                "Photos"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "SIGGRAPHAsia"
            ]
        }
    },
    {
        "booktitle": "2007 IEEE Conference on Computer Vision and Pattern Recognition",
        "id": 48,
        "organization": "IEEE",
        "pdf": "papers/CVPR07a.pdf",
        "reference": "Gang Hua, Paul Viola, and Steven Drucker, \"Face Recognition using Discriminatively Trained Orthogonal Rank One Tensor Projections\", in Proc.?IEEE Conf. on Computer Vision and Pattern Recognition (CVPR'2007),?Minneaplois, MN, 2007.",
        "img": "researchImages/facerec.png",
        "bibEntry": "<div class=\"csl-entry\">Hua, G., Viola, P. A., and Drucker, S. M. (2007). Face recognition using discriminatively trained orthogonal rank one tensor projections. In <i>2007 IEEE Conference on Computer Vision and Pattern Recognition</i> (pp. 1â\u0080\u00938). IEEE.</div>",
        "text": "CVPR07a.txt",
        "title": "Face recognition using discriminatively trained orthogonal rank one tensor projections",
        "author": [
            "Hua, Gang",
            "Viola, Paul A",
            "Drucker, Steven M"
        ],
        "primary": "Machine Learning",
        "tags": {
            "collaborators": [
                "Hua",
                "Viola"
            ],
            "subject": [
                "Machine Learning"
            ],
            "year": [
                "2007"
            ],
            "publication": [
                "CVPR"
            ]
        },
        "year": "2007",
        "ENTRYTYPE": "inproceedings",
        "ID": "hua2007face",
        "caption": "FaceRec",
        "pages": "1--8",
        "abstract": "We propose a method for face recognition based on a discriminative linear projection. In this formulation images are treated as tensors, rather than the more conventional vector of pixels. Projections are pursued sequentially and take the form of a rank one tensor, i.e., a tensor which is the outer product of a set of vectors. A novel and effective technique is proposed to ensure that the rank one tensor projections are orthogonal to one another. These constraints on the tensor projections provide a strong inductive bias and result in better generalization on small training sets. Our work is related to spectrum methods, which achieve orthogonal rank one projections by pursuing consecutive projections in the complement space of previous projections. Although this may be meaningful for applications such as reconstruction, it is less meaningful for pursuing discriminant projections. Our new scheme iteratively solves an eigenvalue problem with orthogonality constraints on one dimension, and solves unconstrained eigenvalue problems on the other dimensions. Experiments demonstrate that on small and medium sized face recognition datasets, this approach outperforms previous embedding methods. On large face datasets this approach achieves results comparable with the best, often using fewer discriminant projections.",
        "thumb": "thumbnail/facerec.png"
    },
    {
        "publisher": "IEEE",
        "bibEntry": "<div class=\"csl-entry\">Hullman, J., Drucker, S., Riche, N. H., Lee, B., Fisher, D., and Adar, E. (2013). A deeper understanding of sequence in narrative visualization. <i>IEEE Transactions on Visualization and Computer Graphics</i>, <i>19</i>(12), 2406â\u0080\u00932415.</div>",
        "author": [
            "Hullman, Jessica",
            "Drucker, Steven",
            "Riche, Nathalie Henry",
            "Lee, Bongshin",
            "Fisher, Danyel",
            "Adar, Eytan"
        ],
        "thumb": "thumbnail/narratives.png",
        "number": "12",
        "abstract": "Conveying a narrative with visualizations often requires choosing an order in which to present visualizations. While evidence exists that narrative sequencing in traditional stories can affect comprehension and memory, little is known about how sequencing choices affect narrative visualization. We consider the forms and reactions to sequencing in narrative visualization presentations to provide a deeper understanding with a focus on linear, slideshow-style presentations. We conduct a qualitative analysis of 42 professional narrative visualizations to gain empirical knowledge on the forms that structure and sequence take. Based on the results of this study we propose a graph-driven approach for automatically identifying effective sequences in a set of visualizations to be presented linearly. Our approach identifies possible transitions in a visualization set and prioritizes local (visualization-to-visualization) transitions based on an objective function that minimizes the cost of transitions from the audience perspective. We conduct two studies to validate this function. We also expand the approach with additional knowledge of user preferences for different types of local transitions and the effects of global sequencing strategies on memory, preference, and comprehension. Our results include a relative ranking of types of visualization transitions by the audience perspective and support or memory and subjective rating benefits of visualization sequences that use parallelism as a structural device. We discuss how these insights can guide the design of narrative visualization and systems that support optimization of visualization sequence.",
        "id": 16,
        "tags": {
            "collaborators": [
                "Hullman",
                "Riche",
                "Fisher",
                "Adar",
                "Lee"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Presentation"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "Infovis"
            ]
        },
        "pdf": "papers/narrative.pdf",
        "reference": "Hullman, J., Drucker, S., Henry Riche, N., Lee, B., Fisher, D., & Adar, E. (2013). A deeper understanding of sequence in narrative visualization. Visualization and Computer Graphics, IEEE Transactions on, 19(12), 2406-2415.",
        "text": "story_sequence_infovis_final.txt",
        "volume": "19",
        "title": "A deeper understanding of sequence in narrative visualization",
        "img": "researchImages/narratives.png",
        "video": "http://research.microsoft.com/apps/video/default.aspx?id=188294",
        "primary": "Visualization",
        "pages": "2406--2415",
        "year": "2013",
        "ENTRYTYPE": "article",
        "ID": "hullman2013deeper",
        "journal": "IEEE transactions on visualization and computer graphics",
        "caption": "Narrative"
    },
    {
        "booktitle": "CHI'05 extended abstracts on Human factors in computing systems",
        "id": 60,
        "organization": "ACM",
        "pdf": "papers/CHI2005%20-%20Time%20Quilt%20short.pdf",
        "reference": "Huynh, D., Drucker, S., Baudisch, P., Wong, C. Time Quilt: Scaling up Zoomable Photo Browsers for Large, Unstructured Photo Collections. CHI 2005. Portland, OR. Apr. 2005",
        "img": "researchImages/tq.png",
        "bibEntry": "<div class=\"csl-entry\">Huynh, D. F., Drucker, S. M., Baudisch, P., and Wong, C. (2005). Time quilt: scaling up zoomable photo browsers for large, unstructured photo collections. In <i>CHIâ\u0080\u009905 extended abstracts on Human factors in computing systems</i> (pp. 1937â\u0080\u00931940). ACM.</div>",
        "text": "Time Quilt Long.txt",
        "title": "Time quilt: scaling up zoomable photo browsers for large, unstructured photo collections",
        "author": [
            "Huynh, David F",
            "Drucker, Steven M",
            "Baudisch, Patrick",
            "Wong, Curtis"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/timequilt.wmv",
        "primary": "Photos",
        "tags": {
            "collaborators": [
                "Huynh",
                "Baudisch",
                "Wong"
            ],
            "subject": [
                "UI",
                "Photos",
                "Visualization"
            ],
            "year": [
                "2005"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2005",
        "ENTRYTYPE": "inproceedings",
        "ID": "huynh2005time",
        "caption": "TimeQuilt",
        "pages": "1937--1940",
        "abstract": "In the absence of manual organization of large digital photo collections, the photos' visual content and creation dates can help support time-based visual search tasks. Current zoomable photo browsers are designed to support visual searches by maximizing screenspace usage. However, their space-filling layouts fail to convey temporal order effectively. We propose a novel layout called time quilt that trades off screenspace usage for better presentation of temporal order. In an experimental comparison of space-filling, linear timeline, and time quilt layouts, participants carried out the task of finding photos in their personal photo collections averaging 4,000 items. They performed 45% faster on time quilt. Furthermore, while current zoomable photo browsers are designed for visual searches, this support does not scale to thousands of photos: individual thumbnails become less informative as they grow smaller. We found a subjective preference for the use of representative photos to provide an overview for visual searches in place of the diminishing thumbnails.",
        "thumb": "thumbnail/tq.png"
    },
    {
        "link": "https://www.microsoft.com/en-us/research/publication/imageflow-streaming-image-search/",
        "id": 33,
        "img": "researchImages/imageflow.png",
        "bibEntry": "<div class=\"csl-entry\">Jampani, V., Ramos, G., and Drucker, S. (2010). <i>ImageFlow: Streaming Image Search</i>. Microsoft Research.</div>",
        "month": "November",
        "institution": "Microsoft Research",
        "title": "ImageFlow: Streaming Image Search",
        "author": [
            "Jampani, Varun",
            "Ramos, Gonzalo",
            "Drucker, Steven"
        ],
        "ID": "imageflow-streaming-image-search",
        "caption": "Imageflow",
        "year": "2010",
        "ENTRYTYPE": "techreport",
        "primary": "UI-Information",
        "abstract": "{Traditional grid and list representations of image search results are the dominant interaction paradigms that users face on a daily basis, yet it is unclear that such paradigms are well-suited for experiences where the user's task is to browse images for leisure, to discover new information or to seek particular images to represent ideas. We introduce ImageFlow, a novel image search user interface that explores a different alternative to the traditional presentation of image search results. ImageFlow presents image results on a canvas where we map semantic features (e.g., relevance, related queries) to the canvas' spatial dimensions (e.g., x, y, z) in a way that allows for several levels of engagement Ã\u0083\u0083Ã\u0082Â¢Ã\u0083\u0082\u0080Ã\u0083\u0082\u0093 from passively viewing a stream of images, to seamlessly navigating through the semantic space and actively collecting images for sharing and reuse. We have implemented our system as a fully functioning prototype, and we report on promising, preliminary usage results.},",
        "tags": {
            "collaborators": [
                "Ramos",
                "Jampani"
            ],
            "subject": [
                "Media",
                "UI",
                "Web",
                "Visualization"
            ],
            "year": [
                "2010"
            ],
            "publication": [
                "TechReport"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the SIGCHI conference on Human Factors in Computing Systems",
        "id": 78,
        "organization": "ACM",
        "pdf": "papers/chidilemmas.pdf",
        "reference": "Jensen, C., Farnham, S., Drucker, S., & Kollock, P. The Effect of Communication Modality on Cooperation in Online Environments. In Proceedings of CHI 2000, The Hague, Netherlands March 2000.",
        "img": "researchImages/socdilemma.gif",
        "bibEntry": "<div class=\"csl-entry\">Jensen, C., Farnham, S. D., Drucker, S. M., and Kollock, P. (2000). The effect of communication modality on cooperation in online environments. In <i>Proceedings of the SIGCHI conference on Human Factors in Computing Systems</i> (pp. 470â\u0080\u0093477). ACM.</div>",
        "text": "chidilemmas.txt",
        "title": "The effect of communication modality on cooperation in online environments",
        "author": [
            "Jensen, Carlos",
            "Farnham, Shelly D",
            "Drucker, Steven M",
            "Kollock, Peter"
        ],
        "primary": "Social",
        "tags": {
            "collaborators": [
                "Jensen",
                "Farnham",
                "Kollock"
            ],
            "subject": [
                "Social"
            ],
            "year": [
                "2000"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2000",
        "ENTRYTYPE": "inproceedings",
        "ID": "jensen2000effect",
        "caption": "Social Dilemma Testing",
        "pages": "470--477",
        "abstract": "One of the most robust findings in the sociological literature is the positive effect of communication on cooperation and trust.  When individuals are able to communicate, cooperation increases significantly.  How does the choice of communication modality influence this effect?  We adapt the social dilemma research paradigm to quantitatively analyze different modes of communication. Using this method, we compare four forms of communication: no communication, text-chat, text-to-speech, and voice.  We found statistically significant differences between the various forms of communication, with the voice condition resulting in the highest levels of cooperation.  Our results highlight the importance of striving towards the use of more advanced forms of communication in online environments, especially where trust and cooperation are essential.  In addition, our research demonstrates the applicability of the social dilemma paradigm in testing the extent to which communication modalities promote the development of trust and cooperation.",
        "thumb": "thumbnail/socdilemma.gif"
    },
    {
        "booktitle": "Proceedings of the 25th annual ACM symposium on User interface software and technology",
        "id": 24,
        "organization": "ACM",
        "pdf": "papers/paper_uist_final.pdf",
        "reference": "Joshi, N., Metha, S., Drucker, S., Stollnitz, E., Hoppe, H., Uyttendaele, M., and Cohen, M. Cliplets: Juxtaposing Still and Dynamic Imagery. ACM UIST 2012.",
        "img": "researchImages/cliplets.png",
        "bibEntry": "<div class=\"csl-entry\">Joshi, N., Mehta, S., Drucker, S., Stollnitz, E., Hoppe, H., Uyttendaele, M., and Cohen, M. (2012). Cliplets: juxtaposing still and dynamic imagery. In <i>Proceedings of the 25th annual ACM symposium on User interface software and technology</i> (pp. 251â\u0080\u0093260). ACM.</div>",
        "text": "cliplets.txt",
        "title": "Cliplets: juxtaposing still and dynamic imagery",
        "author": [
            "Joshi, Neel",
            "Mehta, Sisil",
            "Drucker, Steven",
            "Stollnitz, Eric",
            "Hoppe, Hugues",
            "Uyttendaele, Matt",
            "Cohen, Michael"
        ],
        "primary": "Photos",
        "tags": {
            "collaborators": [
                "Joshi",
                "Metha",
                "Stollnitz",
                "Cohen",
                "Hoppe",
                "Uyttendaele"
            ],
            "subject": [
                "UI",
                "Graphics",
                "Photos"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "2012",
        "ENTRYTYPE": "inproceedings",
        "ID": "joshi2012cliplets",
        "caption": "Cliplets",
        "pages": "251--260",
        "abstract": "We explore creating cliplets, a form of visual media that juxtaposes still image and video segments, both spatially and temporally, to expressively abstract a moment. Much as in cinemagraphs, the tension between static and dynamic elements in a cliplet reinforces both aspects, strongly focusing the viewer's attention. Creating this type of imagery is challenging without professional tools and training. We develop a set of idioms, essentially spatiotemporal mappings, that characterize cliplet elements, and use these idioms in an interactive system to quickly compose a cliplet from ordinary handheld video. One difficulty is to avoid artifacts in the cliplet composition without resorting to extensive manual input. We address this with automatic alignment, looping optimization and feathering, simultaneous matting and compositing, and Laplacian blending. A key user-interface challenge is to provide affordances to define the parameters of the mappings from input time to output time while maintaining a focus on the cliplet being created. We demonstrate the creation of a variety of cliplet types. We also report on informal feedback as well as a more structured survey of users.",
        "thumb": "thumbnail/cliplets.png"
    },
    {
        "pages": "301--310",
        "booktitle": "Computer Graphics Forum",
        "number": "3",
        "id": 6,
        "reference": "Kairam, S., N.H. Riche, S. Drucker, R. Fernandeaz, J. Heer, Refinery: Visual Exploration of Large, Heterogeneous Networks through Associative Browsing, To Appear Eurographics Conference on Visualization, (EuroVis) 2015.",
        "img": "researchImages/refinery.png",
        "bibEntry": "<div class=\"csl-entry\">Kairam, S., Riche, N. H., Drucker, S., Fernandez, R., and Heer, J. (2015). Refinery: Visual exploration of large, heterogeneous networks through associative browsing. In <i>Computer Graphics Forum</i> (Vol. 34, pp. 301â\u0080\u0093310).</div>",
        "text": "refinery-eurovis15-fin.txt",
        "title": "Refinery: Visual exploration of large, heterogeneous networks through associative browsing",
        "author": [
            "Kairam, Sanjay",
            "Riche, Nathalie Henry",
            "Drucker, Steven",
            "Fernandez, Roland",
            "Heer, Jeffrey"
        ],
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Kairam",
                "Riche",
                "Fernandez",
                "Heer"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Network"
            ],
            "year": [
                "2015"
            ],
            "publication": [
                "EuroVis"
            ]
        },
        "year": "2015",
        "ENTRYTYPE": "inproceedings",
        "ID": "kairam2015refinery",
        "caption": "Refinery",
        "volume": "34",
        "abstract": "Browsing is a fundamental aspect of exploratory information-seeking. Associative browsing encompasses a common and intuitive set of exploratory strategies in which users step iteratively from familiar to novel pieces of information. In this paper, we consider associative browsing as a strategy for bottom-up exploration of large, heterogeneous networks. We present Refinery, an interactive visualization system informed by guidelines drawn from examination of several areas of literature related to exploratory information-seeking. These guidelines motivate Refinery???s query model, which allows users to simply and expressively construct queries using heterogeneous sets of nodes. The system ranks and returns associated content using a fast, random-walk based algorithm, visualizing results and connections among them to provide explanatory context, facilitate serendipitous discovery, and stimulate continued exploration. A study of 12 academic researchers using Refinery to browse publication data related to areas of study demonstrates how the system complements existing tools in supporting discovery.",
        "thumb": "thumbnail/refinery.png"
    },
    {
        "booktitle": "CHI'13 Extended Abstracts on Human Factors in Computing Systems",
        "id": 15,
        "organization": "ACM",
        "img": "researchImages/creativity.png",
        "bibEntry": "<div class=\"csl-entry\">Kerne, A., Webb, A. M., Latulipe, C., Carroll, E., Drucker, S. M., Candy, L., and HÃ¶Ã¶k, K. (2013). Evaluation methods for creativity support environments. In <i>CHIâ\u0080\u009913 Extended Abstracts on Human Factors in Computing Systems</i> (pp. 3295â\u0080\u00933298). ACM.</div>",
        "title": "Evaluation methods for creativity support environments",
        "author": [
            "Kerne, Andruid",
            "Webb, Andrew M",
            "Latulipe, Celine",
            "Carroll, Erin",
            "Drucker, Steven M",
            "Candy, Linda",
            "H{\\\"o}{\\\"o}k, Kristina"
        ],
        "ID": "kerne2013evaluation",
        "tags": {
            "collaborators": [
                "Kerne",
                "Webb",
                "Latulipe",
                "Carroll",
                "Candy"
            ],
            "subject": [
                "UI"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2013",
        "ENTRYTYPE": "inproceedings",
        "primary": "UI-Information",
        "pages": "3295--3298",
        "caption": "Creativity Support"
    },
    {
        "publisher": "ACM",
        "bibEntry": "<div class=\"csl-entry\">Kopf, J., Kienzle, W., Drucker, S., and Kang, S. B. (2012). Quality prediction for image completion. <i>ACM Transactions on Graphics (TOG)</i>, <i>31</i>(6), 131.</div>",
        "author": [
            "Kopf, Johannes",
            "Kienzle, Wolf",
            "Drucker, Steven",
            "Kang, Sing Bing"
        ],
        "thumb": "thumbnail/completion.png",
        "number": "6",
        "abstract": "We present a data-driven method to predict the performance of an image completion method. Our image completion method is based on the state-of-the-art non-parametric framework of Wexler et al. [2007]. It uses automatically derived search space constraints for patch source regions, which lead to improved texture synthesis and semantically more plausible results. These constraints also facilitate performance prediction by allowing us to correlate output quality against features of possible regions used for synthesis. We use our algorithm to first crop and then complete stitched panoramas. Our predictive ability is used to find an optimal crop shape before the completion is computed, potentially saving significant amounts of computation. Our optimized crop includes as much of the original panorama as possible while avoiding regions that can be less successfully filled in. Our predictor can also be applied for hole filling in the interior of images. In addition to extensive comparative results, we ran several user studies validating our predictive feature, good relative quality of our results against those of other state-of-the-art algorithms, and our automatic cropping algorithm.",
        "id": 23,
        "tags": {
            "collaborators": [
                "Kopf",
                "Kienzle",
                "Kang"
            ],
            "subject": [
                "Graphics",
                "Photos"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "SIGGRAPHAsia"
            ]
        },
        "pdf": "papers/completion.pdf",
        "reference": "Johannes Kopf, Wolf Kienzle, Steven Drucker, Sing Bing Kang, Quality Prediction for Image Completion, ACM Transactions on Graphics (Proceedings of SIGGRAPH Asia 2012), 31(6), Article no. 196, 2012",
        "text": "completion.txt",
        "volume": "31",
        "title": "Quality prediction for image completion",
        "img": "researchImages/completion.png",
        "video": "http://research.microsoft.com/apps/video/default.aspx?id=173013",
        "primary": "Photos",
        "pages": "131",
        "year": "2012",
        "ENTRYTYPE": "article",
        "ID": "kopf2012quality",
        "journal": "ACM Transactions on Graphics (TOG)",
        "caption": "Completion"
    },
    {
        "publisher": "IEEE",
        "bibEntry": "<div class=\"csl-entry\">Liu, S., Chen, Y., Wei, H., Yang, J., Zhou, K., and Drucker, S. M. (2015). Exploring topical lead-lag across corpora. <i>IEEE Transactions on Knowledge and Data Engineering</i>, <i>27</i>(1), 115â\u0080\u0093129.</div>",
        "author": [
            "Liu, Shixia",
            "Chen, Yang",
            "Wei, Hao",
            "Yang, Jing",
            "Zhou, Kun",
            "Drucker, Steven M"
        ],
        "thumb": "thumbnail/leadlag.png",
        "number": "1",
        "abstract": "Identifying which text corpus leads in the context of a topic presents a great challenge of considerable interest to researchers. Recent research into lead-lag analysis has mainly focused on estimating the overall leads and lags between two corpora. However, real-world applications have a dire need to understand lead-lag patterns both globally and locally. In this paper, we introduce TextPioneer, an interactive visual analytics tool for investigating lead-lag across corpora from the global level to the local level. In particular, we extend an existing lead-lag analysis approach to derive two-level results. To convey multiple perspectives of the results, we have designed two visualizations, a novel hybrid tree visualization that couples a radial space-filling tree with a node-link diagram and a twisted-ladder-like visualization. We have applied our method to several corpora and the evaluation shows promise, especially in support of text comparison at different levels of detail.",
        "id": 11,
        "tags": {
            "collaborators": [
                "Liu",
                "Chen",
                "Wei",
                "Yang",
                "Zhou"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Machine Learning"
            ],
            "year": [
                "2014"
            ],
            "publication": [
                "TKDE"
            ]
        },
        "pdf": "papers/leadlag.pdf",
        "reference": "Liu, S., Chen, Y., Wei, H., Yang, J., Zhou, K., & Drucker, S. M. Exploring Topical Lead-Lag across Corpora. IEEE TKDE",
        "text": "textpioneerpaper.txt",
        "volume": "27",
        "title": "Exploring topical lead-lag across corpora",
        "img": "researchImages/leadlag.png",
        "video": "",
        "primary": "Visualization",
        "pages": "115--129",
        "year": "2015",
        "ENTRYTYPE": "article",
        "ID": "liu2015exploring",
        "journal": "IEEE Transactions on Knowledge and Data Engineering",
        "caption": "Topic-Lead-Lag"
    },
    {
        "booktitle": "Proceedings of the 21st annual ACM symposium on User interface software and technology",
        "id": 43,
        "organization": "ACM",
        "pdf": "papers/uist2008annotating.pdf",
        "reference": "Luan, Q, Drucker, S.M., Kopf, J., Xu, Y, Cohen, M.F. Annotating Gigapixel Images, UIST 2008",
        "img": "researchImages/annotategigapixel.jpg",
        "bibEntry": "<div class=\"csl-entry\">Luan, Q., Drucker, S. M., Kopf, J., Xu, Y.-Q., and Cohen, M. F. (2008). Annotating gigapixel images. In <i>Proceedings of the 21st annual ACM symposium on User interface software and technology</i> (pp. 33â\u0080\u009336). ACM.</div>",
        "text": "uist2008annotating.txt",
        "title": "Annotating gigapixel images",
        "author": [
            "Luan, Qing",
            "Drucker, Steven M",
            "Kopf, Johannes",
            "Xu, Ying-Qing",
            "Cohen, Michael F"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/Pixaura_CHI_08_v3.mov",
        "primary": "Photos",
        "tags": {
            "collaborators": [
                "Cohen",
                "Luan",
                "Kopf",
                "Xu"
            ],
            "subject": [
                "Visualization",
                "UI",
                "Photos"
            ],
            "year": [
                "2008"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "2008",
        "ENTRYTYPE": "inproceedings",
        "ID": "luan2008annotating",
        "caption": "Annotation Gigapixel Images",
        "pages": "33--36",
        "abstract": "Panning and zooming interfaces for exploring very large images containing billions of pixels (gigapixel images) have recently appeared on the internet. This paper addresses issues that arise when creating and rendering auditory and textual annotations for such images. In particular, we define a distance metric between each annotation and any view resulting from panning and zooming on the image. The distance then informs the rendering of audio annotations and text labels. We demonstrate the annotation system on a number of panoramic images.",
        "thumb": "thumbnail/annotategigapixel.jpg"
    },
    {
        "booktitle": "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
        "id": 40,
        "organization": "ACM",
        "pdf": "papers/papers/2008CHI_Contextual_Facets.pdf",
        "reference": "Medynskiy, Y., Dontcheva, M. Drucker, S.M., Exploring Websites through Contextual Facets, SIGCHI 2009.",
        "img": "researchImages/thumbnail_contextualfacets.png",
        "bibEntry": "<div class=\"csl-entry\">Medynskiy, Y., Dontcheva, M., and Drucker, S. M. (2009). Exploring websites through contextual facets. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 2013â\u0080\u00932022). ACM.</div>",
        "text": "2008CHI_Contextual_Facets.txt",
        "title": "Exploring websites through contextual facets",
        "author": [
            "Medynskiy, Yevgeniy",
            "Dontcheva, Mira",
            "Drucker, Steven M"
        ],
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Dontcheva",
                "Medynskiy"
            ],
            "subject": [
                "UI",
                "Information",
                "Search"
            ],
            "year": [
                "2009"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2009",
        "ENTRYTYPE": "inproceedings",
        "ID": "medynskiy2009exploring",
        "caption": "Contextual Facets",
        "pages": "2013--2022",
        "abstract": "We present contextual facets, a novel user interface technique for navigating websites that publish large collections of semi-structured data. Contextual facets extend traditional faceted navigation techniques by transforming webpage elements into user interface components for filtering and retrieving related webpages. To investigate users' reactions to contextual facets, we built FacetPatch, a web browser that automatically generates contextual facet interfaces. As the user browses the web, FacetPatch automatically extracts semi-structured data from collections of webpages and overlays contextual facets on top of the current page. Participants in an exploratory user evaluation of FacetPatch were enthusiastic about contextual facets and often preferred them to an existing, familiar faceted navigation interface. We discuss how we improved the design of contextual facets and FacetPatch based on the results of this study.",
        "thumb": "thumbnail/thumbnail_contextualfacets.png"
    },
    {
        "booktitle": "CHI'06 extended abstracts on Human factors in computing systems",
        "id": 55,
        "organization": "ACM",
        "pdf": "papers/stepUICHI06.pdf",
        "reference": "Meyers, B., Brush, A. B., Drucker, S., Smith, M. A., and Czerwinski, M. 2006. Dance your work away: exploring step user interfaces. In CHI '06 Human Factors in Computing Systems (Montr??al, Qu??bec, Canada, April 22 - 27, 2006). CHI '06. ACM Press, New York, NY, 387-392.",
        "img": "researchImages/stepUI27.jpg",
        "bibEntry": "<div class=\"csl-entry\">Meyers, B., Brush, A., Drucker, S., Smith, M. A., and Czerwinski, M. (2006). Dance your work away: exploring step user interfaces. In <i>CHIâ\u0080\u009906 extended abstracts on Human factors in computing systems</i> (pp. 387â\u0080\u0093392). ACM.</div>",
        "text": "stepUICHI06.txt",
        "title": "Dance your work away: exploring step user interfaces",
        "author": [
            "Meyers, Brian",
            "Brush, AJ",
            "Drucker, Steven",
            "Smith, Marc A",
            "Czerwinski, Mary"
        ],
        "video": "http://research.microsoft.com/~sdrucker/Video/StepStar.wmv",
        "primary": "Photos",
        "tags": {
            "collaborators": [
                "Meyers",
                "Brush",
                "Smith",
                "Czerwinski"
            ],
            "subject": [
                "UI",
                "Photos"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "inproceedings",
        "ID": "meyers2006dance",
        "caption": "Step User Interfaces",
        "pages": "387--392",
        "abstract": "While applications are typically optimized for traditional desktop interfaces using a keyboard and mouse, there are a variety of compelling reasons to consider alternative input mechanisms that require more physical exertion, including promoting fitness, preventing Repetitive Strain Injuries, and encouraging fun. We chose to explore physical interfaces based on foot motion and have built two applications with Step User Interfaces: StepMail and StepPhoto. Both support working with email and photos using the dance pad made popular by the Dance Dance Revolution (DDR) game. Results of a formative evaluation with ten participants suggest that the interactions are intuitive to learn, somewhat enjoyable, and cause participants to increase their level of exertion over sitting at a desk. Our evaluation also revealed design considerations for Step User Interfaces, including balancing effort across the body, avoiding needless exertion, and choosing target applications with care.",
        "thumb": "thumbnail/stepUI27.jpg"
    },
    {
        "publisher": "ACM",
        "bibEntry": "<div class=\"csl-entry\">Morris, M. R., Danielescu, A., Drucker, S., Fisher, D., Lee, B., and Wobbrock, J. O. (2014). Reducing legacy bias in gesture elicitation studies. <i>Interactions</i>, <i>21</i>(3), 40â\u0080\u009345.</div>",
        "author": [
            "Morris, Meredith Ringel",
            "Danielescu, Andreea",
            "Drucker, Steven",
            "Fisher, Danyel",
            "Lee, Bongshin",
            "Wobbrock, Jacob O"
        ],
        "thumb": "thumbnail/gestureelicitation.png",
        "number": "3",
        "abstract": "Improving methods for choosing appropriate gestures for novel user interaction techniques.",
        "id": 14,
        "tags": {
            "collaborators": [
                "Morris",
                "Danielescu",
                "Fisher",
                "Lee",
                "schraefel",
                "Wobbrock"
            ],
            "subject": [
                "UI"
            ],
            "year": [
                "2013"
            ],
            "publication": [
                "Interact"
            ]
        },
        "pdf": "papers/gesture_elicitation_interactions.pdf",
        "reference": "Meredith Ringel Morris, Andreea Danielescu, Steven Drucker, Danyel Fisher, Bongshin Lee, m.c. schraefel, and Jacob O. Wobbrock, Reducing Legacy Bias in Gesture Elicitation Studies, in ACM Interactions Magazine, ACM, May 2014",
        "text": "gesture_elicitation_interactions.txt",
        "volume": "21",
        "title": "Reducing legacy bias in gesture elicitation studies",
        "img": "researchImages/gestureelicitation.png",
        "video": "",
        "primary": "UI-Information",
        "pages": "40--45",
        "year": "2014",
        "ENTRYTYPE": "article",
        "ID": "morris2014reducing",
        "journal": "interactions",
        "caption": "GestureElicitation"
    },
    {
        "booktitle": "Proceedings of the 23nd annual ACM symposium on User interface software and technology",
        "id": 32,
        "organization": "ACM",
        "pdf": "papers/uist2010gestalt.pdf",
        "reference": "Patel, K, N. Bancroft, S.M.Drucker, J. Fogarty, A. Ko, J.Landay, Gestalt: Integrated Support for Implementation and Analysis in Machine Learning",
        "img": "researchImages/gestalt.png",
        "bibEntry": "<div class=\"csl-entry\">Patel, K., Bancroft, N., Drucker, S. M., Fogarty, J., Ko, A. J., and Landay, J. (2010). Gestalt: integrated support for implementation and analysis in machine learning. In <i>Proceedings of the 23nd annual ACM symposium on User interface software and technology</i> (pp. 37â\u0080\u009346). ACM.</div>",
        "text": "uist2010gestalt.txt",
        "title": "Gestalt: integrated support for implementation and analysis in machine learning",
        "author": [
            "Patel, Kayur",
            "Bancroft, Naomi",
            "Drucker, Steven M",
            "Fogarty, James",
            "Ko, Andrew J",
            "Landay, James"
        ],
        "video": "http://www.youtube.com/watch?v=9XC-D2L93jA&feature=player_embedded",
        "primary": "Machine Learning",
        "tags": {
            "collaborators": [
                "Patel",
                "Bancroft",
                "Fogarty",
                "Ko",
                "Landay"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Machine Learning",
                "Programming"
            ],
            "year": [
                "2010"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "2010",
        "ENTRYTYPE": "inproceedings",
        "ID": "patel2010gestalt",
        "caption": "Gestalt",
        "pages": "37--46",
        "abstract": "We present Gestalt, a development environment designed tosupport the process of applying machine learning. While traditional programming environments focus on source code, we explicitly support both code and data. Gestalt allows developers to implement a classification pipeline, analyze data as it moves through that pipeline, and easily transition between implementation and analysis. An experiment shows this significantly improves the ability of developers to find and fix bugs in machine learning systems. Our discussion of Gestalt and our experimental observations provide new insight into general-purpose support for the  achine learning process.",
        "thumb": "thumbnail/gestalt.png"
    },
    {
        "booktitle": "IJCAI Proceedings-International Joint Conference on Artificial Intelligence",
        "img": "researchImages/prospect.png",
        "number": "1",
        "id": 28,
        "pdf": "papers/ijcai11.pdf",
        "reference": "Patel, K, S.M.Drucker, J. Fogarty, A. Kapoor, D.S.Tan, Prospect: Using Multiple Models to Understand Data, Proceedings of the International Joint Conference on Artificial Intelligence (IJCAI 2011)",
        "text": "ijcai11.txt",
        "bibEntry": "<div class=\"csl-entry\">Patel, K., Drucker, S. M., Fogarty, J., Kapoor, A., and Tan, D. S. (2011). Using multiple models to understand data. In <i>IJCAI Proceedings-International Joint Conference on Artificial Intelligence</i> (Vol. 22, p. 1723).</div>",
        "volume": "22",
        "title": "Using multiple models to understand data",
        "author": [
            "Patel, Kayur",
            "Drucker, Steven M",
            "Fogarty, James",
            "Kapoor, Ashish",
            "Tan, Desney S"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/visavis.wmv",
        "primary": "Machine Learning",
        "tags": {
            "collaborators": [
                "Patel",
                "Kapoor",
                "Fogarty",
                "Ko",
                "Tan"
            ],
            "subject": [
                "UI",
                "Visualization",
                "Machine Learning"
            ],
            "year": [
                "2011"
            ],
            "publication": [
                "IJCAI"
            ]
        },
        "year": "2011",
        "ENTRYTYPE": "inproceedings",
        "ID": "patel2011using",
        "caption": "Prospect",
        "pages": "1723",
        "abstract": "A human's ability to diagnose errors, gather data, and generate features in order to build better models is largely untapped. We hypothesize that analyzing results from multiple models can help people diagnose errors by understanding relationships among data, features, and algorithms. These relationships might otherwise be masked by the bias inherent to any individual model. We demonstrate this approach in our Prospect system, show how multiple models can be used to detect label noise and aid in generating new features, and validate our methods in a pair of experiments.",
        "thumb": "thumbnail/prospect.png"
    },
    {
        "id": 1,
        "img": "researchImages/sequencepreprocessing.png",
        "bibEntry": "<div class=\"csl-entry\">Sarikaya, A., Zgraggen, E., DeLine, R., Drucker, S., and Fisher, D. (2016). Sequence Pre-processing: Focusing Analysis of Log Event Data.</div>",
        "title": "Sequence Pre-processing: Focusing Analysis of Log Event Data",
        "author": [
            "Sarikaya, Alper",
            "Zgraggen, Emanuel",
            "DeLine, Rob",
            "Drucker, Steven",
            "Fisher, Danyel"
        ],
        "ID": "sarikayasequence",
        "caption": "Sequence Preprocessing",
        "year": "2016",
        "ENTRYTYPE": "article",
        "primary": "UI-Information",
        "abstract": "Many computational systems are generating log event data as a way to help developers understand the usage of applications in the wild.  While many commercial analysis tools exist, they tend to treat log event data as a Ã¢\u0080\u009cbag of eventsÃ¢\u0080\u009d instead of collections of observed sequences, where each sequence represents an individual session.  While recent work can support the visual analysis of event sequence data, log files tend to contain complexity in scale and noise that can foul downstream analyses.  In this work, we identify common recurring problems of noise that arise from the analysis of this data, and assert that methods for preprocessing can be a valuable tool to both focus data for downstream analysis and provide provenance support for visual analytics tools. These pre-processing methods can be performed interactively and in conjunction with analysis tools to iteratively refine rules to streamline visual analysis. Through several case studies, we identify the common sources of noise in log files and demonstrate how our proposed pre-processing methods can help to minimize excess data reaching downstream analysis tools. ",
        "tags": {
            "collaborators": [
                "Sarikaya",
                "Zgraggen",
                "DeLine",
                "Fisher"
            ],
            "subject": [
                "Information"
            ],
            "year": [
                "2016"
            ],
            "publication": [
                "Workshop"
            ]
        }
    },
    {
        "booktitle": "Proceedings of the 22nd British HCI Group Annual Conference on People and Computers: Culture, Creativity, Interaction-Volume 2",
        "id": 42,
        "organization": "British Computer Society",
        "pdf": "papers/HCI_2008_TentativeDecisionsPixaurafinal.pdf",
        "reference": "Elgart, Kamppari, Lewis, Prasad, Rhee, Satpathy, Drucker, Pixaura: Supporting Tentative Decision Making when Selecting and Sharing Digital Photos, HCI 2008",
        "img": "researchImages/pixAura.jpg",
        "bibEntry": "<div class=\"csl-entry\">Satpathy, L., Kamppari, S., Lewis, B., Prasad, A., Rhee, Y. W., Elgart, B., and Drucker, S. (2008). Pixaura: supporting tentative decision making when selecting and sharing digital photos. In <i>Proceedings of the 22nd British HCI Group Annual Conference on People and Computers: Culture, Creativity, Interaction-Volume 2</i> (pp. 87â\u0080\u009391). British Computer Society.</div>",
        "text": "HCI_2008_TentativeDecisionsPixaurafinal.txt",
        "title": "Pixaura: supporting tentative decision making when selecting and sharing digital photos",
        "author": [
            "Satpathy, Lalatendu",
            "Kamppari, Saara",
            "Lewis, Bridget",
            "Prasad, Ajay",
            "Rhee, Yong Woo",
            "Elgart, Benjamin",
            "Drucker, Steven"
        ],
        "primary": "Photos",
        "tags": {
            "collaborators": [
                "Elgart",
                "Kamppari",
                "Lewis",
                "Prasad",
                "Rhee",
                "Satpathy"
            ],
            "subject": [
                "UI",
                "Photos"
            ],
            "year": [
                "2008"
            ],
            "publication": [
                "HCI"
            ]
        },
        "year": "2008",
        "ENTRYTYPE": "inproceedings",
        "ID": "satpathy2008pixaura",
        "caption": "Pixaura",
        "pages": "87--91",
        "abstract": "Current advances in digital technology promote capturing and storing more digital photos than ever. While photo collections are growing in size, the amount of time that can be devoted to viewing, managing, and sharing digital photos remains constant. Photo decision-making and selection has been identified as key to addressing this concern. After conducting exploratory research on photo decision-making including a wide-scale survey of user behaviors, detailed contextual inquiries, and longer-term diary studies, Pixaura was designed to address problems that emerged from our research. Specifically, Pixaura aims to bridge the gap between importing source photos and sharing them with others, by supporting tentative decision-making within the selection process. For this experience, the system incorporates certain core elements: 1) flexibility to experiment with relationships between photos and groups of photos, 2) the ability to closely couple photos while sharing only a subset of those photos, and 3) a tight connection between the photo selection and photo sharing space.",
        "thumb": "thumbnail/pixAura.jpg"
    },
    {
        "thumb": "thumbnail/dataparallel.gif",
        "id": 92,
        "primary": "Graphics",
        "pdf": "papers/GIraytrace.pdf",
        "reference": "Schroeder, P. and Drucker, S.M. Data Parallel Raytracing. Graphics Interface '92. Vancouver, B.C. 1992.",
        "img": "researchImages/dataparallel.gif",
        "bibEntry": "<div class=\"csl-entry\">Schroder, P., and Drucker, S. (1992). A data parallel algorithm for raytracing of heterogeneous databases. <i>Proceedings of Computer Graphics Interface</i>, 167â\u0080\u0093175.</div>",
        "text": "GIraytrace.txt",
        "title": "A data parallel algorithm for raytracing of heterogeneous databases",
        "author": [
            "Schroder, Peter",
            "Drucker, Steven"
        ],
        "ID": "schroder1992data",
        "tags": {
            "collaborators": [
                "Schroeder"
            ],
            "subject": [
                "Graphics",
                "Parallel Computing"
            ],
            "year": [
                "1992"
            ],
            "publication": [
                "GI"
            ]
        },
        "year": "1992",
        "ENTRYTYPE": "article",
        "journal": "Proceedings of Computer Graphics Interface",
        "pages": "167--175",
        "abstract": "We describe a new data parallel algorithm for raytracing. Load balancing is achieved through the use of processor allocation, which continually remaps available resources. In this manner heterogeneous data bases are handled without the usual problems of low resource usage. The proposed approach adapts well to both extremes: a small number of rays and a large database; a large number of rays and a small database. The algorithm scales linearly|over a wide range|in the number of rays and available processors. We present an implementation on the Connection Machine CM2 system and provide timings.",
        "caption": "Parallel Raytracing"
    },
    {
        "id": 54,
        "number": "4",
        "primary": "Photos",
        "publisher": "ACM",
        "img": "researchImages/findthatphoto.png",
        "bibEntry": "<div class=\"csl-entry\">Shneiderman, B., Bederson, B. B., and Drucker, S. M. (2006). Find that photo!: interface strategies to annotate, browse, and share. <i>Communications of the ACM</i>, <i>49</i>(4), 69â\u0080\u009371.</div>",
        "volume": "49",
        "title": "Find that photo!: interface strategies to annotate, browse, and share",
        "author": [
            "Shneiderman, Ben",
            "Bederson, Benjamin B",
            "Drucker, Steven M"
        ],
        "ID": "shneiderman2006find",
        "tags": {
            "collaborators": [
                "Shneiderman",
                "Bederson"
            ],
            "subject": [
                "Photos"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                ""
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "article",
        "journal": "Communications of the ACM",
        "pages": "69--71",
        "caption": "Find That Photo"
    },
    {
        "thumb": "thumbnail/perfanalysis.png",
        "id": 99,
        "publisher": "IEEE",
        "pdf": "papers/tactilesensor.pdf",
        "reference": "Siegel, D.; Drucker, S.; Garabieta, I, Performance analysis of a tactile sensor, Robotics and Automation. Proceedings. 1987 IEEE International Conference on , vol.4, no., pp.1493,1499, March 1987",
        "img": "researchImages/perfanalysis.png",
        "bibEntry": "<div class=\"csl-entry\">Siegel, D. M., Drucker, S. M., and Garabieta, I. (1987). <i>Performance analysis of a tactile sensor</i>. IEEE.</div>",
        "text": "tactilesensor.txt",
        "title": "Performance analysis of a tactile sensor",
        "author": [
            "Siegel, David M",
            "Drucker, Steven M",
            "Garabieta, Inaki"
        ],
        "ID": "siegel1987performance",
        "caption": "Tactile Sensor",
        "year": "1987",
        "ENTRYTYPE": "misc",
        "primary": "Robotics",
        "abstract": "This paper discusses the design of a contact sensor for use with the Utah-MIT dexterous hand [Jacobsen, et al. 1984]. The sensor utilizes an 8x8 array of capacitive cells. This paper extends the work presented in Siegel and Garabiet [1986], and the ealier work of Boie [1984]; a more detailed design analysis, modifications to the construction process, and better performance results are shown.",
        "tags": {
            "collaborators": [
                "Siegel",
                "Garabieta"
            ],
            "subject": [
                "Robotics",
                "Touch"
            ],
            "year": [
                "1987"
            ],
            "publication": [
                "IEEE"
            ]
        }
    },
    {
        "booktitle": "CHI'99 Extended Abstracts on Human Factors in Computing Systems",
        "id": 83,
        "organization": "ACM",
        "img": "researchImages/countingcommunities.png",
        "bibEntry": "<div class=\"csl-entry\">Smith, M. A., Drucker, S. M., Kraut, R., and Wellman, B. (1999). Counting on community in cyberspace. In <i>CHIâ\u0080\u009999 Extended Abstracts on Human Factors in Computing Systems</i> (pp. 87â\u0080\u009388). ACM.</div>",
        "title": "Counting on community in cyberspace",
        "author": [
            "Smith, Marc A",
            "Drucker, Steven M",
            "Kraut, Robert",
            "Wellman, Barry"
        ],
        "ID": "smith1999counting",
        "tags": {
            "collaborators": [
                "Smith",
                "Kraut",
                "Wellman"
            ],
            "subject": [
                "Social"
            ],
            "year": [
                "1999"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "1999",
        "ENTRYTYPE": "inproceedings",
        "primary": "Social",
        "pages": "87--88",
        "caption": "Counting Community"
    },
    {
        "booktitle": "Proceedings of the SIGCHI conference on Human Factors in Computing Systems",
        "id": 77,
        "organization": "ACM",
        "pdf": "papers/chisoclife.pdf",
        "reference": "Smith, M., Farnham, S., & Drucker S. The Social Life of Small Graphical Chat Spaces. In Proceedings of CHI 2000, The Hague, Netherlands March 2000.",
        "img": "researchImages/socialavatar.jpg",
        "bibEntry": "<div class=\"csl-entry\">Smith, M. A., Farnham, S. D., and Drucker, S. M. (2000). The social life of small graphical chat spaces. In <i>Proceedings of the SIGCHI conference on Human Factors in Computing Systems</i> (pp. 462â\u0080\u0093469). ACM.</div>",
        "text": "chisoclife.txt",
        "title": "The social life of small graphical chat spaces",
        "author": [
            "Smith, Marc A",
            "Farnham, Shelly D",
            "Drucker, Steven M"
        ],
        "primary": "Social",
        "tags": {
            "collaborators": [
                "Smith",
                "Farnham"
            ],
            "subject": [
                "Social"
            ],
            "year": [
                "2000"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2000",
        "ENTRYTYPE": "inproceedings",
        "ID": "smith2000social",
        "caption": "Social Life of Avatars",
        "pages": "462--469",
        "abstract": "This paper provides a unique quantitative analysis of the social dynamics of three chat rooms in the Microsoft V-Chat graphical chat system. Survey and behavioral data were used to study user experience and activity. 150 V-Chat participants completed a web-based survey, and data logs were collected from three V-Chat rooms over the course of 119 days. This data illustrates the usage patterns of graphical chat systems, and highlights the ways physical proxemics are translated into social interactions in online Environments. V-Chat participants actively used gestures, avatars, and movement as part of their social interactions. Analyses of clustering patterns and movement data show that avatars were used to provide nonverbal cues similar to those found in face-to-face interactions. However, use of some graphical features, in particular gestures, declined as users became more experienced with the system. These findings have implications for the design and study of online interactive environments.",
        "thumb": "thumbnail/socialavatar.jpg"
    },
    {
        "booktitle": "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
        "id": 38,
        "organization": "ACM",
        "pdf": "papers/2008CHI_VisualSnippets.pdf",
        "reference": "Teevan, J. Cutrell, E., Fisher, D., Drucker, S.M., Ramos, G., Andre, P., Hu, C., Visual Snippets: Summarizing Web Pages for Search and Revisitation",
        "img": "researchImages/thumbnail_visualsnippets.png",
        "bibEntry": "<div class=\"csl-entry\">Teevan, J., Cutrell, E., Fisher, D., Drucker, S. M., Ramos, G., AndrÃ©, P., and Hu, C. (2009). Visual snippets: summarizing web pages for search and revisitation. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 2023â\u0080\u00932032). ACM.</div>",
        "text": "2008CHI_VisualSnippets.txt",
        "title": "Visual snippets: summarizing web pages for search and revisitation",
        "author": [
            "Teevan, Jaime",
            "Cutrell, Edward",
            "Fisher, Danyel",
            "Drucker, Steven M",
            "Ramos, Gonzalo",
            "Andr{\\'e}, Paul",
            "Hu, Chang"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/facetPatchCameraReady.mov",
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Teevan",
                "Cutrell",
                "Fisher",
                "Ramos",
                "Andre",
                "Hu"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Design",
                "Search"
            ],
            "year": [
                "2009"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2009",
        "ENTRYTYPE": "inproceedings",
        "ID": "teevan2009visual",
        "caption": "Visual Snippets",
        "pages": "2023--2032",
        "abstract": "People regularly interact with different representations of Web pages. A person looking for new information may initially find a Web page represented as a short snippet rendered by a search engine. When he wants to return to the same page the next day, the page may instead be represented by a link in his browser history. Previous research has explored how to best represent Web pages in support of specific task types, but, as we find in this paper, consistency in representation across tasks is also important. We explore how different representations are used in a variety of contexts and present a compact representation that supports both the identification of new, relevant Web pages and the re-finding of previously viewed pages.",
        "thumb": "thumbnail/thumbnail_visualsnippets.png"
    },
    {
        "booktitle": "Proceedings of the SIGCHI Conference on Human Factors in Computing Systems",
        "id": 37,
        "organization": "ACM",
        "pdf": "papers/2008CHI_reform.pdf",
        "reference": "Toomim, M., Drucker, S.M., Dontcheva, M., Rahimi, A., Thomson, B., Landay, J.A., Attaching UI Enhancements to Websites with End Users, SIGCHI 2009.",
        "img": "researchImages/thumbnail_reform.jpg",
        "bibEntry": "<div class=\"csl-entry\">Toomim, M., Drucker, S. M., Dontcheva, M., Rahimi, A., Thomson, B., and Landay, J. A. (2009). Attaching UI enhancements to websites with end users. In <i>Proceedings of the SIGCHI Conference on Human Factors in Computing Systems</i> (pp. 1859â\u0080\u00931868). ACM.</div>",
        "text": "2008CHI_reform.txt",
        "title": "Attaching UI enhancements to websites with end users",
        "author": [
            "Toomim, Michael",
            "Drucker, Steven M",
            "Dontcheva, Mira",
            "Rahimi, Ali",
            "Thomson, Blake",
            "Landay, James A"
        ],
        "video": "http://research.microsoft.com/~sdrucker/video/ThumbtackFinal/ThumbtackIntroductionVideo.wmv",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "Toomim",
                "Dontcheva",
                "Rahimi",
                "Thomson",
                "Landay"
            ],
            "subject": [
                "UI",
                "Information",
                "Web"
            ],
            "year": [
                "2009"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2009",
        "ENTRYTYPE": "inproceedings",
        "ID": "toomim2009attaching",
        "caption": "reForm",
        "pages": "1859--1868",
        "abstract": "There are not enough programmers to support all end user goals by building websites, mashups, and browser extensions. This paper presents reform, a system that envisions roles for both programmers and end-users in creating enhancements of existing websites that support new goals. Programmers author a traditional mashup or browser extension, but instead of writing a web scraper by hand, the reform system enables novice end users to attach the mashup to their websites of interest. reform both makes scraping easier for the programmer and carries the benefit that endusers can retarget the enhancements towards completely different web sites, using a new programming by example interface and machine learning algorithm for web data extraction. This work presents reform's architecture, algorithms, user interface, evaluation, and five example reform enabled enhancements that provide a step towards our goal of write-once apply-anywhere user interface enhancements.",
        "thumb": "thumbnail/thumbnail_reform.jpg"
    },
    {
        "booktitle": "COOTS",
        "id": 85,
        "img": "researchImages/vworlds.png",
        "bibEntry": "<div class=\"csl-entry\">Vellon, M., Marple, K., Mitchell, D., and Drucker, S. (1998). The Architecture of a Distributed Virtual Worlds System. In <i>COOTS</i> (pp. 211â\u0080\u0093218).</div>",
        "title": "The Architecture of a Distributed Virtual Worlds System.",
        "author": [
            "Vellon, Manny",
            "Marple, Kirk",
            "Mitchell, Don",
            "Drucker, Steven"
        ],
        "ID": "vellon1998architecture",
        "tags": {
            "collaborators": [
                "Vellon",
                "Marple",
                "Mitchell"
            ],
            "subject": [
                "Graphics",
                "UI",
                "Social"
            ],
            "year": [
                "1998"
            ],
            "publication": [
                "OOPSLA"
            ]
        },
        "year": "1998",
        "ENTRYTYPE": "inproceedings",
        "primary": "Graphics",
        "pages": "211--218",
        "caption": "VWorlds"
    },
    {
        "booktitle": "Proceedings of the 12th annual ACM symposium on User interface software and technology",
        "id": 82,
        "organization": "ACM",
        "pdf": "papers/chat.pdf",
        "reference": "David Vronay, Marc Smith, and Steven M. Drucker, Chat as a Streaming Media Data Type, UIST. 1999.",
        "img": "researchImages/streamChat.jpg",
        "bibEntry": "<div class=\"csl-entry\">Vronay, D., Smith, M., and Drucker, S. (1999). Alternative interfaces for chat. In <i>Proceedings of the 12th annual ACM symposium on User interface software and technology</i> (pp. 19â\u0080\u009326). ACM.</div>",
        "text": "chat.txt",
        "title": "Alternative interfaces for chat",
        "author": [
            "Vronay, David",
            "Smith, Marc",
            "Drucker, Steven"
        ],
        "primary": "Social",
        "tags": {
            "collaborators": [
                "Vronay",
                "Smith"
            ],
            "subject": [
                "UI",
                "Social"
            ],
            "year": [
                "1999"
            ],
            "publication": [
                "UIST"
            ]
        },
        "year": "1999",
        "ENTRYTYPE": "inproceedings",
        "ID": "vronay1999alternative",
        "caption": "Streaming Chat",
        "pages": "19--26",
        "abstract": "We describe some common problems experienced by users of computer-based text chat, and show how many of these problems relate to the loss of timing-specific information.  We suggest that thinking of chat as a streaming media data type might solve some of these problems.  We then present a number of alternative chat interfaces along with results from user studies comparing and contrasting them both with each other and with the standard chat interface.",
        "thumb": "thumbnail/streamChat.jpg"
    },
    {
        "booktitle": "ACM Transactions on Graphics (TOG)",
        "bibEntry": "<div class=\"csl-entry\">Wang, J., Drucker, S. M., Agrawala, M., and Cohen, M. F. (2006). The cartoon animation filter. In <i>ACM Transactions on Graphics (TOG)</i> (Vol. 25, pp. 1169â\u0080\u00931173). ACM.</div>",
        "author": [
            "Wang, Jue",
            "Drucker, Steven M",
            "Agrawala, Maneesh",
            "Cohen, Michael F"
        ],
        "thumb": "thumbnail/aniequation.jpg",
        "number": "3",
        "abstract": "We present the 'Cartoon Animation Filter', a simple filter that takes an arbitrary input motion signal and modulates it in such a way that the output motion is more 'alive' or 'animated'. The filter adds a smoothed, inverted, and (sometimes) time shifted version of the second derivative (the acceleration) of the signal back into the original signal. Almost all parameters of the filter are automated. The user only needs to set the desired strength of the filter. The beauty of the animation filter lies in its simplicity and generality. We apply the filter to motions ranging from hand drawn trajectories, to simple animations within PowerPoint presentations, to motion captured DOF curves, to video segmentation results. Experimental results show that the filtered motion exhibits anticipation, follow-through, exaggeration and squash-and-stretch effects which are not present in the original input motion data.",
        "id": 53,
        "organization": "ACM",
        "pdf": "papers/TheCartoonAnimationFilter.pdf",
        "reference": "Jue Wang, Steven Drucker, Maneesh Agrawala, Michael Cohen, The Cartoon Animation Filter, ACM Transactions on Graphics (Proceedings of SIGGRAPH 2006), July 2006",
        "text": "TheCartoonAnimationFilter.txt",
        "volume": "25",
        "title": "The cartoon animation filter",
        "img": "researchImages/aniequation.jpg",
        "video": "http://research.microsoft.com/~sdrucker/Video/af.mov",
        "primary": "Graphics",
        "tags": {
            "collaborators": [
                "Wang",
                "Agrawala",
                "Cohen"
            ],
            "subject": [
                "Graphics",
                "Animation"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "SIGGRAPH"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "inproceedings",
        "ID": "wang2006cartoon",
        "pages": "1169--1173",
        "caption": "Cartoon Animation Filter"
    },
    {
        "booktitle": "Proceedings of the 16th international conference on World Wide Web",
        "id": 46,
        "organization": "ACM",
        "pdf": "papers/WhiteWWW2007.pdf",
        "reference": "Investigating Behavioral Variability in Web Search, Ryen W. White and Steven M. Drucker  16th International World Wide Web Conference (WWW 2007), Pages: 21-30 Banff, Canada, May 2007",
        "img": "researchImages/websearch.png",
        "bibEntry": "<div class=\"csl-entry\">White, R. W., and Drucker, S. M. (2007). Investigating behavioral variability in web search. In <i>Proceedings of the 16th international conference on World Wide Web</i> (pp. 21â\u0080\u009330). ACM.</div>",
        "text": "WhiteWWW2007.txt",
        "title": "Investigating behavioral variability in web search",
        "author": [
            "White, Ryen W",
            "Drucker, Steven M"
        ],
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "White"
            ],
            "subject": [
                "Visualization",
                "UI",
                "Search",
                "Web"
            ],
            "year": [
                "2007"
            ],
            "publication": [
                "WWW"
            ]
        },
        "year": "2007",
        "ENTRYTYPE": "inproceedings",
        "ID": "white2007investigating",
        "caption": "Web Search Variability",
        "pages": "21--30",
        "abstract": "Understanding the extent to which people's search behaviors differ in terms of the interaction flow and information targeted is important in designing interfaces to help World Wide Web users search more effectively. In this paper we describe a longitudinal log-based study that investigated variability in people's interaction behavior when engaged in search-related activities on the Web. We analyze the search interactions of more than two thousand volunteer users over a five-month period, with the aim of characterizing differences in their interaction styles. The findings of our study suggest that there are dramatic differences in variability in key aspects of the interaction within and between users, and within and between the search queries they submit. Our findings also suggest two classes of extreme user navigators and explorers whose search interaction is highly consistent or highly variable. Lessons learned from these users can inform the design of tools to support effective Web-search interactions for everyone.",
        "thumb": "thumbnail/websearch.png"
    },
    {
        "booktitle": "CHI'07 Extended Abstracts on Human Factors in Computing Systems",
        "id": 47,
        "organization": "ACM",
        "pdf": "papers/p2877-white.pdf",
        "reference": "White RW, Drucker SM, Marchionini G, Hearst M, schraefel MC. Exploratory search and HCI: designing and evaluating interfaces to support exploratory search interaction [Internet]. In: CHI '07 extended abstracts on Human factors in computing systems. San Jose, CA, USA: ACM; 2007 [cited 2010 Aug 10]. p. 2877-2880",
        "img": "researchImages/ExpSearchint.png",
        "bibEntry": "<div class=\"csl-entry\">White, R. W., Drucker, S. M., Marchionini, G., Hearst, M., and others. (2007). Exploratory search and HCI: designing and evaluating interfaces to support exploratory search interaction. In <i>CHIâ\u0080\u009907 Extended Abstracts on Human Factors in Computing Systems</i> (pp. 2877â\u0080\u00932880). ACM.</div>",
        "text": "p2877-white.txt",
        "title": "Exploratory search and HCI: designing and evaluating interfaces to support exploratory search interaction",
        "author": [
            "White, Ryen W",
            "Drucker, Steven M",
            "Marchionini, Gary",
            "Hearst, Marti",
            "others, "
        ],
        "video": "",
        "primary": "UI-Information",
        "tags": {
            "collaborators": [
                "White",
                "Marchionini",
                "Hearst",
                "schraefel"
            ],
            "subject": [
                "Visualization",
                "UI",
                "Search",
                "Web"
            ],
            "year": [
                "2007"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2007",
        "ENTRYTYPE": "inproceedings",
        "ID": "white2007exploratory",
        "caption": "Search Workshop",
        "pages": "2877--2880",
        "abstract": "The model of search as a turn-taking dialogue between the user and an intermediary has remained unchanged for decades. However, there is growing interest within the search community in evolving this model to support search-driven information exploration activities. So-called exploratory search describes a class of search activities that move beyond fact retrieval toward fostering learning, investigation, and information use. Exploratory search interaction focuses on the user-system communication essential during exploratory search processes. Given this user-centered focus, the CHI conference is an ideal venue to discuss mechanisms to support exploratory searchbehaviors. Specifically, this workshop aims to gather researchers, academics, and practitioners working in human-computer interaction, information retrieval, and other related disciplines, for a discussion of the issues relating to the design and evaluation of interfaces to help users explore, learn, and use information. These are important issues with far-reaching implications for how many computer users accomplish their tasks.",
        "thumb": "thumbnail/ExpSearchint.png"
    },
    {
        "thumb": "thumbnail/CACM.png",
        "id": 52,
        "img": "researchImages/CACM.png",
        "number": "4",
        "primary": "UI-Information",
        "pdf": "papers/2007introacm.pdf",
        "reference": "White RW, Kules B, Drucker SM, schraefel M. Introduction. Commun. ACM. 2006;49(4):36-39.",
        "text": "2007introacm.txt",
        "bibEntry": "<div class=\"csl-entry\">White, R. W., Kules, B., Drucker, S. M., and others. (2006). Supporting exploratory search, introduction, special issue, communications of the ACM. <i>Communications of the ACM</i>, <i>49</i>(4), 36â\u0080\u009339.</div>",
        "volume": "49",
        "title": "Supporting exploratory search, introduction, special issue, communications of the ACM",
        "author": [
            "White, Ryen W",
            "Kules, Bill",
            "Drucker, Steven M",
            "others, "
        ],
        "ID": "white2006supporting",
        "tags": {
            "collaborators": [
                "White",
                "Kules",
                "schraefel"
            ],
            "subject": [
                "UI",
                "Search"
            ],
            "year": [
                "2006"
            ],
            "publication": [
                "ACM"
            ]
        },
        "year": "2006",
        "ENTRYTYPE": "article",
        "journal": "Communications of the ACM",
        "pages": "36--39",
        "caption": "Exploratory Search"
    },
    {
        "booktitle": "Expanding the Frontiers of Visual Analytics and Visualization",
        "publisher": "Springer London",
        "img": "researchImages/visualizationsurfaces.png",
        "bibEntry": "<div class=\"csl-entry\">Whitted, T., and Drucker, S. (2012). Visualization Surfaces. In <i>Expanding the Frontiers of Visual Analytics and Visualization</i> (pp. 417â\u0080\u0093427). Springer London.</div>",
        "title": "Visualization Surfaces",
        "author": [
            "Whitted, Turner",
            "Drucker, Steven"
        ],
        "ID": "whitted2012visualization",
        "tags": {
            "collaborators": [
                "Whitted"
            ],
            "subject": [
                "UI",
                "Visualization"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "Book"
            ]
        },
        "year": "2012",
        "ENTRYTYPE": "incollection",
        "primary": "Visualization",
        "pages": "417--427",
        "abstract": "Large displays suitable for visualization applications are typically constructed from arrays of smaller ones. The physical and optical challenges of designing these assemblies are the first topic addressed here.",
        "id": 22,
        "caption": "Visualization Surfaces"
    },
    {
        "thumb": "thumbnail/collab.jpg",
        "id": 81,
        "primary": "Social",
        "pdf": "papers/collabviz.pdf",
        "reference": "Rebecca Xiong, Marc A. Smith,Steven M. Drucker, Visualizations of Collaborative Information for End-Users,  Internal Report, 1999.",
        "img": "researchImages/collab.jpg",
        "bibEntry": "<div class=\"csl-entry\">Xiong, R., Smith, M. A., and Drucker, S. M. (1998). Visualizations of collaborative information for end-users. <i>Microsoft Research</i>, 1â\u0080\u00938.</div>",
        "text": "collabviz.txt",
        "title": "Visualizations of collaborative information for end-users",
        "author": [
            "Xiong, Rebecca",
            "Smith, Marc A",
            "Drucker, Steven M"
        ],
        "ID": "xiong1998visualizations",
        "tags": {
            "collaborators": [
                "Xiong",
                "Smith"
            ],
            "subject": [
                "Visualization",
                "Social"
            ],
            "year": [
                "1999"
            ],
            "publication": [
                "InternalReport"
            ]
        },
        "year": "1998",
        "ENTRYTYPE": "article",
        "journal": "Microsoft Research",
        "pages": "1--8",
        "abstract": "There is a growing need for methods and tools to illuminate the social contexts of interaction environments created by the World Wide Web, Usenet newsgroups, email lists, and other network interaction media. We present here a framework for creating visualizations of the social connections created in and through network interaction media. Using graph-drawing methods, visualizations can be created for a range of systems that link people to people and people to objects through networks. As an example, we present an application of our methods to the Usenet to illustrate how visualization can improve existing systems.  We propose that users of network interaction media can benefit from visualizations that illuminate the interaction context generated by the rich interconnections between groups, conversations, and people in these media.",
        "caption": "Collaborative Visualization"
    },
    {
        "thumb": "thumbnail/intermedia2.gif",
        "id": 97,
        "primary": "Hypertext",
        "pdf": "papers/connintermedia.pdf",
        "reference": "Yankelovich, N, Haan, B.J., and Drucker, S.M., Connections in Context: the Intermedia Systems. International Conference on Systems Sciences, Vol. 2 pp. 715-724, January: 1988.",
        "img": "researchImages/intermedia2.gif",
        "bibEntry": "<div class=\"csl-entry\">Yankelovich, N., Haan, B., and Drucker, S. (1987). Connections in Context: The intermedia system. <i>Providence, Rhode Island: Institute for Research in Information and Scholarship, Brown University</i>.</div>",
        "text": "intermedia1.txt",
        "title": "Connections in Context: The intermedia system",
        "author": [
            "Yankelovich, Nicole",
            "Haan, Bernard",
            "Drucker, Steven"
        ],
        "ID": "yankelovich1987connections",
        "caption": "Intermedia2",
        "year": "1987",
        "ENTRYTYPE": "article",
        "journal": "Providence, Rhode Island: Institute for Research in Information and Scholarship, Brown University",
        "abstract": "none",
        "tags": {
            "collaborators": [
                "Yankelovich",
                "Haan"
            ],
            "subject": [
                "Hyptertext",
                "UI",
                "Information"
            ],
            "year": [
                "1988"
            ],
            "publication": [
                "ICSS"
            ]
        }
    },
    {
        "thumb": "thumbnail/intermedia.gif",
        "id": 96,
        "img": "researchImages/intermedia.gif",
        "number": "1",
        "primary": "Hypertext",
        "pdf": "papers/intermedia1.pdf",
        "reference": "Yankelovich, N, Haan, B.J., Meyrowitz, N. and Drucker, S.M., INTERMEDIA: The Concept and Construction of a Seamless Environment. IEEE Computer, January: 1988.",
        "text": "connintermedia.txt",
        "bibEntry": "<div class=\"csl-entry\">Yankelovich, N., Haan, B. J., Meyrowitz, N. K., and Drucker, S. M. (1988). Intermedia: The concept and the construction of a seamless information environment. <i>IEEE Computer</i>, <i>21</i>(1), 81â\u0080\u009396.</div>",
        "volume": "21",
        "title": "Intermedia: The concept and the construction of a seamless information environment",
        "author": [
            "Yankelovich, Nicole",
            "Haan, Bernard J.",
            "Meyrowitz, Norman K.",
            "Drucker, Steven M."
        ],
        "ID": "yankelovich1988intermedia",
        "tags": {
            "collaborators": [
                "Yankelovich",
                "Haan",
                "Meyrowitz"
            ],
            "subject": [
                "Hyptertext",
                "UI",
                "Information"
            ],
            "year": [
                "1988"
            ],
            "publication": [
                "IEEE"
            ]
        },
        "year": "1988",
        "ENTRYTYPE": "article",
        "journal": "IEEE computer",
        "pages": "81--96",
        "abstract": "none",
        "caption": "Intermedia1"
    },
    {
        "booktitle": "Proceedings of the IMAGE VI conference",
        "id": 87,
        "pdf": "papers/mission.pdf",
        "reference": "Zeltzer, D. and Drucker, S.M. A Virtual Environment System for Mission Planning. Proc. 1992 IMAGE VI Conference. Phoenix, AZ. 1992.",
        "img": "researchImages/darpa.gif",
        "bibEntry": "<div class=\"csl-entry\">Zeltzer, D., and Drucker, S. (1992). A virtual environment system for mission planning. In <i>Proceedings of the IMAGE VI conference</i> (pp. 125â\u0080\u0093134).</div>",
        "text": "mission.txt",
        "title": "A virtual environment system for mission planning",
        "author": [
            "Zeltzer, David",
            "Drucker, Steven"
        ],
        "primary": "Camera",
        "tags": {
            "collaborators": [
                "Zeltzer"
            ],
            "subject": [
                "Graphics",
                "Camera",
                "Thesis"
            ],
            "year": [
                "1994"
            ],
            "publication": [
                "Thesis"
            ]
        },
        "year": "1992",
        "ENTRYTYPE": "inproceedings",
        "ID": "zeltzer1992virtual",
        "caption": "Mission Planner",
        "pages": "125--134",
        "abstract": "A key function of a mission planning system is to enhance and maintain situational awareness of planning personnel and aircrews who will use the system for pre-mission rehearsals and briefings. We have developed a mission planner using virtual environment technology. We provide a task level interface to computational models of aircraft, terrain, threats and targets, so that users interact directly with these models using voice and gesture recognition, 3D positional input, 3 axis force output, and intelligent camera control.",
        "thumb": "thumbnail/darpa.gif"
    },
    {
        "link": "https://www.microsoft.com/en-us/research/publication/squeries-visual-regular-expressions-for-querying-and-exploring-event-sequences/",
        "id": 5,
        "publisher": "ACM Association for Computing Machinery",
        "pdf": "papers/chi2015-squeries.pdf",
        "reference": "Zgraggen, Emanuel, Steven M. Drucker, Danyel Fisher, Rob DeLine. (s|qu)eries: Visual Regular Expressions for Querying and Exploring Event Sequences. Proceedings of ACM Conference on Human Factors in Computing Systems (CHI 2015).",
        "month": "April",
        "bibEntry": "<div class=\"csl-entry\">Zgraggen, E., Drucker, S., Fisher, D., and DeLine, R. (2015). <i>(s|qu)eries: Visual Regular Expressions for Querying and Exploring Event Sequences</i>. ACM Association for Computing Machinery.</div>",
        "text": "chi2015-squeries.txt",
        "title": "(s|qu)eries: Visual Regular Expressions for Querying and Exploring Event Sequences",
        "img": "researchImages/squeries.png",
        "ID": "squeries-visual-regular-expressions-for-querying-and-exploring-event-sequences",
        "tags": {
            "collaborators": [
                "Zgraggen",
                "Fisher",
                "DeLine"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Touch",
                "Sequences"
            ],
            "year": [
                "2015"
            ],
            "publication": [
                "SIGCHI"
            ]
        },
        "year": "2015",
        "ENTRYTYPE": "proceedings",
        "primary": "Visualization",
        "caption": "Squeries",
        "author": [
            "Zgraggen, Emanuel",
            "Drucker, Steven",
            "Fisher, Danyel",
            "DeLine, Rob"
        ],
        "abstract": "Many different domains collect event sequence data and rely on finding and analyzing patterns within it to gain meaningful insights. Current systems that support such queries either provide limited expressiveness, hinder exploratory workflows or present interaction and visualization models which do not scale well to large and multi-faceted data sets. In this paper we present (s|qu)eries (pronounced 'Squeries'), a visual query interface for creating queries on sequences (series) of data, based on regular expressions. (s|qu)eries is a touchbased system that exposes the full expressive power of regular expressions in an approachable way and interleaves query specification with result visualizations. Being able to visually investigate the results of different query-parts supports debugging and encourages iterative query-building as well as exploratory work-flows. We validate our design and implementation through a set of informal interviews with data scientists that analyze event sequences on a daily basis.",
        "thumb": "thumbnail/squeries.png"
    },
    {
        "publisher": "IEEE",
        "bibEntry": "<div class=\"csl-entry\">Zgraggen, E., Zeleznik, R., and Drucker, S. M. (2014). PanoramicData: Data analysis through pen and touch. <i>IEEE Transactions on Visualization and Computer Graphics</i>, <i>20</i>(12), 2112â\u0080\u00932121.</div>",
        "author": [
            "Zgraggen, Emanuel",
            "Zeleznik, Robert",
            "Drucker, Steven M"
        ],
        "thumb": "thumbnail/panodata.png",
        "number": "12",
        "abstract": "Interactively exploring multidimensional datasets requires frequent switching among a range of distinct but inter-related tasks (e.g., producing different visuals based on different column sets, calculating new variables, and observing the interactions between sets of data). Existing approaches either target specific different problem domains (e.g., data-transformation or datapresentation) or expose only limited aspects of the general exploratory process; in either case, users are forced to adopt coping strategies (e.g., arranging windows or using undo as a mechanism for comparison instead of using side-by-side displays) to compensate for the lack of an integrated suite of exploratory tools. PanoramicData (PD) addresses these problems by unifying a comprehensive set of tools for visual data exploration into a hybrid pen and touch system designed to exploit the visualization advantages of large interactive displays. PD goes beyond just familiar visualizations by including direct UI support for data transformation and aggregation, filtering and brushing. Leveraging an unbounded whiteboard metaphor, users can combine these tools like building blocks to create detailed interactive visual display networks in which each visualization can act as a filter for others. Further, by operating directly on relational-databases, PD provides an approachable visual language that exposes a broad set of the expressive power of SQL, including functionally complete logic filtering, computation of aggregates and natural table joins. To understand the implications of this novel approach, we conducted a formative user study with both data and visualization experts. The results indicated that the system provided a fluid and natural user experience for probing multi-dimensional data and was able to cover the full range of queries that the users wanted to pose",
        "id": 10,
        "tags": {
            "collaborators": [
                "Zgraggen",
                "Zeleznik"
            ],
            "subject": [
                "Information",
                "Visualization",
                "Touch"
            ],
            "year": [
                "2014"
            ],
            "publication": [
                "Infovis"
            ]
        },
        "pdf": "papers/PanoramicData.pdf",
        "reference": "Zgraggen, Emanuel, Robert Zeleznik, and Steven M. Drucker. PanoramicData: Data Analysis through Pen & Touch. (2014).",
        "text": "PanoramicData.txt",
        "volume": "20",
        "title": "PanoramicData: Data analysis through pen \\& touch",
        "img": "researchImages/panodata.png",
        "video": "",
        "primary": "Visualization",
        "pages": "2112--2121",
        "year": "2014",
        "ENTRYTYPE": "article",
        "ID": "zgraggen2014panoramicdata",
        "journal": "IEEE transactions on visualization and computer graphics",
        "caption": "Panoramic Data"
    },
    {
        "booktitle": "Proceedings of the International Working Conference on Advanced Visual Interfaces",
        "id": 21,
        "organization": "ACM",
        "pdf": "papers/timeslice.pdf",
        "reference": "Jian Zhao, Steven Drucker, Danyel Fisher, Donald Brinkman. TimeSlice: Interactive Faceted Browsing of Timeline Data. In AVI'12: Proceedings of the International Working Conference on Advanced Visual Interfaces, pp. 433-436, May 2012.",
        "img": "researchImages/timeslice.png",
        "bibEntry": "<div class=\"csl-entry\">Zhao, J., Drucker, S. M., Fisher, D., and Brinkman, D. (2012). TimeSlice: Interactive faceted browsing of timeline data. In <i>Proceedings of the International Working Conference on Advanced Visual Interfaces</i> (pp. 433â\u0080\u0093436). ACM.</div>",
        "text": "timeslice.txt",
        "title": "TimeSlice: Interactive faceted browsing of timeline data",
        "author": [
            "Zhao, Jian",
            "Drucker, Steven M",
            "Fisher, Danyel",
            "Brinkman, Donald"
        ],
        "primary": "Visualization",
        "tags": {
            "collaborators": [
                "Zhao",
                "Fisher",
                "Brinkman"
            ],
            "subject": [
                "UI",
                "Information",
                "Visualization",
                "Temporal"
            ],
            "year": [
                "2012"
            ],
            "publication": [
                "AVI"
            ]
        },
        "year": "2012",
        "ENTRYTYPE": "inproceedings",
        "ID": "zhao2012timeslice",
        "caption": "TimeSlice",
        "pages": "433--436",
        "abstract": "Temporal events with multiple sets of metadata attributes, i.e., facets, are ubiquitous across different domains. The capabilities of efficiently viewing and comparing events data from various perspectives are critical for revealing relationships, making hypotheses, and discovering patterns. In this paper, we present TimeSlice, an interactive faceted visualization of temporal events, which allows users to easily compare and explore timelines with different attributes on a set of facets. By directly manipulating the filtering tree, a dynamic visual representation of queries and filters in the facet space, users can simultaneously browse the focused timelines and their contexts at different levels of detail, which supports efficient navigation of multi-dimensional events data. Also presented is an initial evaluation of TimeSlice with two datasets - famous deceased people and US daily flight delays.",
        "thumb": "thumbnail/timeslice.png"
    }
];
},{}],22:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '33807' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[22,7], null)