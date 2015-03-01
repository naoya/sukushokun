require 'bundler'
Bundler.require

set :port, 3000

get '/' do
  slim :index
end

get '/screenshot' do
  @url = params[:url]
  command = "casperjs bin/screenshot.js '#{@url}'"
  if params[:mobile]
    command = command + " mobile"
  end
  base64 = `#{command}`
  halt 500, 'error' unless base64
  return base64
end
