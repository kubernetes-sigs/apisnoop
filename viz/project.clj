(defproject viz "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [metasoarous/oz "1.6.0-alpha6"]]
  :main ^:skip-aot viz.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
