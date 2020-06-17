(ns viz.core
  (:gen-class)
  (:require [cheshire.core :as cc]
            [oz.core :as oz]))
(def data-set (cc/parse-string (slurp "resources/progress.json") true))

(def progress-set
  (map (fn [{:keys [release total]}]
         (let* [tested (- (:tested total)(:new_tested total))
                new_untested (- (:new total)(:new_tested total))
                untested (- (:endpoints total) new_untested tested)]
         (assoc {}
                :release release
                :total {
                        :tested tested
                        :untested (- (:endpoints total) new_untested (:tested total))
                        :new_untested new_untested
                        :new_tested (:new_tested total)
                        })))
       data-set))

(def progress
  (flatten
   (map #(for [key (keys (:total %))]
           (let [order {:tested "a" :new_tested "b" :untested "c" :new_untested "d"}]
           (assoc {}
                  :release (:release %)
                  :type (name key)
                  :total (get-in % [:total key])
                  :order (get order key)
                  )))
        progress-set)))

(def ratio-set
  (map (fn [{:keys [release total]}]
         (assoc {}
                :release release
                :total {
                        :tested (:new total)
                        :still_untested (:still_untested total)}))
       data-set))

(def ratio
  (flatten
   (map #(for [key (keys (:total %))]
           (assoc {}
                  :release (:release %)
                  :type (name key)
                  :total (get-in % [:total key])))
        ratio-set)))

(def bar-chart
  {:data {:values progress}
   :width "900"
   :height "600"
   :encoding {:x {:field "release"
                  :type "nominal"
                  :sort (:release data-set)}
              :y {:field "total"
                  :type "quantitative"
                  :title "Total Stable! Endpoints"}
              :color {:field "type" :type "nominal"}
              :tooltip [{:field "type" :type "ordinal"}
                        {:field "total" :type "quantitative"}]
              :order {:field "order"}}
   :mark {:type "bar"}})

(def ratio-chart
  {:data {:values ratio}
   :width "900"
   :height "600"
   :encoding {:x {:field "release"
                  :type "nominal"
                  :sort (:release data-set)}
              :y {:field "total"
                  :type "quantitative"
                  :title "Total Stable! Endpoints"}
              :tooltip [{:field "type" :type "ordinal"}
                        {:field "total" :type "quantitative"}]
              :color {:field "type" :type "nominal"}}
   :mark {:type "bar" :tooltip true}})

(def chart
  [:main
   [:h1 "APISnoop Progress reports"]
   [:div#prologue
    [:p "These charts track the progress on conformance coverage for kubernetes stable endpoints."]
    [:p "In these, we only look at endpoints that are in GA, and qualify for conformance tests (do not use vendor specific features like volumes and other non-conformant behaviour)."]
    [:p"We also limited the set to only endpoints still around today.  Historically stable endpoints that have been deprecated were excluded from our dataset." ]]
   [:h2 "Stable Endpoint Coverage Over Time"]
   [:em "In this, we look at the total endpoints per release and how many came in with tests.  We also track the overall testing coverage per release."]
   [:vega-lite bar-chart]
   [:p "There's some interesting takeaways in this chart.  For one, it wasn't possible to see which tests where hitting which endpoints until 1.12, and the tooling to better track this until a few releases later. Because of this, there's little coverage increase for releases 1.11 through 1.14; new tests were being added, but they weren't hitting new endpoints."]
   [:p "In 1.16, the community set a requirement for any endpoint promoted to come with a conformance test.  That release was a standout in terms of coverage: a significant number of new endpoints were added, with the majority promoted with tests"]
   [:p "Our latest release is also looking extremely positive, with every new endpoint promoted comiong in with a test, along with the general testing coverage going up."]
   [:h2 "New endpoints per release and their current coverage"]
   [:em "In this chart we look at how many endpoints were promoted per release, and of that group, how many are untested today."]
   [:p "We start the report at 1.8, so this will have the most new endpoints (since it really starts with all the existing endpoints at that time).  This report highlights the importance of having a gate that ensures any promoted endpoint comes with a test.  This became an initiative in 1.16 and that release has one of the best ratios of introduced to tested.  1.19 is also looking impressive, with currently 100% coverage on all its endpoints."]
   [:vega-lite ratio-chart]])

(oz/start-server!)
(oz/view! chart)

(oz/export! chart "../docs/index.html")

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println "Hello, World!"))
