require 'sinatra'
require 'sinatra/reloader' if development?
require 'slim'

run Sinatra::Application
