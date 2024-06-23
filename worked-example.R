{r}
library(simcausal)
library(ranger)
library(tidyverse)
library(ggdag)
library(MatchIt)
library(WeightIt)
library(survey)
library(tableone)
library(cobalt)   
library(PSweight)  
library(tmle)
library(DoubleML)
library(mlr3)
library(mlr3learners)
set.seed(12345)

D_AW <- DAG.empty() + 
  node("age", distr = "rnorm", mean = 50, sd = 10) +
  node("gender", distr = "rbern", prob = 0.5) +
  node("priorchol", distr = "rnorm", mean = 200 + 0.5 * age, sd = 30) +
  node("statin", distr = "rbern", prob = plogis(-2 + 0.02 * priorchol + 0.01 * age - 0.5 * gender)) +
  node("cholesterol", distr = "rnorm", mean = 180 - 20 * statin + 0.8 * priorchol + 0.5 * age + 5 * gender, sd = 15)

D_AW_set <- set.DAG(D_AW)
plotDAG(D_AW_set, xjitter = 0.3, yjitter = 0.3)