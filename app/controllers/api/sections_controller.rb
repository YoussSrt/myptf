module Api
  class SectionsController < ApplicationController
    def about
      render partial: "pages/about", layout: false
    end

    def projects
      render partial: "pages/projects", layout: false
    end

    def skills
      render partial: "pages/skills", layout: false
    end

    def contact
      render partial: "pages/contact", layout: false
    end
  end
end
