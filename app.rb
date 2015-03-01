require 'bundler'
Bundler.require

set :port, 3000

get '/' do
  slim :index
end

get '/screenshot' do
  @url = params[:url]
  base64 = `casperjs bin/screenshot.js '#{@url}'`
  halt 500, 'error' unless base64
  return base64
end
