require 'sinatra'
require 'sinatra/reloader' if development?
require 'slim'
require './app'

run Sinatra::Application
